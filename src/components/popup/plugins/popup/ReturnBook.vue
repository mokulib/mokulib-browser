<script setup lang="ts">
import Popup from "@/components/popup/core/Popup.vue";
import { usePopupStore } from "@/stores/popup.ts";
import { onMounted, ref } from "vue";
import api from "@/api";
import type { BookCopyAdmin } from "@/types";
import { DateTime } from "luxon";

const borrowRecordId = ref<any>();

const closeTimeInput = ref<string>(DateTime.now().toISO().slice(0, 16));
const closeStatusInput = ref<string>('CLOSE');

onMounted(() => {
  usePopupStore().registerInitHook('returnBook', ({ clone }) => {
    // 刷新 payload
    borrowRecordId.value = clone.id;
    // 刷新弹窗输入
    closeTimeInput.value = DateTime.now().toISO().slice(0, 16);
    closeStatusInput.value = 'CLOSE';
  })
})
</script>

<template>
  <Popup popup-key="returnBook" title="归还馆藏" confirm-text="确认归还" :confirm-handler="() => api.post<BookCopyAdmin>(`/api/borrow-records/${borrowRecordId}/return`, { close_status: closeStatusInput, close_time: closeTimeInput + ':00' })">
    <form class="space-y-4">
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="return-time-102">
          归还时间
        </label>
        <input v-model="closeTimeInput" data-slot="input" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" type="datetime-local">
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          归还状态
        </label>
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 text-sm text-(--foreground)">
            <input v-model="closeStatusInput" value="CLOSE" class="size-4 border-(--border) accent-(--primary)" type="radio" checked name="return-status-102">
            正常归还
          </label>
          <label class="flex items-center gap-2 text-sm text-(--foreground)">
            <input v-model="closeStatusInput" value="LOST" class="size-4 border-(--border) accent-(--primary)" type="radio" name="return-status-102">
            丢失
          </label>
          <label class="flex items-center gap-2 text-sm text-(--foreground)">
            <input v-model="closeStatusInput" value="DAMAGED" class="size-4 border-(--border) accent-(--primary)" type="radio" name="return-status-102">
            损坏
          </label>
        </div>
      </div>
    </form>
  </Popup>
</template>

<style scoped>

</style>