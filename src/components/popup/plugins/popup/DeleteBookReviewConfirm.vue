<script setup lang="ts">
import { usePopupStore } from "@/stores/popup.ts";
import Popup from "@/components/popup/core/Popup.vue";
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth.ts";

const authStore = useAuthStore();

const user_name = ref<string>('');

function confirmHandler() {
}

onMounted(() => {
  usePopupStore().registerInitHook('deleteBookReviewConfirm', ({ clone }) => {
    user_name.value = clone.user_name;
  })
})
</script>

<template>
  <Popup popup-key="deleteBookReviewConfirm" title="删除书评" confirm="确认删除" confirm-type="danger" @confirm="confirmHandler">
    <template #content>
      <template v-if="authStore.isAdmin">
        确定要删除 {{ user_name }} 的书评吗？此操作不可撤销。
      </template>
      <template v-else>
        确定要删除您的书评吗？此操作不可撤销。
      </template>
    </template>
  </Popup>
</template>

<style scoped>

</style>