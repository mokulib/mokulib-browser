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
          <img src="@/assets/mr-wang.png" alt="" class="size-7 rounded-full border border-(--border) object-cover">
          <span class="font-medium">{{ userStore.user_username }}</span>
          <ChevronDown class="hidden size-4 text-(--muted-foreground) transition-transform sm:block" :class="{ 'rotate-180': headerStore.isExpanded }"/>
        </button>
        <!-- 宽屏菜单 -->
        <div v-if="headerStore.isExpanded" role="menu" class="hidden sm:block absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-xl border border-(--border) bg-(--popover) text-(--popover-foreground) shadow-lg animate-in fade-in-0 zoom-in-95">
          <div class="flex items-center gap-3 px-4 py-4">
            <img alt="王先生的头像" class="size-11 shrink-0 rounded-full border border-(--border) object-cover" src="@/assets/mr-wang.png">
            <div class="min-w-0 self-stretch flex flex-col justify-between">
              <div class="flex items-center gap-2">
                <p class="truncate font-serif text-base font-semibold text-(--foreground)">{{ userStore.user_username }}</p>
                <span class="shrink-0 rounded-full bg-(--primary)/10 px-2 py-0.5 text-[11px] font-medium text-(--primary)">{{ userStore.user_role_name }}</span>
              </div>
              <p class="truncate text-xs text-(--muted-foreground)">{{ userStore.user_email }}</p>
            </div>
          </div>
          <div class="mb-1 border-t border-(--border)"></div>
          <div class="px-2 py-1">
            <div class="flex items-center justify-between rounded-md px-2 hover:bg-(--muted) hover:text-(--accent-foreground)">
              <a class="flex items-center gap-2.5 py-2 text-sm text-(--foreground) transition-colors" href="/profile">
                <User class="size-4 text-(--muted-foreground)"/>
                个人中心
              </a>
              <ArrowRight class="size-4 text-(--muted-foreground)"/>
            </div>
          </div>
          <div class="my-1 border-t border-(--border)"></div>
          <div class="px-2 py-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5 rounded-md px-2 py-2">
                <SunMoon class="size-4 text-(--muted-foreground)"/>
                <span class="text-sm text-(--foreground)">主题</span>
              </div>
              <div role="group" aria-label="主题切换" class="flex items-center gap-1 rounded-full border border-(--border) bg-(--secondary)/60 p-1">
                <button type="button" @click="themeStore.setSun" :aria-pressed="themeStore.isSun" class="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors text-(--muted-foreground) aria-pressed:bg-(--background) aria-pressed:text-(--foreground) not-aria-pressed:hover:text-(--foreground) aria-pressed:shadow-sm">
                  <Sun class="size-3.5"/>
                  浅色
                </button>
                <button type="button" @click="themeStore.setMoon" :aria-pressed="themeStore.isMoon" class="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors text-(--muted-foreground) aria-pressed:bg-(--background) aria-pressed:text-(--foreground) not-aria-pressed:hover:text-(--foreground) aria-pressed:shadow-sm">
                  <Moon class="size-3.5"/>
                  深色
                </button>
              </div>
            </div>
          </div>
          <div class="my-1 border-t border-(--border)"></div>
          <div class="px-2 pb-2 pt-1">
            <button type="button" @click="authStore.logout" class="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-(--destructive) transition-colors hover:bg-(--destructive)/10">
              <LogOut class="size-4"/>
              退出登录
            </button>
          </div>
        </div>
      </div>
      <!-- 无样式 -->
      <!-- <button v-if="authStore.isLoggedIn" type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(&#45;&#45;ring) focus-visible:ring-3 focus-visible:ring-(&#45;&#45;ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-(&#45;&#45;destructive)/50 dark:aria-invalid:ring-(&#45;&#45;destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 hover:bg-(&#45;&#45;muted) hover:text-(&#45;&#45;foreground) aria-expanded:bg-(&#45;&#45;muted) aria-expanded:text-(&#45;&#45;foreground) dark:hover:bg-(&#45;&#45;muted)/50 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"> -->
      <!--   <a href="/">{{ userStore.user_username }}</a> -->
      <!-- </button> -->
      <!-- 登录按钮 -->
      <button v-if="!authStore.isLoggedIn" type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2">
        <a href="/login">登录</a>
      </button>
    </div>

  </div>

</template>

<style scoped>

</style>