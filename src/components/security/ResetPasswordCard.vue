<script setup lang="ts">
import { LockKeyhole, Send } from "@lucide/vue";
import { useUserStore } from "@/stores/user.ts";
import { ref } from "vue";
import SecurityCard from "@/components/security/SecurityCard.vue";
import FormItem from "@/components/security/FormItem.vue";

const userStore = useUserStore();

const input = ref('')
</script>

<template>
  <SecurityCard title="重置密码">
    <!-- 提示信息 -->
    <div class="flex flex-col px-4 py-2 gap-2 rounded text-sm text-(--muted-foreground) border border-(--border)">
      <p>重置密码后，您需要使用新密码重新登录。</p>
    </div>

    <FormItem label="新密码" :description="`共8-20位，必须同时包含大写字母、小写字母、数字和特殊字符（!@#$%^&*_:;,.?）`">
      <input v-model="input" type="text" placeholder="请输入新密码" class="sm:max-w-64 flex-1 px-4 py-1 border border-(--border) rounded text-sm outline-none"/>
    </FormItem>
    <FormItem label="验证码" :description="`验证码将发送至您的注册邮箱（${userStore.user_email}）。`">
      <div class="sm:max-w-64 flex-1 flex items-center mr-4 py-1 border border-(--border) rounded text-sm">
        <p class="shrink-0 w-10 text-center">--</p>
        <p class="shrink-0 w-6 text-center border-x border-(--border)">-</p>
        <input v-model="input" type="text" placeholder="请输入验证码" class="w-full px-4 outline-none"/>
      </div>
      <button class="shrink-0 flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm bg-(--background) hover:bg-(--muted) transition-colors">
        <Send class="size-3"/>
        发送验证码
      </button>
    </FormItem>

    <!-- 操作按钮 -->
    <div>
      <button class="flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm text-(--primary) bg-(--background) hover:bg-(--muted) transition-colors">
        <LockKeyhole class="size-3"/>
        重置密码
      </button>
    </div>
  </SecurityCard>
</template>

<style scoped>

</style>