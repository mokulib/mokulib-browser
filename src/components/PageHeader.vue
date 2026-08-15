<script setup lang="ts">
import { Search, Landmark, ChevronDown } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useUserStore } from "@/stores/user.ts";
import { usePopupStore } from "@/stores/popup.ts";
import { useElementBounding } from "@vueuse/core";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const userStore = useUserStore();
const popupStore = usePopupStore();

const headerBtn = ref();
const headerBtnBounding = useElementBounding(headerBtn);

function toggleHeader() {
  const { top, right, height } = headerBtnBounding;
  popupStore.toggle('header', { top, right, height });
}

onMounted(() => {
  popupStore.registerInitHook('header', () => headerBtnBounding.update()); // 打开弹窗时更新元素位置
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-4 md:px-8">
    <div class="flex items-center justify-between">

      <!-- ===== 左：Logo ===== -->
      <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 justify-start">
        <Landmark class="size-6 text-(--primary)"/>
        <span class="font-serif text-xl font-semibold tracking-tight">墨库</span>
      </RouterLink>

      <!-- ===== 右：搜索 / 用户信息 / 登录 ===== -->
      <div class="flex items-center gap-2 justify-end">
        <!-- 搜索 -->
        <button type="button" @click="popupStore.open('search', {})" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:hover:bg-(--muted)/50 size-8">
          <Search class="size-5"/>
        </button>
        <!-- 个人信息 -->
        <button v-if="authStore.isLoggedIn" ref="headerBtn" type="button" @click="toggleHeader()" tabindex="0" data-slot="button" :aria-expanded="popupStore.isOpen('header')" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-(--muted) hover:text-(--foreground) sm:aria-expanded:bg-(--muted) sm:aria-expanded:text-(--foreground) dark:hover:bg-(--muted)/50 h-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 gap-2 pl-1.5 pr-2.5">
          <img :src="userStore.user_avatar" :alt="userStore.user_username + '的头像'" class="size-7 rounded-full border border-(--border) object-cover">
          <span class="font-medium">{{ userStore.user_username }}</span>
          <ChevronDown class="hidden size-4 text-(--muted-foreground) transition-transform sm:block" :class="{ 'rotate-180': popupStore.isOpen('header') }"/>
        </button>
        <!-- 登录按钮 -->
        <RouterLink v-if="!authStore.isLoggedIn" type="button" :to="{ name: 'login' }" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2">
          登录
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>