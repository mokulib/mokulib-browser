<script setup lang="ts">
import { ArrowLeft, Search, Loader, ArrowUpNarrowWide, ArrowDownNarrowWide } from "@lucide/vue";
import { computed, onMounted, ref } from "vue";
import { usePopupStore } from "@/stores/popup.ts";
import type { Book } from "@/types";
import api from "@/api";
import type { Page } from "@/types/page.ts";
import { useRouter } from "vue-router";

// 定义类型
type SortMode = "PUBLISH_DATE_FROM_NEW_TO_OLD" | "PUBLISH_DATE_FROM_OLD_TO_NEW" | "PRICE_FROM_LOW_TO_HIGH" | "PRICE_FROM_HIGH_TO_LOW";
type Conditions = { keyword: string, sortMode: SortMode };

const router = useRouter();
const popupStore = usePopupStore();

const isSearched = ref(false);
const isLoading = ref(false);
const requestTimestamp = ref(0);
const searchInput = ref("");
const hotSearches = ["英语", "数学", "计算机"];
const conditions = ref<Conditions>({ keyword: "", sortMode: "PUBLISH_DATE_FROM_NEW_TO_OLD" })
const isPublishDateSort = computed(() => conditions.value.sortMode === "PUBLISH_DATE_FROM_NEW_TO_OLD" || conditions.value.sortMode === "PUBLISH_DATE_FROM_OLD_TO_NEW");
const isPriceSort = computed(() => conditions.value.sortMode === "PRICE_FROM_LOW_TO_HIGH" || conditions.value.sortMode === "PRICE_FROM_HIGH_TO_LOW");
const results = ref<Page<Book>>({ current: 0, pages: 0, records: [], size: 0, total: 0 });
const hoveredIndex = ref<number>(0);

async function hotSearch(keyword: string) {
  searchInput.value = keyword;
  await goToPage(1, 'PUBLISH_DATE_FROM_NEW_TO_OLD');
}

async function goToPage(pageNum: number, sortMode_: SortMode) {
  if (isSearched.value && searchInput.value === conditions.value.keyword && sortMode_ === conditions.value.sortMode && pageNum === results.value.current)
    return;

  if (!searchInput.value) {
    isSearched.value = false;
    return;
  }

  isLoading.value = true;
  requestTimestamp.value = Date.now();
  const data = await api.get<{ conditions: Conditions, results: Page<Book> }>('/api/books/search', { params: { keyword: searchInput.value, pageNum, sortMode: sortMode_ } });
  conditions.value = data.data.conditions;
  results.value = data.data.results;
  hoveredIndex.value = 0;
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

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

onMounted(() => popupStore.registerInitHook('search', ({ clone }) => {
  if (clone?.keyword) {
    isSearched.value = false;
    searchInput.value = clone.keyword;
    goToPage(1, 'PUBLISH_DATE_FROM_NEW_TO_OLD');
  }
}));
</script>

<template>
  <div v-if="popupStore.isOpen('search')" class="absolute top-0 w-full h-full md:h-auto md:max-w-2xl flex flex-col items-center justify-start pt-0 md:pt-8 animate-in fade-in-0 md:slide-in-from-top duration-300">
    <!-- 背景 -->
    <div class="w-full h-full flex flex-col items-center mb-0 md:mb-8 p-4 md:rounded-lg bg-(--background)">
      <!-- 返回 + 输入 -->
      <div class="w-full flex items-center gap-3 bg-(--background)">
        <button @click="popupStore.close()" class="md:hidden mx-2">
          <ArrowLeft class="size-5 text-(--secondary-foreground)"/>
        </button>
        <div class="w-full px-6 md:px-8 rounded border border-(--border)">
          <div class="w-full flex items-center py-2 gap-3">
            <button @click="goToPage(1, 'PUBLISH_DATE_FROM_NEW_TO_OLD')">
              <Search class="size-5 text-(--secondary-foreground)"/>
            </button>
            <input v-model="searchInput" type="text" @keydown.enter="goToPage(1, 'PUBLISH_DATE_FROM_NEW_TO_OLD')" placeholder="搜索..." class="w-full text-(--secondary-foreground) outline-none"/>
            <Loader class="size-5 text-(--secondary-foreground) opacity-0 animate-spin" :class="{ 'opacity-100': isLoading }" style="transition-duration: 500ms; animation-duration: 3000ms"/>
          </div>
        </div>
      </div>

      <!-- 热搜 -->
      <div class="w-full flex items-center justify-start mt-2 pl-18 md:pl-8 pr-16 text-sm text-(--muted-foreground)">
        <div>热搜：</div>
        <div class="flex items-center justify-center gap-2">
          <template v-for="search in hotSearches" :key="search">
            <div @click="hotSearch(search)" class="cursor-pointer hover:text-(--primary) hover:underline">{{ search }}</div>
          </template>
        </div>
      </div>

      <!-- 无搜索结果 -->
      <div v-if="isSearched && results.total === 0" class="mt-6 p-6 rounded-2xl bg-(--background)">
        <div class="text-sm tracking-wider">未找到相关结果</div>
      </div>

      <!-- 有搜索结果 - Header -->
      <div v-if="isSearched && results.total > 0" class="w-full flex items-center justify-between mt-6 mb-2 px-8 py-1 rounded text-(--muted-foreground) bg-(--muted)">
        <!-- 排序 -->
        <div class="flex items-center gap-2">
          <button @click="() => goToPage(1, conditions.sortMode === 'PUBLISH_DATE_FROM_NEW_TO_OLD' ? 'PUBLISH_DATE_FROM_OLD_TO_NEW' : 'PUBLISH_DATE_FROM_NEW_TO_OLD')" class="flex items-center gap-2 cursor-pointer" :class="{ 'text-(--primary)': isPublishDateSort }">
            <span class="text-sm">出版时间</span>
            <ArrowDownNarrowWide v-if="isPriceSort || conditions.sortMode === 'PUBLISH_DATE_FROM_NEW_TO_OLD'" class="size-4"/>
            <ArrowUpNarrowWide v-if="conditions.sortMode === 'PUBLISH_DATE_FROM_OLD_TO_NEW'" class="size-4"/>
          </button>
          <div class="w-px h-10px block bg-(--border)"></div>
          <button @click="() => goToPage(1, conditions.sortMode === 'PRICE_FROM_LOW_TO_HIGH' ? 'PRICE_FROM_HIGH_TO_LOW' : 'PRICE_FROM_LOW_TO_HIGH')" class="flex items-center gap-2 cursor-pointer" :class="{ 'text-(--primary)': isPriceSort }">
            <span class="text-sm">价格</span>
            <ArrowDownNarrowWide v-if="isPublishDateSort || conditions.sortMode === 'PRICE_FROM_LOW_TO_HIGH'" class="size-4"/>
            <ArrowUpNarrowWide v-if="conditions.sortMode === 'PRICE_FROM_HIGH_TO_LOW'" class="size-4"/>
          </button>
        </div>
        <!-- 统计 -->
        <div class="text-sm">共 {{ results.total }} 个结果</div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="isSearched && results.total > 0" class="w-full overflow-y-auto overscroll-behavior-contain min-h-30 max-h-[calc(100vh-190px)] md:max-h-[calc(100vh-255px)]">
        <div class="flex flex-col gap-2">
          <template v-for="(result, index) in results.records" :key="result.id">
            <div @click="router.push({ name: 'book', params: { id: result.id } })" @mouseenter="hoveredIndex = index" :data-is-hovered="hoveredIndex === index" class="
              flex p-2 gap-4 border border-(--border) rounded md:data-[is-hovered=true]:border-(--primary) cursor-pointer
              md:[&_.title]:text-(--muted-foreground)/50 md:data-[is-hovered=true]:[&_.title]:text-(--foreground)
              [&_.desc]:text-(--muted-foreground) md:[&_.desc]:text-(--muted-foreground)/50 md:data-[is-hovered=true]:[&_.desc]:text-(--muted-foreground)">
              <img :src="`/books/${result.id}`" class="size-24 object-cover rounded-lg md:rounded" alt="Book Cover"/>
              <div class="flex flex-col items-start">
                <div class="title mt-0.5 line-clamp-1 text-sm">{{ result.title }}</div>
                <div class="desc mt-0.5 line-clamp-1 text-xs">{{ result.author }} / {{ result.publish_date }} / {{ result.publisher }} / {{ result.price.toFixed(2) }}￥</div>
                <div class="desc mt-3.5 line-clamp-2 text-sm">{{ result.description }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 分页组件 -->
      <div v-if="isSearched && results.total > 0" class="flex items-center justify-center mt-2 gap-2">
        <button @click="goToPage(1, conditions.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50 cursor-pointer disabled:cursor-auto" :disabled="results.current === 1">首页</button>
        <button @click="goToPage(results.current - 1, conditions.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50 cursor-pointer disabled:cursor-auto" :disabled="results.current === 1">上一页</button>
        <template v-for="i in results.pages">
          <button @click="results.current === i ? null : goToPage(i, conditions.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) cursor-pointer data-[is-current=true]:cursor-auto" :data-is-current="results.current === i" :class="{ 'text-(--primary)': results.current === i }">{{ i }}</button>
        </template>
        <button @click="goToPage(results.current + 1, conditions.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50 cursor-pointer disabled:cursor-auto" :disabled="results.current === results.pages">下一页</button>
        <button @click="goToPage(results.pages, conditions.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50 cursor-pointer disabled:cursor-auto" :disabled="results.current === results.pages">尾页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>