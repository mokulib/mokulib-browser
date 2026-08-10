<script setup lang="ts">
import { ArrowLeft, Search, Loader, ArrowUpNarrowWide, ArrowDownNarrowWide } from "@lucide/vue";
import { computed, ref } from "vue";
import { usePopupStore } from "@/stores/popup.ts";
import type { Book } from "@/types";
import api from "@/api";
import type { Page } from "@/types/page.ts";

// 定义类型
type SortMode = "PUBLISH_DATE_FROM_NEW_TO_OLD" | "PUBLISH_DATE_FROM_OLD_TO_NEW" | "PRICE_FROM_LOW_TO_HIGH" | "PRICE_FROM_HIGH_TO_LOW";
type Conditions = { keyword: string, sortMode: SortMode };

const popupStore = usePopupStore();

const isSearched = ref(false);
const isLoading = ref(false);
const requestTimestamp = ref(0);
const searchInput = ref("");
const conditions = ref<Conditions>({ keyword: "", sortMode: "PUBLISH_DATE_FROM_NEW_TO_OLD" })
const results = ref<Page<Book>>({ current: 0, pages: 0, records: [], size: 0, total: 0 });
const isPublishDateSort = computed(() => conditions.value.sortMode === "PUBLISH_DATE_FROM_NEW_TO_OLD" || conditions.value.sortMode === "PUBLISH_DATE_FROM_OLD_TO_NEW");
const isPriceSort = computed(() => conditions.value.sortMode === "PRICE_FROM_LOW_TO_HIGH" || conditions.value.sortMode === "PRICE_FROM_HIGH_TO_LOW");

async function goToPage(pageNum: number, sortMode_: SortMode) {
  if (searchInput.value === conditions.value.keyword && sortMode_ === conditions.value.sortMode && pageNum === results.value.current)
    return;

  isLoading.value = true;
  requestTimestamp.value = Date.now();
  const data = await api.get<{ conditions: Conditions, results: Page<Book> }>('/api/books/search', { params: { keyword: searchInput.value, pageNum, sortMode: sortMode_ } });
  conditions.value = data.data.conditions;
  results.value = data.data.results;
  // 至少等待 1s
  if (Date.now() - requestTimestamp.value < 1000) {
    setTimeout(() => {
      isLoading.value = false;
      isSearched.value = true;
    }, 1000 - (Date.now() - requestTimestamp.value))
  } else {
    isLoading.value = false;
    isSearched.value = true;
  }
}
</script>

<template>
  <div v-if="popupStore.isOpen('search')" class="absolute w-full h-full md:max-w-2xl flex flex-col items-center justify-start pt-8 bg-(--background) md:bg-transparent animate-in fade-in-0 md:slide-in-from-top duration-0 md:duration-300">
    <!-- 输入框 -->
    <div class="w-full flex items-center mb-8 px-8 gap-3 md:rounded-2xl bg-(--background)">
      <button @click="popupStore.close()" class="md:hidden">
        <ArrowLeft class="size-5 text-(--secondary-foreground)"/>
      </button>
      <div class="w-full flex items-center px-4 md:px-0 py-2 gap-3 rounded-2xl border border-(--border) md:border-none">
        <button @click="goToPage(1, 'PUBLISH_DATE_FROM_NEW_TO_OLD')">
          <Search class="size-5 text-(--secondary-foreground)"/>
        </button>
        <input v-model="searchInput" type="text" @keydown.enter="goToPage(1, 'PUBLISH_DATE_FROM_NEW_TO_OLD')" placeholder="搜索..." class="w-full text-(--secondary-foreground) outline-none"/>
        <Loader class="size-5 text-(--secondary-foreground) opacity-0 animate-spin" :class="{ 'opacity-100': isLoading }" style="transition-duration: 500ms; animation-duration: 3000ms"/>
      </div>
    </div>

    <!-- 无搜索结果 -->
    <div v-if="isSearched && results.total === 0" class="w-full flex flex-col items-center justify-center p-10 rounded-2xl text-(--secondary-foreground) bg-(--background)">
      <div>未找到相关结果</div>
    </div>

    <!-- 有搜索结果 -->
    <div v-if="isSearched && results.total > 0" class="w-full flex flex-col rounded-2xl text-(--secondary-foreground) bg-(--background)">
      <!-- Header -->
      <div class="flex items-center justify-between px-10 pt-3 pb-2.5 border-b border-(--border)">
        <!-- 排序 -->
        <div class="flex items-center gap-2">
          <button @click="() => goToPage(1, conditions.sortMode === 'PUBLISH_DATE_FROM_NEW_TO_OLD' ? 'PUBLISH_DATE_FROM_OLD_TO_NEW' : 'PUBLISH_DATE_FROM_NEW_TO_OLD')" class="flex items-center gap-2" :class="{ 'text-(--primary)': isPublishDateSort }">
            <span class="text-sm">出版时间</span>
            <ArrowDownNarrowWide v-if="isPriceSort || conditions.sortMode === 'PUBLISH_DATE_FROM_NEW_TO_OLD'" class="size-4"/>
            <ArrowUpNarrowWide v-if="conditions.sortMode === 'PUBLISH_DATE_FROM_OLD_TO_NEW'" class="size-4"/>
          </button>
          <div class="w-px h-full bg-(--border)"></div>
          <button @click="() => goToPage(1, conditions.sortMode === 'PRICE_FROM_LOW_TO_HIGH' ? 'PRICE_FROM_HIGH_TO_LOW' : 'PRICE_FROM_LOW_TO_HIGH')" class="flex items-center gap-2" :class="{ 'text-(--primary)': isPriceSort }">
            <span class="text-sm">价格</span>
            <ArrowDownNarrowWide v-if="isPublishDateSort || conditions.sortMode === 'PRICE_FROM_LOW_TO_HIGH'" class="size-4"/>
            <ArrowUpNarrowWide v-if="conditions.sortMode === 'PRICE_FROM_HIGH_TO_LOW'" class="size-4"/>
          </button>
        </div>
        <!-- 统计 -->
        <div class="text-sm text-(--muted-foreground)">共 {{ results.total }} 个结果</div>
      </div>
      <!-- 搜索结果 -->
      <div class="flex-1 overflow-y-auto overscroll-behavior-contain min-h-32 max-h-[calc(100vh-192px)] md:max-h-[calc(100vh-222px)]">
        <div class="flex flex-col p-4 gap-4">
          <template v-for="result in results.records" :key="result.id">
            <div class="flex">
              <img :src="`/books/${result.id}`" class="size-24 rounded-2xl" alt="Book Cover"/>
              <div class="ml-4">
                <div class="flex">
                  <RouterLink :to="`/book/${result.id}`" class="mt-0.5 line-clamp-1 text-sm text-(--secondary-foreground) hover:text-(--primary) hover:underline">{{ result.title }}</RouterLink>
                </div>
                <div class="mt-0.5 line-clamp-1 text-xs text-(--muted-foreground)">{{ result.author }} / {{ result.publish_date }} / {{ result.publisher }} / {{ result.price.toFixed(2) }}￥</div>
                <div class="mt-3.5 line-clamp-2 text-sm text-(--secondary-foreground)">{{ result.description }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- 分页组件 -->
      <div v-if="results.total > 0" class="flex items-center justify-center pt-2.5 pb-3 gap-2 rounded-b-2xl border-t border-(--border)">
        <button @click="goToPage(1, conditions.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50" :disabled="results.current === 1">首页</button>
        <button @click="goToPage(results.current - 1, conditions.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50" :disabled="results.current === 1">上一页</button>
        <template v-for="i in results.pages">
          <button @click="goToPage(i, conditions.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary)" :class="{ 'text-(--primary)': results.current === i }">{{ i }}</button>
        </template>
        <button @click="goToPage(results.current + 1, conditions.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50" :disabled="results.current === results.pages">下一页</button>
        <button @click="goToPage(results.pages, conditions.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50" :disabled="results.current === results.pages">尾页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>