<script setup lang="ts">
import { Pencil } from "@lucide/vue"
import SecurityCard from "@/components/security/SecurityCard.vue";
import { useUserStore } from "@/stores/user.ts";
import { DateTime } from "luxon";
import { usePopupStore } from "@/stores/popup.ts";
import type { Response } from "@/types";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const popupStore = usePopupStore();

function editUsernameCallback(data: Response<any>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
  } else {
    ElMessage.error(data.message);
  }
}
</script>

<template>
  <SecurityCard title="您的基础信息">
    <!-- 信息展示 -->
    <div class="flex flex-col gap-0.5 text-sm">
      <div class="flex items-center">
        <p class="w-24">身份码</p>
        <p class="w-40">{{ userStore.user_id }}</p>
      </div>
      <div class="flex items-center">
        <p class="w-24">权限组</p>
        <p class="w-40">{{ userStore.user_role_name }}</p>
      </div>
      <div class="flex items-center">
        <p class="w-24">昵称</p>
        <p class="w-40">{{ userStore.user_username }}</p>
      </div>
      <div class="flex items-center">
        <p class="w-24">注册邮箱</p>
        <p class="w-40">{{ userStore.user_email }}</p>
      </div>
      <div class="flex items-center">
        <p class="w-24">注册时间</p>
        <p class="w-40">{{ DateTime.fromISO(userStore.user_create_time).toFormat("yyyy-MM-dd HH:mm:ss") }}</p>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div>
      <button @click="popupStore.open('editUsername', undefined, editUsernameCallback)" class="flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm bg-(--background) hover:bg-(--muted) transition-colors">
        <Pencil class="size-3"/>
        修改昵称
      </button>
    </div>
  </SecurityCard>
</template>

<style scoped>

</style>