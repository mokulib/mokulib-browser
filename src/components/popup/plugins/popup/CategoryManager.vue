<script setup lang="ts">
import Popup from "@/components/popup/core/Popup.vue";
import { computed, onMounted, ref } from "vue";
import { usePopupStore } from "@/stores/popup.ts";
import api from "@/api";
import type { Category } from "@/types";
import { Message } from "@/components/message";

interface CategoryWithStatus extends Category {
  status: 'exists' | 'updated' | 'deleted';
  originalName: string;
}

const popupStore = usePopupStore();

const categories = ref<CategoryWithStatus[]>([]);
const operationMode = ref<'edit' | 'delete' | null>(null); // 操作模式：'edit' 修改名称，'delete' 删除确认
const selectedCategory = ref<CategoryWithStatus | null>(null); // 对 selectedCategory.value 的属性的修改，会同步到分类列表，因此不能从此处直接修改值
const editName = ref<string>(""); // 可以从这里修改分类名，这是当前选中的分类的名称的缓存
const customCategoryInput = ref<string>(""); // 自定义分类输入框的值
const created = computed<string[]>(() => Array.from(new Set((customCategoryInput.value as string).split(' ').filter(category => category.trim()))));
const updated = computed(() => categories.value.filter(c => c.status === 'updated' && c.name !== c.originalName).map(c => ({ id: c.id, name: c.name, originalName: c.originalName })))
const deleted = computed(() => categories.value.filter(c => c.status === 'deleted').map(c => ({ id: c.id, name: c.originalName })));

// 点击分类
function selectCategory(category: CategoryWithStatus) {
  if (category.status === 'deleted') {
    // 点击已删除的分类，恢复它
    category.status = categories.value.some(c => c.id === category.id && c.name === category.originalName) ? 'exists' : 'updated';
    selectedCategory.value = null;
    return;
  }
  if (category.id === selectedCategory.value?.id) {
    selectedCategory.value = null;
    return;
  }
  selectedCategory.value = category;
  operationMode.value = null;
}

// 点击修改名称中的确定
function confirmEdit() {
  // 简单验证
  if (!selectedCategory.value || !editName.value.trim()) {
    Message.warning("分类名不能为空");
    return;
  }
  // 更新名称与状态
  const newName = editName.value.trim();
  selectedCategory.value.name = newName;
  selectedCategory.value.status = newName !== selectedCategory.value.originalName ? 'updated' : 'exists';
  // 关闭修改名称模式
  operationMode.value = null;
}

// 点击删除确认中的确定
function confirmDelete() {
  // 类型安全
  if (!selectedCategory.value)
    return;
  // 更新状态
  selectedCategory.value.status = 'deleted';
  // 关闭删除确认模式
  operationMode.value = null;
  // 重置选中分类
  selectedCategory.value = null;
}

// 显示变更确认弹窗
function showChangesConfirm(): Promise<boolean> {
  return new Promise((resolve) => {
    // 如果没有变更，则直接返回
    if (created.value.length === 0 && updated.value.length === 0 && deleted.value.length === 0) {
      Message.info("未做任何修改");
      resolve(false);
      return;
    }
    // 构建变更信息
    const messages: string[] = [];
    if (created.value.length)
      messages.push(`新建：${created.value.join('、')}`);
    if (updated.value.length)
      messages.push(`修改：${updated.value.map(c => `${c.originalName} → ${c.name}`).join('、')}`);
    if (deleted.value.length)
      messages.push(`删除：${deleted.value.map(c => c.name).join('、')}`);
    // 显示确认弹窗
    popupStore.open('confirm', {
      title: '确认变更',
      message: messages.join('<br>'),
      button: '确认',
      type: 'default'
    }, (confirmed: boolean) => {
      resolve(confirmed);
    });
  });
}

async function confirmHandler() {
  const confirmed = await showChangesConfirm();
  // 取消操作
  if (!confirmed)
    return;
  // 执行变更
  const results = { created: [] as string[], updated: [] as string[], deleted: [] as string[] };
  results.created = created.value.length ? (await api.post<Category[]>('/api/categories', created.value)).data.map(c => c.name) : [];
  results.updated = updated.value.length ? (await api.put<Category[]>(`/api/categories`, updated.value.map(c => ({ id: c.id, name: c.name })))).data.map(c => c.name) : [];
  results.deleted = deleted.value.length ? (await api.delete<Category[]>(`/api/categories`, { params: { ids: deleted.value.map(c => c.id) } })).data.map(c => c.name) : [];

  // 显示结果消息
  const resultMessages: string[] = [];
  if (results.created.length)
    resultMessages.push(`成功新建：${results.created.join('、')}`);
  if (results.updated.length)
    resultMessages.push(`成功修改：${results.updated.join('、')}`);
  if (results.deleted.length)
    resultMessages.push(`成功删除：${results.deleted.join('、')}`);

  if (resultMessages.length)
    Message.success(resultMessages.join('；'), 10000);
  else
    Message.info("没有进行任何修改");
}

onMounted(() => {
  popupStore.registerInitHook('categoryManager', async () => {
    // 重置状态
    categories.value = [];
    selectedCategory.value = null;
    operationMode.value = null;
    editName.value = "";
    customCategoryInput.value = "";
    // 请求数据
    const data = (await api.get<Category[]>('/api/categories')).data;
    categories.value = data.map(category => ({
      ...category,
      status: 'exists' as const,
      originalName: category.name
    })).sort((a, b) => a.id - b.id);
  })
})
</script>

<template>
  <Popup popup-key="categoryManager" title="分类管理" description="您可以新建、修改和删除分类。" confirm-text="保存" :confirm-handler="confirmHandler">
    <div class="space-y-4">
      <!-- 分类展示区 -->
      <div v-if="categories.length > 0" class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          分类列表
          <span class="text-xs text-(--muted-foreground)">（点击选择，点击已删除可恢复）</span>
        </label>
        <div class="flex flex-wrap gap-2">
          <template v-for="category in categories" :key="category.id">
            <button type="button" @click="selectCategory(category)"
              :data-active="selectedCategory?.id === category.id && category.status !== 'deleted'"
              :data-deleted="category.status === 'deleted'"
              :data-modified="category.status === 'updated'"
              class="rounded-full border px-2.5 py-0.5 text-xs transition-colors
                border-(--border) text-(--foreground)
                hover:border-(--primary) hover:text-(--primary)
                data-[active=true]:bg-(--primary) data-[active=true]:text-(--primary-foreground) data-[active=true]:border-transparent
                data-[deleted=true]:bg-(--muted) data-[deleted=true]:text-(--muted-foreground) data-[deleted=true]:border-none data-[deleted=true]:line-through
                data-[modified=true]:border-(--primary)"
            >
              {{ category.status === 'deleted' ? category.originalName : category.name }}
              <span v-if="category.status === 'updated'" class="ml-1 text-[10px]">*</span>
            </button>
          </template>
        </div>
      </div>

      <!-- 操作面板 -->
      <div v-if="categories.length > 0" class="space-y-2 rounded-lg border border-(--border) bg-(--card)">
        <div class="flex items-center justify-between m-3">
          <div class="flex items-center gap-2">
            <span v-if="!selectedCategory" class="py-1 text-sm text-(--muted-foreground)">点击一个分类以开始编辑</span>
            <span v-if="selectedCategory" class="py-1 text-sm">已选择：</span>
            <span v-if="selectedCategory" class="py-1 text-sm">{{ selectedCategory.name }}</span>
          </div>
          <div v-if="selectedCategory" class="flex gap-2">
            <button :disabled="operationMode === 'edit'" type="button" @click="operationMode = 'edit'; editName = selectedCategory.name" class="px-3 py-1 rounded-lg text-xs transition-colors border border-(--border) text-(--foreground) hover:not-disabled:border-(--primary) hover:not-disabled:text-(--primary) disabled:text-(--muted-foreground)">
              修改名称
            </button>
            <button :disabled="operationMode === 'delete'" type="button" @click="operationMode = 'delete'" class="px-3 py-1 rounded-lg text-xs transition-colors border border-(--border) text-(--destructive) hover:not-disabled:border-(--destructive) hover:not-disabled:bg-(--destructive) hover:not-disabled:text-(--primary-foreground) disabled:text-(--muted-foreground)">
              删除
            </button>
          </div>
        </div>

        <!-- 编辑操作 -->
        <div v-if="operationMode === 'edit'" class="flex items-stretch justify-between p-3 gap-2 border-t border-(--border)">
          <div class="flex flex-col justify-center">
            <span class="text-sm">新名称：</span>
          </div>
          <input v-model="editName" @keyup.enter="confirmEdit" data-slot="input" placeholder="输入新分类名" class="flex-1 rounded-lg border border-(--input) bg-transparent px-2 py-1 text-sm transition-colors outline-none placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 dark:bg-(--input)/30"/>
          <div class="flex items-center gap-2">
            <button type="button" @click="confirmEdit" class="px-3 py-1 rounded-lg text-xs transition-colors border border-(--border) text-(--destructive) hover:not-disabled:border-(--destructive) hover:not-disabled:bg-(--destructive) hover:not-disabled:text-(--primary-foreground) disabled:text-(--muted-foreground)">
              确定
            </button>
            <button type="button" @click="operationMode = null" class="px-3 py-1 rounded-lg border border-(--border) text-(--foreground) text-xs transition-colors hover:bg-(--muted)">
              取消
            </button>
          </div>
        </div>

        <!-- 删除确认 -->
        <div v-else-if="operationMode === 'delete'" class="flex items-stretch justify-between p-3 gap-2 border-t border-(--border)">
          <div class="flex flex-col justify-center gap-2">
            <span class="text-sm">确认删除该分类？</span>
            <span class="text-xs text-(--muted-foreground)">正在使用的分类无法删除。</span>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" @click="confirmDelete" class="px-3 py-1 rounded-lg text-xs transition-colors border border-(--border) text-(--destructive) hover:not-disabled:border-(--destructive) hover:not-disabled:bg-(--destructive) hover:not-disabled:text-(--primary-foreground) disabled:text-(--muted-foreground)">
              确认删除
            </button>
            <button type="button" @click="operationMode = null" class="px-3 py-1 rounded-lg border border-(--border) text-(--foreground) text-xs transition-colors hover:bg-(--muted)">
              取消
            </button>
          </div>
        </div>
      </div>

      <!-- 新建分类 -->
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="custom-tag">
          新建分类
        </label>
        <input v-model="customCategoryInput" data-slot="input" placeholder="输入分类名，多个名称间使用空格分隔" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" value="">
      </div>
      <div v-if="created.length" class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="custom-tag">
          新建分类预览
        </label>
        <div class="flex flex-wrap gap-2">
          <template v-for="customCategory in created">
            <button type="button" class="rounded-full border border-transparent px-2.5 py-0.5 text-xs text-(--primary-foreground) transition-colors bg-(--primary)">
              {{ customCategory }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </Popup>
</template>

<style scoped>

</style>