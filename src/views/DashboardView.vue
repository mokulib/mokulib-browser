<script setup lang="ts">
import { Library, BookOpenCheck, Sparkles, Target } from "@lucide/vue";
</script>

<template>
  <div class="flex-1">
    <!-- 统计 -->
    <section v-if="false" class="mx-auto max-w-6xl mt-10 px-4 pb-4 md:px-8">
      <dl class="grid grid-cols-3 gap-4 border-t border-(--border) pt-8">
        <div class="flex flex-col gap-2">
          <Library class="size-5 text-(--primary)"/>
          <dd class="font-serif text-3xl font-medium md:text-4xl">342</dd>
          <dt class="text-xs uppercase tracking-wider text-(--muted-foreground)">藏书总数</dt>
        </div>
        <div class="flex flex-col gap-2">
          <BookOpenCheck class="size-5 text-(--primary)"/>
          <dd class="font-serif text-3xl font-medium md:text-4xl">168</dd>
          <dt class="text-xs uppercase tracking-wider text-(--muted-foreground)">已读完</dt>
        </div>
        <div class="flex flex-col gap-2">
          <Sparkles class="size-5 text-(--primary)"/>
          <dd class="font-serif text-3xl font-medium md:text-4xl">37/52</dd>
          <dt class="text-xs uppercase tracking-wider text-(--muted-foreground)">今年目标</dt>
        </div>
      </dl>
    </section>

    <!-- 阅读挑战 -->
    <section v-if="false" class="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-5 md:px-8">
      <div class="md:col-span-2">
        <div class="rounded-lg border border-(--border) bg-(--card) p-6">
          <div class="flex items-center gap-2 text-(--primary)">
            <Target class="size-5" aria-hidden="true"/>
            <h2 class="font-serif text-xl font-medium">2026 年阅读挑战</h2>
          </div>
          <p class="mt-4 font-serif text-5xl font-medium">
            37
            <span class="text-2xl text-(--muted-foreground)"> / 52 本</span>
          </p>
          <div class="mt-5 h-2 w-full overflow-hidden rounded-full bg-(--muted)" role="progressbar" aria-valuenow="71" aria-valuemin="0" aria-valuemax="100" aria-label="年度阅读挑战进度">
            <div class="h-full rounded-full bg-(--primary)" style="width:71%"></div>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-(--muted-foreground)">
            已完成年度目标的 71%，保持这个节奏，你会在年底前轻松达成。再读 15 本即可。
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>