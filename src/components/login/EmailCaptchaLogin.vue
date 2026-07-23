<script setup lang="ts">

import { ArrowLeft, RefreshCw } from "@lucide/vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.ts";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import api from "@/api";

const router = useRouter();
const authStore = useAuthStore();

const canvasWidth = 120;
const canvasHeight = 30;

// 当前步骤，初始为邮箱输入
let currentStep = ref<'EMAIL_INPUT' | 'CAPTCHA_INPUT'>('EMAIL_INPUT');

// 表单数据
const loginForm = ref({
  username: '',
  imageToken: '',
  imageCaptcha: '',
})
const codePrefix = ref('')
const emailCaptcha = ref('');

const refreshImageCaptcha = () => {
  api.get<{ token: string, image: string }>("/api/captcha").then(data => {
    // 记录验证码 token
    loginForm.value.imageToken = data.data.token;
    // 清空验证码
    loginForm.value.imageCaptcha = '';

    // 绘制图片
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    // 获取 Canvas
    if (!ctx)
      throw new Error('无法获取 Canvas 上下文');
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // 创建 Image 对象
    const img = new Image();
    // 设置加载完成回调函数
    img.onload = function() {
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    };
    // 设置加载失败回调函数
    img.onerror = function() {
      console.error('图片加载失败');
    };
    // 加载图片
    img.src = "data:image/png;base64," + data.data.image;
  });
}

const emailSubmitLoading = ref(false)

const handleEmailSubmit = async () => {
  // 验证邮箱
  if (!loginForm.value.username) {
    console.error('请输入邮箱')
    return
  }

  // 验证验证码
  if (!loginForm.value.imageCaptcha) {
    console.error('请输入验证码')
    return
  }

  emailSubmitLoading.value = true

  let data = await api.get<{ codePrefix: string, coolingTime: string }>("/api/auth/login", {
    params: {
      email: loginForm.value.username,
      imageToken: loginForm.value.imageToken,
      imageCaptcha: loginForm.value.imageCaptcha,
    },
  });
  // 失败
  if (data.status !== 'OK') {
    ElMessage.error(data.message);
    refreshImageCaptcha() // 刷新验证码
    emailSubmitLoading.value = false
    return
  }
  // 成功
  codePrefix.value = data.data.codePrefix;
  currentStep.value = 'CAPTCHA_INPUT';
  emailSubmitLoading.value = false
}

const loginLoading = ref(false)

const handleLogin = async () => {
  // 验证验证码
  if (!emailCaptcha.value) {
    console.error('请输入验证码')
    return
  }

  loginLoading.value = true

  let data = await authStore.login({
    username: loginForm.value.username,
    password: codePrefix.value + "-" + emailCaptcha.value,
  });
  // 失败
  if (data.status !== 'OK') {
    ElMessage.error(data.message);
    refreshImageCaptcha() // 刷新图片验证码
    emailCaptcha.value = ''; // 清空邮箱验证码
    loginLoading.value = false
    currentStep.value = 'EMAIL_INPUT'; // 返回上一步
    return
  }
  // 成功
  ElMessage.success(data.message);
  await router.push({ name: 'home' })
  loginLoading.value = false
}

onMounted(() => refreshImageCaptcha());
</script>

<template>
  <form v-if="currentStep === 'EMAIL_INPUT'" class="flex flex-col gap-5" @submit.prevent="handleEmailSubmit">
    <div class="flex flex-col gap-2">
      <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="email">邮箱</label>
      <input id="email" v-model="loginForm.username" data-slot="input" placeholder="you@example.com" autocomplete="email" required class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" type="email"></div>
    <div class="flex flex-col gap-2">
      <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="captcha">验证码</label>
      <div class="flex items-center gap-3">
        <input id="captcha" v-model="loginForm.imageCaptcha" data-slot="input" inputmode="text" placeholder="请输入验证码" autocomplete="off" required class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 flex-1" type="text">
        <button type="button" @click="refreshImageCaptcha()" aria-label="验证码 NPVY，点击刷新" title="点击刷新验证码" class="group relative shrink-0 overflow-hidden rounded-md border border-(--border) transition-opacity hover:opacity-90">
          <canvas id="canvas" :width="canvasWidth" :height="canvasHeight" :class="['block', `w-[${canvasWidth}px]`, `h-[${canvasHeight}px]`]"></canvas>
        </button>
      </div>
      <button type="button" @click="refreshImageCaptcha()" class="flex w-fit items-center gap-1 text-xs text-(--muted-foreground) transition-colors hover:text-(--primary)">
        <RefreshCw class="size-3"/>看不清？点击图片刷新
      </button>
    </div>
    <button type="submit" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 mt-1 w-full">下一步</button>
  </form>

  <form v-else class="flex flex-col gap-5" @submit.prevent="handleLogin">
    <button type="button" class="flex w-fit items-center gap-1 text-sm text-(--muted-foreground) transition-colors hover:text-(--primary)">
      <ArrowLeft class="size-4"/>返回上一步
    </button>
    <div class="flex flex-col gap-2">
      <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="email-code">邮箱验证码</label>
      <div class="flex items-stretch">
        <span class="inline-flex select-none items-center rounded-l-md border border-r-0 border-(--border) bg-(--muted) px-3 font-mono text-sm font-semibold tracking-widest text-(--muted-foreground)" aria-label="验证码前缀">{{ codePrefix }}</span>
        <input id="email-code" v-model="emailCaptcha" data-slot="input" inputmode="numeric" placeholder="请输入邮件中的验证码" autocomplete="one-time-code" required class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 rounded-l-none" type="text">
      </div>
    </div>
    <button type="submit" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 mt-1 w-full">登录</button>
  </form>
</template>

<style scoped>
/* input 自动补全背景色修复 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px var(--background) inset !important;
  box-shadow: 0 0 0 1000px var(--background) inset !important;
  -webkit-text-fill-color: var(--foreground) !important;
  caret-color: var(--foreground) !important;
}

/* 复选框背景色修复 */
input[type="checkbox"] {
  /* 移除原生样式 */
  appearance: none;
  -webkit-appearance: none;

  /* 设置尺寸 */
  width: 16px;
  height: 16px;
  flex-shrink: 0;

  /* 未选中时的背景色 */
  background-color: var(--background);  /* 改成你想要的任何颜色 */
  border: 2px solid var(--border);
  border-radius: 4px;

  /* 勾选标记居中 */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

/* 复选框选中时的样式 */
input[type="checkbox"]:checked {
  background-color: var(--primary);  /* 选中背景色 */
  border-color: var(--primary);
}

/* 复选框勾选标记 */
input[type="checkbox"]:checked::after {
  content: "·";
  color: var(--background);
  font-size: 16px;
  font-weight: bold;
}
</style>