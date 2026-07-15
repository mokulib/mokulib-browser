<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import PageHeader from "@/components/PageHeader.vue";
import PageFooter from "@/components/PageFooter.vue";
import { computed } from "vue";
import { X, User, Sun, Moon, LogOut } from "@lucide/vue";
import { useHeaderStore } from "@/stores/header.ts";

const route = useRoute();
const headerStore = useHeaderStore();

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
  <div v-if="headerStore.isExpanded" class="fixed inset-0 z-60 sm:hidden" role="dialog" aria-modal="true" aria-label="用户菜单">
    <div class="absolute inset-0 bg-(--foreground)/40 animate-in fade-in-0"></div>
    <div class="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-(--border) bg-(--popover) pb-[env(safe-area-inset-bottom)] text-(--popover-foreground) shadow-2xl animate-in slide-in-from-bottom">
      <div class="flex items-center justify-center px-4 pt-3">
        <span class="h-1.5 w-10 rounded-full bg-(--border)"></span>
        <button type="button" @click="headerStore.closeMenu" aria-label="关闭" class="absolute right-3 top-3 rounded-md p-1.5 text-(--muted-foreground) hover:bg-(--accent)">
          <X class="size-5"/>
        </button>
      </div>
      <div class="pt-2">
        <div class="flex items-center gap-3 px-3 py-3">
          <img alt="王先生的头像" class="size-11 shrink-0 rounded-full border border-(--border) object-cover" src="@/assets/mr-wang.png">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <p class="truncate font-serif text-base font-semibold text-(--foreground)">王先生</p>
              <span class="shrink-0 rounded-full bg-(--primary)/10 px-2 py-0.5 text-[11px] font-medium text-(--primary)">管理员</span>
            </div>
            <p class="truncate text-xs text-(--muted-foreground)">@mr_wang</p>
            <p class="truncate text-xs text-(--muted-foreground)">mr.wang@moku.library</p>
          </div>
        </div>
        <div class="my-1 border-t border-(--border)"></div>
        <div class="px-2 py-1">
          <a class="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-(--foreground) transition-colors hover:bg-(--accent) hover:text-(--accent-foreground)" href="/profile">
            <User class="size-4 text-(--muted-foreground)"/>
            个人中心
          </a>
        </div>
        <div class="my-1 border-t border-(--border)"></div>
        <div class="px-3 py-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-(--foreground)">主题</span>
            <div role="group" aria-label="主题切换" class="flex items-center gap-1 rounded-full border border-(--border) bg-(--secondary)/60 p-1">
              <button type="button" aria-pressed="true" class="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors bg-(--background) text-(--foreground) shadow-sm">
                <Sun class="size-3.5"/>
                浅色
              </button>
              <button type="button" aria-pressed="false" class="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors text-(--muted-foreground) hover:text-(--foreground)">
                <Moon clsss="size-3.5"/>
                深色
              </button>
            </div>
          </div>
        </div>
        <div class="my-1 border-t border-(--border)"></div>
        <div class="px-2 pb-2 pt-1">
          <button type="button" class="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-(--destructive) transition-colors hover:bg-(--destructive)/10">
            <LogOut class="size-4"/>
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
