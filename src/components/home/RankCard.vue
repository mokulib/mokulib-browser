<script setup lang="ts">
import { type PropType } from "vue";
import { useBookStore } from "@/stores/book.ts";
import { type Rank } from "@/types";
import { DateTime } from "luxon";

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  background: { type: String, required: true },
  ready: { type: Boolean, required: true },
  rank: { type: Object as PropType<Rank>, required: true },
})

const bookStore = useBookStore();
</script>

<template>
  <article class="rounded-2xl overflow-hidden text-white transition-all shadow-[0_14px_30px_-14px_rgba(0,0,0,.4)] duration-200 hover:-translate-y-1 hover:shadow-[0_22px_38px_-16px_rgba(0,0,0,.45)]" :class="background">
    <div class="flex flex-col p-5 md:p-6 gap-4">
      <!-- 头部：标题 + 描述（左），更新时间（右上角） -->
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="text-[15px] font-bold leading-tight truncate">{{ title }}</div>
          <div class="mt-1 text-xs opacity-80">{{ description }}</div>
        </div>
        <div class="shrink-0 text-[11px] opacity-75 pt-0.5 whitespace-nowrap">{{ rank.update_time ? `更新于 ${DateTime.fromISO(rank.update_time).toFormat('MM-dd HH:mm')}` : '' }}</div>
      </div>

      <!-- 加载中 -->
      <div v-if="!ready" class="h-70 flex flex-col gap-3 animate-pulse pointer-events-none">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3">
          <div class="size-6 rounded-lg bg-white/20"></div>
          <div class="h-9 w-7 rounded bg-white/20"></div>
          <div class="h-4 flex-1 rounded bg-white/20"></div>
        </div>
      </div>

      <!-- 无数据 -->
      <div v-else-if="rank.rank.length === 0" class="h-70 flex items-center justify-center text-center text-[13px] opacity-75">
        <div class="mb-20">暂无数据</div>
      </div>

      <!-- 榜单列表 -->
      <div v-else class="h-70 flex flex-col">
        <RouterLink v-for="(bookId, index) in rank.rank" :key="bookId" :to="{ name: 'book', params: { id: bookId } }" class="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-white/10">
          <div class="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/16 text-xs font-bold transition-all duration-150">
            {{ String(index + 1).padStart(2, "0") }}
          </div>
          <img :src="`/books/${bookId}`" class="h-10 w-8 shrink-0 rounded object-cover transition-transform duration-200 group-hover:scale-105" :alt="bookStore.book(bookId).value?.title ?? ''"/>
          <span class="min-w-0 flex-1 truncate text-[13px] transition-colors duration-150 group-hover:underline">
            {{ bookStore.book(bookId).value?.title || "加载中…" }}
          </span>
          <span class="hidden text-[11px] opacity-70 sm:inline">{{ bookStore.book(bookId).value?.author }}</span>
          <svg class="size-4 shrink-0 -translate-x-1.5 text-(--primary-foreground) opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped>

</style>