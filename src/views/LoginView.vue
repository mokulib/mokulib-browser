<script setup lang="ts">
import { BookMarked } from "@lucide/vue";
import EmailPasswordLogin from "@/components/login/EmailPasswordLogin.vue";
import EmailCaptchaLogin from "@/components/login/EmailCaptchaLogin.vue";
import { computed, ref } from "vue";

const descriptions = [
  "“藏书是与时间的低语，每一页都值得被珍藏。”",
  "“纸张会泛黄，但故事永远年轻。”",
  "“藏书者，藏的不是纸，是渡人过河的舟楫。”",
  "“墨痕会干涸，思想不会。”",
  "“纸张沉默，但每一个字都在呼吸。”"
]
const currentDescriptionIndex = ref<number>(Math.floor(Math.random() * descriptions.length));
const currentStatus = ref<'EMAIL_PASSWORD_LOGIN' | 'EMAIL_CAPTCHA_LOGIN'>('EMAIL_PASSWORD_LOGIN');
const currentComponent = computed(() => currentStatus.value === 'EMAIL_PASSWORD_LOGIN' ? EmailPasswordLogin : EmailCaptchaLogin);

function changeDescription() {
  // 随机一个 [0, description.length - 1) 区间的随机整数
  const rawIndex = Math.floor(Math.random() * (descriptions.length - 1));
  // 若整数在 [0, currentDescriptionIndex) 区间内，则直接使用；
  // 若整数在 [currentDescriptionIndex, description.length - 1) 区间内，则加 1，即平移至 (currentDescription, description.length) 区间内
  currentDescriptionIndex.value = rawIndex < currentDescriptionIndex.value ? rawIndex : rawIndex + 1;
}
</script>

<template>
  <main class="flex min-h-screen flex-col md:flex-row">
    <!-- 红底卡片 -->
    <aside class="relative flex flex-col justify-between bg-(--primary) px-8 py-10 text-(--primary-foreground) md:w-2/5 md:px-12 md:py-14">
      <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
        <BookMarked class="size-6"/>
        <span class="font-serif text-xl font-semibold tracking-tight">墨库</span>
      </RouterLink>
      <div class="hidden md:block">
        <p @click="changeDescription()" class="font-serif text-3xl leading-snug text-balance">{{ descriptions[currentDescriptionIndex] }}</p>
        <p class="mt-4 text-sm text-(--primary-foreground)/70">— 墨库 · 个人图书馆</p>
      </div>
      <p class="hidden text-xs text-(--primary-foreground)/60 md:block">© 2026 墨库</p>
    </aside>
    <!-- 表单区 -->
    <section class="flex flex-1 items-center justify-center px-4 py-12 md:px-8">
      <div class="w-full max-w-sm">
        <h1 class="font-serif text-3xl font-semibold tracking-tight text-balance">欢迎来到墨库</h1>
        <p class="mt-2 text-sm leading-relaxed text-(--muted-foreground)">登录或注册以继续管理你的藏书与阅读进度。</p>
        <!-- 邮箱密码登录表单/邮箱验证码登录表单 -->
        <div class="mt-8">
          <component :is="currentComponent" />
        </div>
        <!-- 切换登录方式等提示 -->
        <div class="mt-6 text-center text-sm text-(--muted-foreground)">
          <div class="flex flex-col gap-2">
            <p v-if="currentStatus === 'EMAIL_PASSWORD_LOGIN'">使用邮箱验证码登录？<a class="text-(--primary) transition-colors hover:opacity-80" href="/login" @click.prevent="currentStatus = 'EMAIL_CAPTCHA_LOGIN'">验证码登录</a></p>
            <p v-if="currentStatus === 'EMAIL_CAPTCHA_LOGIN'">使用邮箱密码登录？<a class="text-(--primary) transition-colors hover:opacity-80" href="/login" @click.prevent="currentStatus = 'EMAIL_PASSWORD_LOGIN'">密码登录</a></p>
            <p v-if="currentStatus === 'EMAIL_CAPTCHA_LOGIN'">还没有账户？<a class="text-(--primary) transition-colors hover:opacity-80" href="/login" @click.prevent="currentStatus = 'EMAIL_PASSWORD_LOGIN'">立即注册</a></p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>