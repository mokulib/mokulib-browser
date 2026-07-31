<script setup lang="ts">
import Popup from "@/components/popup/Popup.vue";
import { type PopupKey, usePopupStore } from "@/stores/popup.ts";
import { computed, ref, watch } from "vue";
import api from "@/api";

const popupStore = usePopupStore();

const bookId = ref<number>(-1);

const selectedFile = ref<File | undefined>(undefined)
const isSelectedFile = computed(() => !selectedFile.value);

const handleFileChange = (event: Event) => {
  selectedFile.value = (event.target as HTMLInputElement).files?.[0];
}

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('文件读取失败')); // TODO 错误处理是否应该范围标准 Response 类型
    reader.readAsArrayBuffer(file);
  });
}

async function confirmHandler() {
  return api.post('/api/books/' + bookId.value + '/cover', await readFile(selectedFile.value as File), { headers: { 'Content-Type': 'application/octet-stream' } });
}

// 监听弹窗打开
watch(() => popupStore.popups, (newValue: PopupKey | undefined) => {
  if (newValue === 'uploadBookCover')
    bookId.value = popupStore.safePayload<'uploadBookCover'>().id;
})
</script>

<template>
  <Popup popup-key="uploadBookCover" title="重新上传封面" confirm-text="保存" :confirm-disabled="isSelectedFile" :confirm-handler="confirmHandler">
    <template #content>
      选择一张新的封面图片替换当前封面。
    </template>
    <template #default>
      <form class="space-y-3">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="cover-file">
          封面图片
        </label>
        <input data-slot="input" accept="image/*" @change="handleFileChange" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" type="file">
      </form>
    </template>
  </Popup>
</template>

<style scoped>

</style>