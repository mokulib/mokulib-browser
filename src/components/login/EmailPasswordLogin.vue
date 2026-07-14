<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RefreshCw } from "@lucide/vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.ts";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const canvasWidth = 120;
const canvasHeight = 30;

// 表单数据
const loginForm = ref({
  username: '',
  password: '',
  imageToken: '',
  imageCaptcha: '',
})

const refreshImageCaptcha = () => {
  axios.get("/api/captcha").then(response => {
    // 记录验证码 token
    loginForm.value.imageToken = response.data.data.token;
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
    img.src = "data:image/png;base64," + response.data.data.image;
  });
}

// 登录loading状态
const loginLoading = ref(false)

// 登录提交函数
const handleLogin = async () => {
  // 验证邮箱
  if (!loginForm.value.username) {
    console.error('请输入邮箱')
    return
  }

  // 验证密码
  if (!loginForm.value.password) {
    console.error('请输入密码')
    return
  }

  // 验证验证码
  if (!loginForm.value.imageCaptcha) {
    console.error('请输入验证码')
    return
  }

  loginLoading.value = true

  let data = await authStore.login({
    username: loginForm.value.username,
    password: loginForm.value.password,
    imageToken: loginForm.value.imageToken,
    imageCaptcha: loginForm.value.imageCaptcha,
  });
  // 失败
  if (data.status !== 'OK') {
    ElMessage.error(data.message);
    refreshImageCaptcha() // 刷新验证码
    loginLoading.value = false
    return
  }
  // 成功
  ElMessage.success(data.message);
  await router.push({ name: 'home' })
  loginLoading.value = false
};

onMounted(() => refreshImageCaptcha());
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleLogin">
    <div class="flex flex-col gap-2">
      <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="email">邮箱</label>
      <input id="email" v-model="loginForm.username" data-slot="input" placeholder="you@example.com" autocomplete="email" required class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" type="email">
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="password">密码</label>
        <button type="button" class="text-xs text-(--muted-foreground) transition-colors hover:text-(--primary)">显示</button>
      </div>
      <input id="password" v-model="loginForm.password" data-slot="input" placeholder="输入密码" autocomplete="current-password" required class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" type="password">
    </div>
    <div class="flex flex-col gap-2">
      <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="imageCaptcha">验证码</label>
      <div class="flex items-center gap-3">
        <input id="imageCaptcha" v-model="loginForm.imageCaptcha" data-slot="input" inputmode="text" placeholder="请输入验证码" autocomplete="off" required class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 flex-1" type="text">
        <button type="button" @click="refreshImageCaptcha()" class="group relative shrink-0 overflow-hidden rounded-md border border-(--border) transition-opacity hover:opacity-90">
          <canvas id="canvas" :width="canvasWidth" :height="canvasHeight" :class="['block', `w-[${canvasWidth}px]`, `h-[${canvasHeight}px]`]"></canvas>
        </button>
      </div>
      <button type="button" @click="refreshImageCaptcha()" class="flex w-fit items-center gap-1 text-xs text-(--muted-foreground) transition-colors hover:text-(--primary)">
        <RefreshCw class="size-3"/>
        看不清？点击图片刷新
      </button>
    </div>
    <div>
      <button type="submit" :disabled="loginLoading" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 mt-1 w-full">
        {{ loginLoading ? '登录中...' : '登录' }}
      </button>
      <div class="flex items-center justify-center mt-2">
        <p class="text-sm text-(--muted-foreground)">未注册的邮箱将自动为您创建账号</p>
      </div>
    </div>
    <label class="flex items-start gap-2 text-sm text-(--muted-foreground)">
      <input class="flex mt-0.5 size-4 rounded border-(--border) accent-(--primary)" required type="checkbox">
      <span>我已阅读并同意<a href="/terms" class="text-(--primary) transition-colors hover:opacity-80">《墨库用户协议》</a>、<a href="/privacy" class="text-(--primary) transition-colors hover:opacity-80">《隐私政策》</a>，并授权墨库使用该墨库账号信息（如昵称、头像、个性签名）进行统一管理</span>
    </label>
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