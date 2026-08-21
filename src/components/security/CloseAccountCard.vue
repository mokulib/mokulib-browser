<script setup lang="ts">
import { Send, UserRoundX } from "@lucide/vue";
import { ref } from "vue";
import SecurityCard from "@/components/security/SecurityCard.vue";
import { useAuthStore } from "@/stores/auth.ts";
import FormItem from "@/components/security/FormItem.vue";
import api from "@/api";
import { ElMessage } from "element-plus";

const authStore = useAuthStore();

const prefix = ref('--');
const captcha = ref('');

async function requestCaptcha() {
  const data = await api.get('/api/auth/close-account');
  prefix.value = data.data.code_prefix;
  if (data.status === 'OK') {
    ElMessage.success(data.message);
  } else {
    ElMessage.error(data.message);
  }
}

async function closeAccount() {
  const data = await api.delete('/api/auth/close-account', { params: { emailCaptcha: prefix.value + '-' + captcha.value, } });
  if (data.status === 'OK') {
    ElMessage.success(data.message);
  } else {
    ElMessage.error(data.message);
  }
}
</script>

<template>
  <SecurityCard title="注销账号">
    <!-- 提示信息 -->
    <div class="flex flex-col px-4 py-2 gap-2 rounded text-sm text-(--destructive) border border-(--destructive) bg-(--card)">
      <p>为保证账号安全，你提交的注销申请生效前需满足以下条件。</p>
      <ul class="list-decimal pl-8">
        <li>通过账号安全验证</li>
        <li>账号交易已完成</li>
      </ul>
      <p>注销账号后，您的所有个人数据（包括头像、昵称、个性签名等）将被永久删除，且无法恢复。</p>
      <p>此操作不可逆，请谨慎操作。</p>
    </div>

    <FormItem label="验证码" :description="`验证码将发送至您的注册邮箱（${authStore.email}）。`">
      <div class="sm:max-w-64 flex-1 flex items-center mr-4 py-1 border border-(--border) rounded text-sm">
        <p class="shrink-0 w-10 text-center">{{ prefix }}</p>
        <p class="shrink-0 w-6 text-center border-x border-(--border)">-</p>
        <input v-model="captcha" type="text" placeholder="请输入验证码" class="w-full px-4 outline-none"/>
      </div>
      <button @click="requestCaptcha()" class="shrink-0 flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm bg-(--background) hover:bg-(--muted) transition-colors">
        <Send class="size-3"/>
        发送验证码
      </button>
    </FormItem>

    <!-- 操作按钮 -->
    <div>
      <button @click="closeAccount()" class="flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm text-(--destructive) bg-(--background) hover:bg-(--muted) transition-colors">
        <UserRoundX class="size-3"/>
        注销账号
      </button>
    </div>
  </SecurityCard>
</template>

<style scoped>

</style>