<script setup lang="ts">
import { usePopupStore } from "@/stores/popup.ts";
import Popup from "@/components/popup/Popup.vue";
import { useUserStore } from "@/stores/user.ts";

const userStore = useUserStore();
const popupStore = usePopupStore();
</script>

<template>
  <Popup popup-key="deleteBookReviewConfirm" title="删除书评" confirm="确认删除" confirm-type="danger" @confirm="popupStore.close">
    <template #content>
      <template v-if="userStore.user_is_admin">
        确定要删除 {{ popupStore.payload.user_name }} 的书评吗？此操作不可撤销。
      </template>
      <template v-else>
        确定要删除您的书评吗？此操作不可撤销。
      </template>
    </template>
  </Popup>
</template>

<style scoped>

</style>