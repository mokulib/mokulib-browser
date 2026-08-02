<script setup lang="ts">
import Popup from "@/components/popup/core/Popup.vue";
import { usePopupStore } from "@/stores/popup.ts";
import api from "@/api";
import type { BookCopyAdmin } from "@/types";
import { onMounted, ref } from "vue";

const bookCopyId = ref<number>(-1);

onMounted(() => {
  usePopupStore().registerInitHook('relist', ({ clone }) => bookCopyId.value = clone.id);
})
</script>

<template>
  <Popup popup-key="relist" title="重新上架" confirm-text="确认上架" :confirm-handler="() => api.post<BookCopyAdmin>(`/api/book-copies/${bookCopyId}/relist`)">
    <div>确定要重新上架此图书吗？</div>
  </Popup>
</template>

<style scoped>

</style>