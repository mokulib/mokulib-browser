<script setup lang="ts">

import { Search, Landmark, ChevronDown, User, ArrowRight, SunMoon, Sun, Moon, LogOut } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useUserStore } from "@/stores/user.ts";
import { useHeaderStore } from "@/stores/header.ts";
import { useThemeStore } from "@/stores/theme.ts";

const authStore = useAuthStore();
const userStore = useUserStore();
const headerStore = useHeaderStore();
const themeStore = useThemeStore();
</script>

<template>
  <div class="mx-auto grid max-w-6xl grid-cols-2 items-center gap-4 px-4 py-4 md:px-8 lg:grid-cols-3">

    <a class="flex items-center gap-2 justify-start" href="/">
      <Landmark class="size-6 text-(--primary)"/>
      <span class="font-serif text-xl font-semibold tracking-tight">墨库</span>
    </a>

    <div class="hidden lg:block">
      <nav v-show="authStore.isLoggedIn" class="flex items-center gap-7 justify-center">
        <a href="#" class="text-sm transition-colors hover:text-(--primary) text-(--foreground)">书架</a>
        <a href="#" class="text-sm transition-colors hover:text-(--primary) text-(--muted-foreground)">阅读中</a>
        <a href="#" class="text-sm transition-colors hover:text-(--primary) text-(--muted-foreground)">心愿单</a>
        <a href="#" class="text-sm transition-colors hover:text-(--primary) text-(--muted-foreground)">已读完</a>
        <a href="#" class="text-sm transition-colors hover:text-(--primary) text-(--muted-foreground)">笔记</a>
      </nav>
    </div>

    <div class="flex items-center gap-2 justify-end">
      <!-- 搜索 -->
      <button type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:hover:bg-(--muted)/50 size-8">
        <Search class="size-5"/>
      </button>
      <!-- 个人信息 -->
      <div v-if="authStore.isLoggedIn" class="relative flex items-center">
        <!-- 切换按钮 -->
        <button type="button" @click="headerStore.toggleExpanded" tabindex="0" data-slot="button" :aria-expanded="headerStore.isExpanded" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 hover:bg-(--muted) hover:text-(--foreground) sm:aria-expanded:bg-(--muted) sm:aria-expanded:text-(--foreground) dark:hover:bg-(--muted)/50 h-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 gap-2 pl-1.5 pr-2.5">
          <img :src="userStore.user_avatar" :alt="userStore.user_username + '的头像'" class="size-7 rounded-full border border-(--border) object-cover">
          <span class="font-medium">{{ userStore.user_username }}</span>
          <ChevronDown class="hidden size-4 text-(--muted-foreground) transition-transform sm:block" :class="{ 'rotate-180': headerStore.isExpanded }"/>
        </button>
        <!-- 宽屏菜单 -->
        <div v-if="headerStore.isExpanded" role="menu" class="hidden sm:block absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-xl border border-(--border) bg-(--popover) text-(--popover-foreground) shadow-lg animate-in fade-in-0 zoom-in-95">
          <!-- 信息 -->
          <div class="flex items-center gap-3 px-4 py-4">
            <img :src="userStore.user_avatar" :alt="userStore.user_username + '的头像'" class="size-11 shrink-0 rounded-full border border-(--border) object-cover">
            <div class="min-w-0 self-stretch flex flex-col justify-between">
              <div class="flex items-center gap-2">
                <p class="truncate font-serif text-base font-semibold text-(--foreground)">{{ userStore.user_username }}</p>
                <span class="shrink-0 rounded-full bg-(--primary)/10 px-2 py-0.5 text-[11px] font-medium text-(--primary)">{{ userStore.user_role_name }}</span>
              </div>
              <p class="truncate text-xs text-(--muted-foreground)">{{ userStore.user_email }}</p>
            </div>
          </div>
          <div class="mb-1 border-t border-(--border)"></div>
          <!-- 个人中心 -->
          <div class="px-2 py-1">
            <a href="/profile" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
              <div class="flex items-center gap-2.5 py-2 text-sm">
                <User class="size-4"/>
                个人中心
              </div>
              <ArrowRight class="size-4"/>
            </a>
          </div>
          <div class="my-1 border-t border-(--border)"></div>
          <!-- 主题切换 -->
          <div class="px-2 py-1">
            <a href="/" @click.prevent="themeStore.toggle" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
              <div class="flex items-center gap-2.5 py-2 text-sm">
                <SunMoon class="size-4"/>
                主题切换
              </div>
              <Sun v-if="themeStore.isSun" class="size-3.5"/>
              <Moon v-if="themeStore.isMoon" class="size-3.5"/>
            </a>
          </div>
          <div class="my-1 border-t border-(--border)"></div>
          <!-- 退出登录 -->
          <div class="px-2 pb-2 pt-1">
            <a href="/" @click.prevent="authStore.logout" class="flex items-center rounded-md px-2 text-(--destructive) hover:bg-(--destructive)/10 transition-colors">
              <div class="flex items-center gap-2.5 py-2 text-sm">
                <LogOut class="size-4"/>
                退出登录
              </div>
            </a>
          </div>
        </div>
      </div>
      <!-- 登录按钮 -->
      <button v-if="!authStore.isLoggedIn" type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2">
        <a href="/login">登录</a>
      </button>
    </div>

  </div>

</template>

<style scoped>

</style>