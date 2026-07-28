<script setup lang="ts">
import Popup from "@/components/popup/Popup.vue";
import { type PopupKey, usePopupStore } from "@/stores/popup.ts";
import { ref, watch } from "vue";
import type { AddBookCopyRequest, BookCopyAdmin } from "@/types";
import api from "@/api";

const popupStore = usePopupStore();

const addBookCopyRequest = ref<any>();

async function confirmCallback() {
  // 提交请求
  const data = await api.post<BookCopyAdmin>('/api/book-copies', addBookCopyRequest.value);
  // 关闭弹窗，返回数据
  popupStore.close(data);
}

// 监听弹窗打开
watch(() => popupStore.popups, (newValue: PopupKey | undefined) => {
  if (newValue === 'addBookCopy') {
    addBookCopyRequest.value = {
      book_id: popupStore.safePayload<'addBookCopy'>().id,
      purchase_price: 0,
      purchase_date: new Date().toISOString().slice(0, 10),
      source: '',
    } as AddBookCopyRequest;
  }
})
</script>

<template>
  <Popup popup-key="addBookCopy" title="添加馆藏" confirm="添加" @confirm="confirmCallback">
    <form class="max-h-[50vh] space-y-3 overflow-y-auto pl-1 pr-1 pb-1">
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          购入价格
        </label>
        <input v-model="addBookCopyRequest.purchase_price" data-slot="input" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40">
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          购入日期
        </label>
        <input v-model="addBookCopyRequest.purchase_date" data-slot="input" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" type="date">
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          来源
        </label>
        <input v-model="addBookCopyRequest.source" data-slot="input" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40">
      </div>
    </form>
  </Popup>
</template>

<style scoped>

</style>