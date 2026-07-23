<script setup lang="ts">
import { User, ArrowRight, Key, SunMoon, Sun, Moon, LogOut } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useUserStore } from "@/stores/user.ts";
import { usePopupStore } from "@/stores/popup.ts";
import { useThemeStore } from "@/stores/theme.ts";

const authStore = useAuthStore();
const userStore = useUserStore();
const popupStore = usePopupStore();
const themeStore = useThemeStore();
</script>

<template>
  <div v-if="popupStore.isOpen('header') && authStore.isLoggedIn" role="menu" class="hidden sm:block absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-xl border border-(--border) bg-(--popover) text-(--popover-foreground) shadow-lg animate-in fade-in-0 zoom-in-95">
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
      <RouterLink :to="{ name: 'profile' }" @click="popupStore.close" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
        <div class="flex items-center gap-2.5 py-2 text-sm">
          <User class="size-4"/>
          个人中心
        </div>
        <ArrowRight class="size-4"/>
      </RouterLink>
    </div>
    <!-- 安全中心 -->
    <div class="px-2 py-1">
      <RouterLink :to="{ name: 'security' }" @click="popupStore.close" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
        <div class="flex items-center gap-2.5 py-2 text-sm">
          <Key class="size-4"/>
          安全中心
        </div>
        <ArrowRight class="size-4"/>
      </RouterLink>
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
</template>

<style scoped>

</style>