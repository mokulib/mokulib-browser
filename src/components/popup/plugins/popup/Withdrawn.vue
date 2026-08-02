<script setup lang="ts">
import Popup from "@/components/popup/core/Popup.vue";
import { usePopupStore } from "@/stores/popup.ts";
import api from "@/api";
import type { BookCopyAdmin } from "@/types";
import { onMounted, ref } from "vue";

const bookCopyId = ref<number>(-1);

onMounted(() => {
  usePopupStore().registerInitHook('withdrawn', ({ clone }) => bookCopyId.value = clone.id)
})
</script>

<template>
  <Popup popup-key="withdrawn" title="下架图书" confirm-text="确认下架" :confirm-handler="() => api.post<BookCopyAdmin>(`/api/book-copies/${bookCopyId}/withdrawn`)">
    <div>确定要下架此图书吗？</div>
  </Popup>
</template>

<style scoped>

</style>