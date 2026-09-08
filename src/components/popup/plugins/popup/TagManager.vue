<script setup lang="ts">
import Popup from "@/components/popup/core/Popup.vue";
import { computed, onMounted, ref } from "vue";
import { usePopupStore } from "@/stores/popup.ts";
import api from "@/api";
import type { Tag } from "@/types";
import { Message } from "@/components/message";

interface TagWithStatus extends Tag {
  status: 'exists' | 'updated' | 'deleted';
  originalName: string;
}

const popupStore = usePopupStore();

const tags = ref<TagWithStatus[]>([]);
const operationMode = ref<'edit' | 'delete' | null>(null); // 操作模式：'edit' 修改名称，'delete' 删除确认
const selectedTag = ref<TagWithStatus | null>(null); // 对 selectedTag.value 的属性的修改，会同步到标签列表，因此不能从此处直接修改值
const editName = ref<string>(""); // 可以从这里修改标签名，这是当前选中的标签的名称的缓存
const customTagInput = ref<string>(""); // 自定义标签输入框的值
const created = computed<string[]>(() => Array.from(new Set((customTagInput.value as string).split(' ').filter(tag => tag.trim()))));
const updated = computed(() => tags.value.filter(t => t.status === 'updated' && t.name !== t.originalName).map(t => ({ id: t.id, name: t.name, originalName: t.originalName })))
const deleted = computed(() => tags.value.filter(t => t.status === 'deleted').map(t => ({ id: t.id, name: t.originalName })));

// 点击标签
function selectTag(tag: TagWithStatus) {
  if (tag.status === 'deleted') {
    // 点击已删除的标签，恢复它
    tag.status = tags.value.some(t => t.id === tag.id && t.name === tag.originalName) ? 'exists' : 'updated';
    selectedTag.value = null;
    return;
  }
  if (tag.id === selectedTag.value?.id) {
    selectedTag.value = null;
    return;
  }
  selectedTag.value = tag;
  operationMode.value = null;
}

// 点击修改名称中的确定
function confirmEdit() {
  // 简单验证
  if (!selectedTag.value || !editName.value.trim()) {
    Message.warning("标签名不能为空");
    return;
  }
  // 更新名称与状态
  const newName = editName.value.trim();
  selectedTag.value.name = newName;
  selectedTag.value.status = newName !== selectedTag.value.originalName ? 'updated' : 'exists';
  // 关闭修改名称模式
  operationMode.value = null;
}

// 点击删除确认中的确定
function confirmDelete() {
  // 类型安全
  if (!selectedTag.value)
    return;
  // 更新状态
  selectedTag.value.status = 'deleted';
  // 关闭删除确认模式
  operationMode.value = null;
  // 重置选中标签
  selectedTag.value = null;
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
      messages.push(`修改：${updated.value.map(t => `${t.originalName} → ${t.name}`).join('、')}`);
    if (deleted.value.length)
      messages.push(`删除：${deleted.value.map(t => t.name).join('、')}`);
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
  results.created = created.value.length ? (await api.post<Tag[]>('/api/tags', created.value)).data.map(t => t.name) : [];
  results.updated = updated.value.length ? (await api.put<Tag[]>(`/api/tags`, updated.value.map(t => ({ id: t.id, name: t.name })))).data.map(t => t.name) : [];
  results.deleted = deleted.value.length ? (await api.delete<Tag[]>(`/api/tags`, { params: { ids: deleted.value.map(t => t.id) } })).data.map(t => t.name) : [];

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
  popupStore.registerInitHook('tagManager', async () => {
    // 重置状态
    tags.value = [];
    selectedTag.value = null;
    operationMode.value = null;
    editName.value = "";
    customTagInput.value = "";
    // 请求数据
    const data = (await api.get<Tag[]>('/api/tags')).data;
    tags.value = data.map(tag => ({
      ...tag,
      status: 'exists' as const,
      originalName: tag.name
    })).sort((a, b) => a.id - b.id);
  })
})
</script>

<template>
  <Popup popup-key="tagManager" title="标签管理" description="您可以新建、修改和删除标签。" confirm-text="保存" :confirm-handler="confirmHandler">
    <div class="space-y-4">
      <!-- 标签展示区 -->
      <div v-if="tags.length > 0" class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          标签列表
          <span class="text-xs text-(--muted-foreground)">（点击选择，点击已删除可恢复）</span>
        </label>
        <div class="flex flex-wrap gap-2">
          <template v-for="tag in tags" :key="tag.id">
            <button type="button" @click="selectTag(tag)"
                    :data-active="selectedTag?.id === tag.id && tag.status !== 'deleted'"
                    :data-deleted="tag.status === 'deleted'"
                    :data-modified="tag.status === 'updated'"
                    class="rounded-full border px-2.5 py-0.5 text-xs transition-colors
                border-(--border) text-(--foreground)
                hover:border-(--primary) hover:text-(--primary)
                data-[active=true]:bg-(--primary) data-[active=true]:text-(--primary-foreground) data-[active=true]:border-transparent
                data-[deleted=true]:bg-(--muted) data-[deleted=true]:text-(--muted-foreground) data-[deleted=true]:border-none data-[deleted=true]:line-through
                data-[modified=true]:border-(--primary)"
            >
              {{ tag.status === 'deleted' ? tag.originalName : tag.name }}
              <span v-if="tag.status === 'updated'" class="ml-1 text-[10px]">*</span>
            </button>
          </template>
        </div>
      </div>

      <!-- 操作面板 -->
      <div v-if="tags.length > 0" class="space-y-2 rounded-lg border border-(--border) bg-(--card)">
        <div class="flex items-center justify-between m-3">
          <div class="flex items-center gap-2">
            <span v-if="!selectedTag" class="py-1 text-sm text-(--muted-foreground)">点击一个标签以开始编辑</span>
            <span v-if="selectedTag" class="shrink-0 py-1 text-sm">已选择：</span>
            <span v-if="selectedTag" class="py-1 text-sm">{{ selectedTag.name }}</span>
          </div>
          <div v-if="selectedTag" class="shrink-0 flex gap-2">
            <button :disabled="operationMode === 'edit'" type="button" @click="operationMode = 'edit'; editName = selectedTag.name" class="px-3 py-1 rounded-lg text-xs transition-colors border border-(--border) text-(--foreground) hover:not-disabled:border-(--primary) hover:not-disabled:text-(--primary) disabled:text-(--muted-foreground)">
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
          <input v-model="editName" @keyup.enter="confirmEdit" data-slot="input" placeholder="输入新标签名" class="flex-1 rounded-lg border border-(--input) bg-transparent px-2 py-1 text-sm transition-colors outline-none placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 dark:bg-(--input)/30"/>
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
            <span class="text-sm">确认删除该标签？</span>
            <span class="text-xs text-(--muted-foreground)">正在使用的标签无法删除。</span>
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

      <!-- 新建标签 -->
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="custom-tag">
          新建标签
        </label>
        <input v-model="customTagInput" data-slot="input" placeholder="输入标签名，多个名称间使用空格分隔" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" value="">
      </div>
      <div v-if="created.length" class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="custom-tag">
          新建标签预览
        </label>
        <div class="flex flex-wrap gap-2">
          <template v-for="customTag in created">
            <button type="button" class="rounded-full border border-transparent px-2.5 py-0.5 text-xs text-(--primary-foreground) transition-colors bg-(--primary)">
              {{ customTag }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </Popup>
</template>

<style scoped>

</style>