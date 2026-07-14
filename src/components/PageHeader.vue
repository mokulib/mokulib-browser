<script setup lang="ts">

import { Search, Landmark } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useUserStore } from "@/stores/user.ts";

const authStore = useAuthStore();
const userStore = useUserStore();
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
      <button type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:hover:bg-(--muted)/50 size-8">
        <Search class="size-5"/>
      </button>
      <button v-if="authStore.isLoggedIn" type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:hover:bg-(--muted)/50 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2">
        <a href="/">{{ userStore.user_username }}</a>
      </button>
      <button v-else type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2">
        <a href="/login">登录</a>
      </button>
    </div>

  </div>

</template>

<style scoped>

</style>