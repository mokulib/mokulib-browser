<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { type PopupKey, usePopupStore } from "@/stores/popup.ts";
import Popup from "@/components/popup/Popup.vue";
import type { Tag } from "@/types";
import api from "@/api";

interface TagWithStatus extends Tag {
  status: 'exists' | 'active' | 'none';
}

const popupStore = usePopupStore();

const bookId = ref<number>(0);
const existsTags = ref<Tag[]>([]);

const allTags = ref<Tag[]>([]);
const tags = ref<TagWithStatus[]>([]);

const customTagInput = ref<string>("");
const customTags = computed<string[]>(() => customTagInput.value.split(' ').filter(tag => tag));

function toggle(tag: TagWithStatus) {
  if (tag.status === 'exists')
    return;
  tag.status = tag.status === 'active' ? 'none' : 'active';
}

async function confirmCallback() {
  // 存放要添加的标签
  const addTags: number[] = [];
  // 对自定义标签集去重
  const customTagsWithoutDuplicates = [...new Set(customTags.value)];
  // 先创建新的自定义标签
  if (customTagsWithoutDuplicates.length) {
    // 提交创建请求
    const data = (await api.post<Tag[]>('/api/tags', customTagsWithoutDuplicates)).data;
    // 获取真正创建的标签列表
    if (data.length) {
      // 配置需要添加的标签（新创建的）
      data.forEach(tag => addTags.push(tag.id))
    }
  }
  // 配置需要添加的标签（已在标签库的）
  tags.value?.filter(value => value.status === 'active').forEach(tag => addTags.push(tag.id));
  // 提交请求
  const data = await api.post('/api/books/' + bookId.value + '/tags', addTags);
  // 关闭弹窗，返回数据
  popupStore.close(data);
}

// 监听弹窗状态
watch(() => popupStore.popups, async (newValue: PopupKey | undefined) => {
  // 本弹窗打开时，重新刷新数据
  if (newValue === 'addTag') {
    // 获取所有标签
    allTags.value = (await api.get<Tag[]>('/api/tags')).data;
    // 刷新 payload（深拷贝以避免影响原始数据）
    const payload = JSON.parse(JSON.stringify(popupStore.payload || [])) as { id: number, tags: Tag[] };
    bookId.value = payload.id;
    existsTags.value = payload.tags;
    // 刷新标签状态
    tags.value = allTags.value.map(tag => {
      return {
        id: tag.id,
        name: tag.name,
        status: existsTags.value?.some(existsTag => tag.id === existsTag.id) ? 'exists' : 'none'
      };
    })
    // 刷新自定义标签
    customTagInput.value = "";
  }
});
</script>

<template>
  <Popup popup-key="addTag" title="添加标签" confirm="添加" @confirm="confirmCallback">
    <template #content>
      从标签库中选择，或自定义一个新标签。
    </template>
    <template #default>
      <div class="space-y-4">
        <label data-slot="label" class="items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 mb-2 block">从标签库选择</label>
        <div class="flex flex-wrap gap-2">
          <template v-for="tag in tags">
            <button type="button" @click="toggle(tag)" :disabled="tag.status === 'exists'" :data-active="tag.status === 'active'" class="rounded-full border border-(--border) px-2.5 py-0.5 text-xs text-(--foreground) transition-colors
             hover:border-(--primary) hover:text-(--primary)
             disabled:bg-(--muted) disabled:text-(--muted-foreground) disabled:border-none
             data-[active=true]:bg-(--primary) data-[active=true]:text-(--primary-foreground) data-[active=true]:border-transparent">
              {{ tag.name }}
            </button>
          </template>
        </div>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="custom-tag">
          自定义标签
        </label>
        <input v-model="customTagInput" data-slot="input" placeholder="输入标签名，多个标签间使用空格分隔" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" value="">
      </div>
      <div v-if="customTags.length" class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="custom-tag">
          自定义标签预览
        </label>
        <div class="flex flex-wrap gap-2">
          <template v-for="tag in customTags">
            <button type="button" class="rounded-full border border-transparent px-2.5 py-0.5 text-xs text-(--primary-foreground) transition-colors bg-(--primary)">
              {{ tag }}
            </button>
          </template>
        </div>
      </div>
    </template>
  </Popup>
</template>

<style scoped>

</style>