<script setup lang="ts">
import SecurityCard from "@/components/security/SecurityCard.vue";
import { useUserStore } from "@/stores/user.ts";
import { DateTime } from "luxon";

const userStore = useUserStore();
</script>

<template>
  <SecurityCard title="您的基础信息">
    <div class="flex flex-col gap-0.5">
      <div class="flex items-center">
        <p class="w-24">账号 ID</p>
        <p class="w-40">{{ userStore.user_id }}</p>
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
  </SecurityCard>
</template>

<style scoped>

</style>