<script setup lang="ts">
import Popup from "@/components/popup/Popup.vue";
import { type PopupKey, usePopupStore } from "@/stores/popup.ts";
import api from "@/api";
import type { BookCopyAdmin } from "@/types";
import { ref, watch } from "vue";

const popupStore = usePopupStore();

const bookCopyId = ref<number>(-1);

function confirmHandler() {
  return api.post<BookCopyAdmin>('/api/book-copies/' + bookCopyId.value + '/withdrawn');
}

// 监听弹窗打开
watch(() => popupStore.popups, (newValue: PopupKey | undefined) => {
  if (newValue === 'withdrawn')
    bookCopyId.value = popupStore.safePayload<'withdrawn'>().id;
})
</script>

<template>
  <Popup popup-key="withdrawn" title="下架图书" confirm-text="确认下架" :confirm-handler="confirmHandler">
    <div>确定要下架此图书吗？</div>
  </Popup>
</template>

<style scoped>

</style>