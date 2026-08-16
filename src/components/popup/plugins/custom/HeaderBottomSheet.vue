<script setup lang="ts">
import { X, User, ShieldKeyhole, Sun, Moon, LogOut, ArrowRight, SunMoon } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useUserStore } from "@/stores/user.ts";
import { usePopupStore } from "@/stores/popup.ts";
import { useThemeStore } from "@/stores/theme.ts";

const authStore = useAuthStore();
const userStore = useUserStore();
const popupStore = usePopupStore();
const themeStore = useThemeStore();

function switchTheme() {
  themeStore.toggle();
  popupStore.close();
}
</script>

<template>
  <div v-if="popupStore.isOpen('header')" class="absolute block sm:hidden z-50 inset-x-0 bottom-0 rounded-t-2xl border-t border-(--border) bg-(--popover) pb-[env(safe-area-inset-bottom)] text-(--popover-foreground) shadow-2xl animate-in slide-in-from-bottom">
    <!-- 辅助元素 -->
    <div class="flex items-center justify-center px-4 pt-3">
      <span class="h-1.5 w-10 rounded-full bg-(--border)"></span>
      <button type="button" @click="() => popupStore.close()" aria-label="关闭" class="absolute right-3 top-3 rounded-md p-1.5 text-(--muted-foreground) hover:bg-(--accent)">
        <X class="size-5"/>
      </button>
    </div>
    <!-- 主体 -->
    <div class="pt-2 pb-[20%]">
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
        <RouterLink :to="{ name: 'profile'}" @click="popupStore.close" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
          <div class="flex items-center gap-2.5 py-2 text-sm">
            <User class="size-4"/>
            个人中心
          </div>
          <ArrowRight class="size-4"/>
        </RouterLink>
      </div>
      <!-- 账号与安全 -->
      <div class="px-2 py-1">
        <RouterLink :to="{ name: 'security'}" @click="popupStore.close" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
          <div class="flex items-center gap-2.5 py-2 text-sm">
            <ShieldKeyhole class="size-4"/>
            账号与安全
          </div>
          <ArrowRight class="size-4"/>
        </RouterLink>
      </div>
      <div class="my-1 border-t border-(--border)"></div>
      <!-- 主题切换 -->
      <div class="px-2 py-1">
        <a href="/" @click.prevent="switchTheme()" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
          <div class="flex items-center gap-2.5 py-2 text-sm">
            <SunMoon class="size-4"/>
            主题切换
          </div>
          <Sun v-if="themeStore.isSun" class="size-4"/>
          <Moon v-if="themeStore.isMoon" class="size-4"/>
        </a>
      </div>
      <div class="my-1 border-t border-(--border)"></div>
      <!-- 退出登录 -->
      <div class="px-2 py-1">
        <a href="/" @click.prevent="authStore.logout" class="flex items-center rounded-md px-2 text-(--destructive) hover:bg-(--destructive)/10 transition-colors">
          <div class="flex items-center gap-2.5 py-2 text-sm">
            <LogOut class="size-4"/>
            退出登录
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>