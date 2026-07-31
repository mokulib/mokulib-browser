<script setup lang="ts">
import Popup from "@/components/popup/Popup.vue";
import { type PopupKey, usePopupStore } from "@/stores/popup.ts";
import api from "@/api";
import type { BookCopyAdmin } from "@/types";
import { ref, watch } from "vue";

const popupStore = usePopupStore();

const bookCopyId = ref<number>(-1);

function confirmHandler() {
  return api.post<BookCopyAdmin>('/api/book-copies/' + bookCopyId.value + '/relist');
}

// 监听弹窗打开
watch(() => popupStore.popups, (newValue: PopupKey | undefined) => {
  if (newValue === 'relist')
    bookCopyId.value = popupStore.safePayload<'relist'>().id;
})
</script>

<template>
  <Popup popup-key="relist" title="重新上架" confirm-text="确认上架" :confirm-handler="confirmHandler">
    <div>确定要重新上架此图书吗？</div>
  </Popup>
</template>

<style scoped>

</style>