<script setup lang="ts">
import Popup from "@/components/popup/Popup.vue";
import { type PopupKey, usePopupStore } from "@/stores/popup.ts";
import api from "@/api";
import { computed, ref, watch } from "vue";
import type { Book, Category } from "@/types";

const popupStore = usePopupStore();

const book = ref<Book>();
const originalCategory = ref<Category>();

const allCategories = ref<Category[]>([]);
const selectedCategory = ref<Category>({ id: -1, name: '' });

const customCategoryInput = ref<string>("");
const customCategory = computed(() => (customCategoryInput.value as string).split(' ')[0]);

async function confirmCallback() {
  let category;
  // 创建分类
  if (customCategory.value)
    category = (await api.post<Category>('/api/categories', { name: customCategory.value } )).data
  else
    category = selectedCategory.value;
  // 提交请求
  const data = await api.put<Book>('/api/books/' + book.value?.id, { ...book.value, category_id: category?.id });
  // 刷新分类列表
  popupStore.close(data);
}

// 监听弹窗打开
watch(() => popupStore.popups, async (newValue: PopupKey | undefined) => {
  if (newValue === 'editCategory') {
    // 获取所有分类
    allCategories.value = (await api.get<Category[]>('/api/categories')).data;
    // 刷新 payload（深拷贝以避免影响原始数据）
    const payload = popupStore.safePayload<'editCategory'>();
    book.value = payload.book;
    originalCategory.value = payload.category;
    // 刷新选中状态
    selectedCategory.value = payload.category;
    // 刷新自定义分类
    customCategoryInput.value = "";
  }
});
</script>

<template>
  <Popup popup-key="editCategory" title="编辑分类" confirm="保存" @confirm="confirmCallback">
    <div class="space-y-4">
      <div>
        <label data-slot="label" class="items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 mb-2 block">
          从分类库选择
        </label>
        <div class="flex flex-wrap gap-2">
          <template v-for="category in allCategories">
            <!-- disabled 通过两次求反强制转 boolean 类型，空字符串对应 false -->
            <!-- data-active 使用一次求反，空字符串对应 true -->
            <button type="button" @click="selectedCategory = category" :disabled="!!customCategory" :data-active="!customCategory && selectedCategory.id === category.id" class="rounded-full border border-(--border) px-2.5 py-0.5 text-xs text-(--foreground) transition-colors
               hover:border-(--primary) hover:text-(--primary)
               disabled:bg-(--muted) disabled:text-(--muted-foreground) disabled:border-none
               data-[active=true]:bg-(--primary) data-[active=true]:text-(--primary-foreground) data-[active=true]:border-transparent">
              {{ category.name }}
            </button>
          </template>
        </div>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="custom-tag">
          自定义标签
        </label>
        <input v-model="customCategoryInput" data-slot="input" placeholder="输入分类名" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" value="">
      </div>
      <div v-if="customCategory" class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="custom-tag">
          新建分类预览
        </label>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="rounded-full border border-transparent px-2.5 py-0.5 text-xs text-(--primary-foreground) transition-colors bg-(--primary)">
            {{ customCategory }}
          </button>
        </div>
      </div>
    </div>
  </Popup>
</template>

<style scoped>

</style>