<script setup lang="ts">
import { LockKeyhole, Send } from "@lucide/vue";
import { useUserStore } from "@/stores/user.ts";
import { ref } from "vue";
import SecurityCard from "@/components/security/SecurityCard.vue";

const userStore = useUserStore();

const input = ref('')
</script>

<template>
  <SecurityCard title="重置密码">
    <div class="w-full flex flex-col gap-4">
      <div class="flex flex-col px-4 py-2 gap-2 rounded text-(--muted-foreground) border border-(--border)">
        <p>重置密码后，您需要使用新密码重新登录。</p>
        <p>验证码将发送至您的注册邮箱（{{ userStore.user_email }}）。</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center py-1 border border-(--border) rounded text-sm">
          <p class="shrink-0 px-4">--</p>
          <p class="shrink-0 px-2 border-x border-(--border)">-</p>
          <input v-model="input" type="text" placeholder="请输入验证码" class="w-full px-4 outline-none"/>
        </div>
        <button class="shrink-0 flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm bg-(--background) hover:bg-(--muted) transition-colors">
          <Send class="size-3"/>
          发送验证码
        </button>
      </div>
      <div>
        <button class="flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm bg-(--background) hover:bg-(--muted) transition-colors">
          <LockKeyhole class="size-3"/>
          重置密码
        </button>
      </div>
    </div>
  </SecurityCard>
</template>

<style scoped>

</style>