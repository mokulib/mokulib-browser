<script setup lang="ts">

import EmailPasswordLogin from "@/components/login/EmailPasswordLogin.vue";
import EmailCaptchaLogin from "@/components/login/EmailCaptchaLogin.vue";
import { computed, ref } from "vue";

const currentStatus = ref<'EMAIL_PASSWORD_LOGIN' | 'EMAIL_CAPTCHA_LOGIN'>('EMAIL_PASSWORD_LOGIN');

const currentComponent = computed(() => currentStatus.value === 'EMAIL_PASSWORD_LOGIN' ? EmailPasswordLogin : EmailCaptchaLogin);
</script>

<template>
  <h1 class="font-serif text-3xl font-semibold tracking-tight text-balance">欢迎回来</h1>

  <p class="mt-2 text-sm leading-relaxed text-(--muted-foreground)">登录以继续管理你的藏书与阅读进度。</p>

  <div class="mt-8">
    <component :is="currentComponent" />
  </div>

  <div class="mt-6 text-center text-sm text-(--muted-foreground)">
    <div class="flex flex-col gap-2">
      <p v-if="currentStatus === 'EMAIL_PASSWORD_LOGIN'">使用邮箱验证码登录？<a class="text-(--primary) transition-colors hover:opacity-80" href="/login" @click.prevent="currentStatus = 'EMAIL_CAPTCHA_LOGIN'">验证码登录</a></p>
      <p v-if="currentStatus === 'EMAIL_CAPTCHA_LOGIN'">使用邮箱密码登录？<a class="text-(--primary) transition-colors hover:opacity-80" href="/login" @click.prevent="currentStatus = 'EMAIL_PASSWORD_LOGIN'">密码登录</a></p>
      <p v-if="currentStatus === 'EMAIL_CAPTCHA_LOGIN'">还没有账户？<a class="text-(--primary) transition-colors hover:opacity-80" href="/login" @click.prevent="currentStatus = 'EMAIL_PASSWORD_LOGIN'">立即注册</a></p>
    </div>
  </div>
</template>

<style scoped>

</style>