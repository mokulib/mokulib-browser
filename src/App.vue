<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import PageHeader from "@/components/PageHeader.vue";
import PageFooter from "@/components/PageFooter.vue";
import { computed } from "vue";
import { X, User, Sun, Moon, LogOut, ArrowRight, SunMoon } from "@lucide/vue";
import { useHeaderStore } from "@/stores/header.ts";
import { useUserStore } from "@/stores/user.ts";
import { useAuthStore } from "@/stores/auth.ts";
import { useThemeStore } from "@/stores/theme.ts";

const route = useRoute();
const authStore = useAuthStore();
const userStore = useUserStore();
const headerStore = useHeaderStore();
const themeStore = useThemeStore();

const hideHeader = computed(() => route.meta.hideHeader ?? false);
const hideFooter = computed(() => route.meta.hideFooter ?? false);
</script>

<template>
  <div class="min-h-screen bg-(--background) text-(--foreground) flex flex-col">
    <header v-if="!hideHeader" class="sticky top-0 z-40 border-b border-(--border) bg-(--background)/85 backdrop-blur-md">
      <PageHeader/>
    </header>

    <RouterView/>

    <footer v-if="!hideFooter" class="border-t border-(--border)">
      <PageFooter/>
    </footer>
  </div>
  <!-- Header · 窄屏菜单 -->
  <div v-if="authStore.isLoggedIn && headerStore.isExpanded" class="fixed inset-0 z-60 sm:hidden" role="dialog" aria-modal="true" aria-label="用户菜单">
    <!-- 遮罩 -->
    <div @click="headerStore.closeMenu" class="absolute inset-0 bg-(--foreground)/40 animate-in fade-in-0"></div>
    <!-- 菜单 -->
    <div class="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-(--border) bg-(--popover) pb-[env(safe-area-inset-bottom)] text-(--popover-foreground) shadow-2xl animate-in slide-in-from-bottom">
      <!-- 辅助元素 -->
      <div class="flex items-center justify-center px-4 pt-3">
        <span class="h-1.5 w-10 rounded-full bg-(--border)"></span>
        <button type="button" @click="headerStore.closeMenu" aria-label="关闭" class="absolute right-3 top-3 rounded-md p-1.5 text-(--muted-foreground) hover:bg-(--accent)">
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
            <Moon v-if="themeStore.isMoon" clsss="size-3.5"/>
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
  </div>
</template>

<style scoped>

</style>
