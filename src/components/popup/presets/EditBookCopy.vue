<script setup lang="ts">
import Popup from "@/components/popup/Popup.vue";
import { type PopupKey, usePopupStore } from "@/stores/popup.ts";
import api from "@/api";
import type { BookCopyAdmin } from "@/types";
import { ref, watch } from "vue";

const popupStore = usePopupStore();

const bookCopyId = ref<number>(-1);
const purchasePrice = ref<number>(0);
const purchaseDate = ref<string>("");
const source = ref<string>("");

function confirmHandler() {
  return api.put<BookCopyAdmin>(`/api/book-copies/${bookCopyId.value}`, { purchase_price: purchasePrice.value, purchase_date: purchaseDate.value, source: source.value });
}

// 监听弹窗打开
watch(() => popupStore.popups, async (newValue: PopupKey | undefined) => {
  if (newValue === 'editBookCopy') {
    const payload = popupStore.safePayload<'editBookCopy'>();
    bookCopyId.value = payload.bookCopyId;
    purchasePrice.value = payload.purchasePrice;
    purchaseDate.value = payload.purchaseDate;
    source.value = payload.source;
  }
});
</script>

<template>
  <Popup popup-key="editBookCopy" title="编辑入库信息" confirm-text="保存" :confirm-handler="confirmHandler">
    <form class="max-h-[50vh] space-y-3 overflow-y-auto pl-1 pr-1 pb-1">
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          购入价格
        </label>
        <input v-model="purchasePrice" data-slot="input" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40">
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="return-time-102">
          购入日期
        </label>
        <input v-model="purchaseDate" data-slot="input" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" type="date">
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          来源
        </label>
        <input v-model="source" data-slot="input" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40">
      </div>
    </form>
  </Popup>
</template>

<style scoped>

</style>