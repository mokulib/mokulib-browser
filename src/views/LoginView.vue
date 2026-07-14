<script setup lang="ts">
import { BookMarked } from "@lucide/vue";
import PageLogin from "@/components/PageLogin.vue";

const descriptions = [
  "“藏书是与时间的低语，每一页都值得被珍藏。”",
  "“纸张会泛黄，但故事永远年轻。”",
  "“藏书者，藏的不是纸，是渡人过河的舟楫。”",
]
</script>

<template>
  <main class="flex min-h-screen flex-col md:flex-row">
    <aside class="relative flex flex-col justify-between bg-(--primary) px-8 py-10 text-(--primary-foreground) md:w-2/5 md:px-12 md:py-14">
      <a class="flex items-center gap-2" href="/">
        <BookMarked class="size-6"/>
        <span class="font-serif text-xl font-semibold tracking-tight">墨库</span>
      </a>
      <div class="hidden md:block">
        <p class="font-serif text-3xl leading-snug text-balance">{{ descriptions[Math.floor(Math.random() * 3)] }}</p>
        <p class="mt-4 text-sm text-(--primary-foreground)/70">— 墨库 · 藏书借阅平台</p>
      </div>
      <p class="hidden text-xs text-(--primary-foreground)/60 md:block">© 2026 墨库</p>
    </aside>
    <section class="flex flex-1 items-center justify-center px-4 py-12 md:px-8">
      <div class="w-full max-w-sm">
        <PageLogin/>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>