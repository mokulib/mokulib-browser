<script setup lang="ts">
import { Eye, RefreshCw, PaperBag, BookOpen, ArrowRight, ShieldKeyhole, BookPlus, LayoutDashboard, LogOut, Moon, Sun, SunMoon, User } from "@lucide/vue";
import type { Response } from "@/types";
import { Message } from "@/components/message";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.ts";
import { usePopupStore } from "@/stores/popup.ts";
import { useThemeStore } from "@/stores/theme.ts";

const router = useRouter();
const authStore = useAuthStore();
const popupStore = usePopupStore();
const themeStore = useThemeStore();

function switchTheme() {
  themeStore.toggle();
  popupStore.close();
}

async function addBookCallback(data: Response<number>) {
  if (data.status === 'OK') {
    Message.success(data.message);
    router.push({ name: 'book', params: { id: data.data } });
  } else {
    Message.error(data.message);
  }
}
</script>

<template>
  <!-- 未登录 -->
  <div v-if="!authStore.isAuthed" class="flex flex-col gap-3 px-4 py-4 text-sm">
    <div>登录后你可以：</div>
    <div class="flex justify-between px-2">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2"><Eye class="size-5 text-(--primary)"/>免费看馆藏状态</div>
        <div class="flex items-center gap-2"><RefreshCw class="size-5 text-(--primary)"/>多端同步收藏记录</div>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2"><PaperBag class="size-5 text-(--primary)"/>线下借阅全部好书</div>
        <div class="flex items-center gap-2"><BookOpen class="size-5 text-(--primary)"/>热门好书新书看不停</div>
      </div>
    </div>
  </div>

  <!-- 信息 -->
  <div v-if="authStore.isAuthed" class="flex items-center gap-3 px-4 py-4">
    <img :src="authStore.avatar" :alt="authStore.username + '的头像'" class="size-11 shrink-0 rounded-full border border-(--border) object-cover">
    <div class="min-w-0 self-stretch flex flex-col justify-between">
      <div class="flex items-center gap-2">
        <p class="truncate font-serif text-base font-semibold text-(--foreground)">{{ authStore.username }}</p>
        <span class="shrink-0 rounded-full bg-(--primary)/10 px-2 py-0.5 text-[11px] font-medium text-(--primary)">{{ authStore.roleName }}</span>
      </div>
      <p class="truncate text-xs text-(--muted-foreground)">{{ authStore.email }}</p>
    </div>
  </div>

  <div v-if="!authStore.isAuthed" class="mb-1 border-t border-(--border)"></div>
  <!-- 前往登录 -->
  <div v-if="!authStore.isAuthed" class="px-2 py-1">
    <RouterLink :to="{ name: 'login' }" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
      <div class="flex items-center gap-2.5 py-2 text-sm">
        <User class="size-4"/>
        登录/注册
      </div>
      <ArrowRight class="size-4"/>
    </RouterLink>
  </div>

  <div v-if="authStore.isAuthed" class="mb-1 border-t border-(--border)"></div>
  <!-- 个人中心 -->
  <div v-if="authStore.isAuthed" class="px-2 py-1">
    <RouterLink :to="{ name: 'profile' }" @click="popupStore.close" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
      <div class="flex items-center gap-2.5 py-2 text-sm">
        <User class="size-4"/>
        个人中心
      </div>
      <ArrowRight class="size-4"/>
    </RouterLink>
  </div>
  <!-- 账号与安全 -->
  <div v-if="authStore.isAuthed" class="px-2 py-1">
    <RouterLink :to="{ name: 'security' }" @click="popupStore.close" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
      <div class="flex items-center gap-2.5 py-2 text-sm">
        <ShieldKeyhole class="size-4"/>
        账号与安全
      </div>
      <ArrowRight class="size-4"/>
    </RouterLink>
  </div>

  <div v-if="authStore.isAdmin" class="my-1 border-t border-(--border)"></div>
  <!-- 录入新书 -->
  <div v-if="authStore.isAdmin" class="px-2 py-1">
    <a href="/" @click.prevent="popupStore.open('addBook', undefined, addBookCallback)" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
      <div class="flex items-center gap-2.5 py-2 text-sm">
        <BookPlus class="size-4"/>
        录入新书
      </div>
    </a>
  </div>
  <!-- 数据概览 -->
  <div v-if="authStore.isAdmin" class="px-2 py-1">
    <RouterLink :to="{ name: 'dashboard' }" @click="popupStore.close" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
      <div class="flex items-center gap-2.5 py-2 text-sm">
        <LayoutDashboard class="size-4"/>
        数据概览
      </div>
      <ArrowRight class="size-4"/>
    </RouterLink>
  </div>

  <div class="my-1 border-t border-(--border)"></div>
  <!-- 主题切换 -->
  <div class="px-2 py-1 last:pb-2">
    <a href="/" @click.prevent="switchTheme()" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
      <div class="flex items-center gap-2.5 py-2 text-sm">
        <SunMoon class="size-4"/>
        主题切换
      </div>
      <Sun v-if="themeStore.isSun" class="size-4"/>
      <Moon v-if="themeStore.isMoon" class="size-4"/>
    </a>
  </div>

  <div v-if="authStore.isAuthed" class="my-1 border-t border-(--border)"></div>
  <!-- 退出登录 -->
  <div v-if="authStore.isAuthed" class="px-2 py-1 last:pb-2">
    <a href="/" @click.prevent="authStore.logout" class="flex items-center rounded-md px-2 text-(--destructive) hover:bg-(--destructive)/10 transition-colors">
      <div class="flex items-center gap-2.5 py-2 text-sm">
        <LogOut class="size-4"/>
        退出登录
      </div>
    </a>
  </div>
</template>

<style scoped>

</style>