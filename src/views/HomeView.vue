<script setup lang="ts">
import { Loader, ArrowDownNarrowWide, ArrowUpNarrowWide, BookDashed, Search } from "@lucide/vue";
import { usePopupStore } from "@/stores/popup.ts";
import { computed, onMounted, ref } from "vue";
import type { Category, Rank, SortMode } from "@/types";
import api from "@/api";
import type { Page } from "@/types/page.ts";
import { useBookStore } from "@/stores/book.ts";
import RankCard from "@/components/home/RankCard.vue";
import { useHotSearchVisibleCount } from "@/composables/useHotSearchVisibleCount.ts";

type CategoryStatus = { isActive: boolean; id: number; pageNum: number; sortMode: SortMode; books: Page<number>; };

const bookStore = useBookStore();
const popupStore = usePopupStore();

const hotSearches = ref<string[]>([]);
const categories = ref<Category[]>([]);

// 热搜
const hotSearchContainer = ref<HTMLElement | null>(null);
const { setHotSearchRef } = useHotSearchVisibleCount(hotSearches, hotSearchContainer);

// 排行榜
const ranksIsReady = ref(false);
const activeCardSet = ref<'hot' | 'new'>('hot'); // 当前激活的榜单集合
const borrowRank = ref<Rank>({ rank: [], update_time: '' });
const favoriteRank = ref<Rank>({ rank: [], update_time: '' });
const newMonthlyRank = ref<Rank>({ rank: [], update_time: '' });
const newStoreRank = ref<Rank>({ rank: [], update_time: '' });

// 分类
const loadingCategories = ref(true); // 使用专用状态变量，涵盖分类加载与图书加载两步，全部加载完成后，状态变为 false
const status = ref<CategoryStatus[]>([]); // 分类状态
const activeCategory = computed<CategoryStatus | undefined>(() => status.value.find(s => s.isActive)); // 当前激活的分类（计算属性）

async function setActive(id: number) {
  // 刷新全部分类状态中的激活状态
  status.value.forEach(s => s.isActive = (s.id === id));
  // 如果目标分类尚未初始化，则初始化
  if (status.value.find(s => s.id === id)?.books.total === -1)
    await goToPage(1, "PUBLISH_DATE_FROM_NEW_TO_OLD"); // 初始化当前分类
}

async function goToPage(pageNum: number, sortMode: SortMode) {
  if (!activeCategory.value)
    return;
  loadingCategories.value = true;
  activeCategory.value.sortMode = sortMode;
  activeCategory.value.books = (await api.get<Page<number>>(`/api/categories/${activeCategory.value.id}/books/page`, { params: { pageNum, sortMode } })).data;
  await bookStore.preload(...activeCategory.value.books.records);
  loadingCategories.value = false;
}

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

onMounted(async () => {
  ranksIsReady.value = false;
  // 获取热搜
  hotSearches.value = (await api.get<string[]>('/api/hot-search')).data;
  // 获取所有分类
  categories.value = (await api.get<Category[]>('/api/categories')).data.sort((a, b) => a.id - b.id);
  // 添加分类状态
  status.value = categories.value.map(category => ({
    isActive: false, id: category.id, pageNum: 1, sortMode: "PUBLISH_DATE_FROM_NEW_TO_OLD",
    books: { current: 0, pages: 0, records: [], size: 0, total: -1 },
  }));
  // 获取榜单
  borrowRank.value = (await api.get<Rank>('/api/ranks/borrow')).data;
  favoriteRank.value = (await api.get<Rank>('/api/ranks/favorite')).data;
  newMonthlyRank.value = (await api.get<Rank>('/api/ranks/new-monthly')).data;
  newStoreRank.value = (await api.get<Rank>('/api/ranks/new-store')).data;
  // 预加载
  await bookStore.preload(...borrowRank.value.rank, ...favoriteRank.value.rank, ...newMonthlyRank.value.rank, ...newStoreRank.value.rank);
  // 默认激活第一个分类
  if (status.value.length)
    setActive(status.value[0]?.id ?? 0);
  ranksIsReady.value = true;
})
</script>

<template>
  <main class="flex-1 flex flex-col">

    <!-- 搜索 -->
    <div class="mx-auto max-w-6xl w-full h-40 flex items-center justify-center">
      <div class="w-full max-w-xl flex flex-col gap-2">
        <!-- 搜索框 -->
        <div @click="popupStore.open('search', {})" class="flex items-center gap-3 mx-8 mt-12 px-5 py-3 rounded-2xl border border-(--border) bg-(--card) cursor-pointer transition-shadow hover:border-(--primary) hover:shadow-md">
          <Search class="size-4 text-(--foreground) shrink-0"/>
          <span class="line-clamp-1 text-sm text-(--muted-foreground) select-none">搜索 ISBN、书名、作者、出版社...</span>
        </div>
        <!-- 热搜词 -->
        <div class="flex items-center justify-start mx-8 px-8 text-sm">
          <div class="text-(--muted-foreground) shrink-0">热搜：</div>
          <div ref="hotSearchContainer" class="flex items-center justify-start gap-2 overflow-hidden flex-nowrap">
            <template v-for="(search, index) in hotSearches" :key="search">
              <div :ref="(el) => setHotSearchRef(el, index)" @click="popupStore.open('search', { keyword: search })" class="cursor-pointer text-(--muted-foreground) hover:text-(--primary) hover:underline whitespace-nowrap">{{ search }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 榜单 -->
    <section class="mx-auto max-w-6xl w-full px-4 md:px-8 pt-8 pb-4">
      <div class="flex items-center gap-5 mb-5">
        <h2 class="text-lg font-semibold tracking-wider text-(--foreground) shrink-0">热门榜单</h2>
        <div class="flex items-center gap-1">
          <button @click="activeCardSet = 'hot'" :data-active="activeCardSet === 'hot'" class="px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer data-[active=true]:text-(--primary) data-[active=true]:bg-(--primary)/10 hover:text-(--primary)">
            热门好书
          </button>
          <button @click="activeCardSet = 'new'" :data-active="activeCardSet === 'new'" class="px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer data-[active=true]:text-(--primary) data-[active=true]:bg-(--primary)/10 hover:text-(--primary)">
            新书上架
          </button>
        </div>
      </div>
      <div v-if="activeCardSet === 'hot'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <RankCard title="阅读榜单" description="根据借阅量排序" :background="'bg-(image:--rank-left)'" :ready="ranksIsReady" :rank="borrowRank"/>
        <RankCard title="收藏榜单" description="根据收藏量排序" :background="'bg-(image:--rank-right)'" :ready="ranksIsReady" :rank="favoriteRank"/>
      </div>
      <div v-if="activeCardSet === 'new'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <RankCard title="本月上新" description="近30天首次入库" :background="'bg-(image:--rank-left)'" :ready="ranksIsReady" :rank="newMonthlyRank"/>
        <RankCard title="近期入库" description="近期新入库的图书" :background="'bg-(image:--rank-right)'" :ready="ranksIsReady" :rank="newStoreRank"/>
      </div>
    </section>

    <!-- 全部图书 -->
    <div class="mx-auto max-w-6xl w-full px-4 md:px-8 pt-8">
      <!-- 标题 -->
      <h2 class="text-lg font-semibold tracking-wider text-(--foreground) mb-3">全部图书</h2>
      <!-- 分类导航 + 内容 -->
      <div v-if="categories.length && status.length" class="flex flex-col md:flex-row gap-4">
        <!-- 分类导航 -->
        <aside class="flex md:flex-col flex-wrap gap-1 md:gap-0 text-sm text-(--muted-foreground) self-start rounded-lg">
          <template v-for="category in categories" :key="category.id">
            <div @click="setActive(category.id)"
              :data-is-active="status.find(s => s.id === category.id)!.isActive"
              class="hover:translate-x-1 md:w-42 px-3 py-1.5 data-[is-active=true]:bg-(--primary)/10 border-(--primary) rounded-lg hover:text-(--foreground) data-[is-active=true]:text-(--primary) transition-all cursor-pointer">
              <div class="line-clamp-1">{{ category.name }}</div>
            </div>
          </template>
        </aside>

        <!-- 内容 -->
        <section class="flex-1 flex flex-col">
          <!-- 加载中 -->
          <div v-if="loadingCategories" class="h-143 flex flex-col items-center justify-center gap-4 animate-in fade-in-0">
            <Loader class="size-10 text-(--muted-foreground) animate-spin duration-3000"/>
            <div class="mb-36 text-sm text-(--muted-foreground)">加载中...</div>
          </div>

          <!-- 分类空态 -->
          <div v-if="!loadingCategories && activeCategory && activeCategory.books.total === 0" class="h-143 flex flex-col items-center justify-center gap-4 animate-in fade-in-0">
            <BookDashed class="size-10 text-(--muted-foreground)"/>
            <div class="mb-36 text-sm text-(--muted-foreground)">没有找到符合条件的图书</div>
          </div>

          <!-- 排序 -->
          <div v-if="!loadingCategories && activeCategory && activeCategory.books.total > 0" class="flex items-center px-3 py-2 gap-4 text-(--muted-foreground) animate-in fade-in-0">
            <button @click="() => goToPage(1, activeCategory?.sortMode === 'PUBLISH_DATE_FROM_NEW_TO_OLD' ? 'PUBLISH_DATE_FROM_OLD_TO_NEW' : 'PUBLISH_DATE_FROM_NEW_TO_OLD')"
                    :data-is-active="activeCategory?.sortMode === 'PUBLISH_DATE_FROM_NEW_TO_OLD' || activeCategory?.sortMode === 'PUBLISH_DATE_FROM_OLD_TO_NEW'"
                    class="flex items-center gap-2 hover:text-(--foreground) data-[is-active=true]:text-(--primary) transition-colors cursor-pointer">
              <span class="text-sm">出版时间</span>
              <ArrowDownNarrowWide v-if="activeCategory?.sortMode !== 'PUBLISH_DATE_FROM_OLD_TO_NEW'" class="size-4"/>
              <ArrowUpNarrowWide v-if="activeCategory?.sortMode === 'PUBLISH_DATE_FROM_OLD_TO_NEW'" class="size-4"/>
            </button>
            <div class="w-px h-4 block bg-(--primary)/25"></div>
            <button @click="() => goToPage(1, activeCategory?.sortMode === 'PRICE_FROM_LOW_TO_HIGH' ? 'PRICE_FROM_HIGH_TO_LOW' : 'PRICE_FROM_LOW_TO_HIGH')"
                    :data-is-active="activeCategory?.sortMode === 'PRICE_FROM_HIGH_TO_LOW' || activeCategory?.sortMode === 'PRICE_FROM_LOW_TO_HIGH'"
                    class="flex items-center gap-2 hover:text-(--foreground) data-[is-active=true]:text-(--primary) transition-colors cursor-pointer">
              <span class="text-sm">价格</span>
              <ArrowDownNarrowWide v-if="activeCategory?.sortMode !== 'PRICE_FROM_HIGH_TO_LOW'" class="size-4"/>
              <ArrowUpNarrowWide v-if="activeCategory?.sortMode === 'PRICE_FROM_HIGH_TO_LOW'" class="size-4"/>
            </button>
          </div>
          <!-- 图书展示 -->
          <div v-if="!loadingCategories && activeCategory && activeCategory.books.total > 0" class="flex-1 grid grid-cols-3 sm:grid-cols-4 gap-4 m-4 animate-in fade-in-0">
            <template v-for="bookId in activeCategory.books?.records" :key="bookId">
              <RouterLink :to="{ name: 'book', params: { id: bookId } }" class="flex flex-col items-center justify-start gap-2 cursor-pointer
               hover:[&_img]:shadow-lg hover:[&_img]:-translate-y-1 hover:[&_a]:text-(--primary)">
                <img :src="`/books/${bookId}`" class="w-24 aspect-4/5 border border-(--border) rounded-lg shadow object-cover transition-all" style="--tw-shadow-color: color-mix(in oklch, var(--primary) 10%, transparent);" :alt="bookStore.book(bookId).value?.title"/>
                <a class="line-clamp-1 text-sm text-center">{{ bookStore.book(bookId).value?.title }}</a>
              </RouterLink>
            </template>
            <!-- 空位补充 -->
            <template v-for="i in 12 - activeCategory.books.records.length" :key="i">
              <div class="flex flex-col items-center justify-start gap-2 opacity-0">
                <div class="w-24 aspect-4/5 border border-(--border) rounded-lg"></div>
                <div class="line-clamp-1 text-sm text-center">&ensp;</div>
              </div>
            </template>
          </div>
          <!-- 分页组件 -->
          <div v-if="!loadingCategories && activeCategory && activeCategory.books.total > 0" class="flex items-center justify-center mb-2 gap-2 animate-in fade-in-0">
            <button @click="goToPage(1, activeCategory?.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50 cursor-pointer disabled:cursor-auto" :disabled="activeCategory.books?.current === 1">首页</button>
            <button @click="goToPage(activeCategory.books?.current - 1, activeCategory?.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50 cursor-pointer disabled:cursor-auto" :disabled="activeCategory.books?.current === 1">上一页</button>
            <template v-for="i in activeCategory.books?.pages">
              <button @click="activeCategory.books?.current === i ? null : goToPage(i, activeCategory?.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) cursor-pointer data-[is-current=true]:cursor-auto" :data-is-current="activeCategory.books?.current === i" :class="{ 'text-(--primary)': activeCategory.books?.current === i }">{{ i }}</button>
            </template>
            <button @click="goToPage(activeCategory.books?.current + 1, activeCategory?.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50 cursor-pointer disabled:cursor-auto" :disabled="activeCategory.books?.current === activeCategory.books?.pages">下一页</button>
            <button @click="goToPage(activeCategory.books?.pages, activeCategory?.sortMode)" class="text-sm text-(--foreground) hover:text-(--primary) disabled:text-(--muted-foreground)/50 cursor-pointer disabled:cursor-auto" :disabled="activeCategory.books?.current === activeCategory.books?.pages">尾页</button>
          </div>
        </section>

      </div>
      <!-- 无图书提示 -->
      <div v-else class="flex flex-col items-center justify-center my-4 gap-3 rounded-xl border-2 border-dashed border-(--border) py-14 text-center">
        <BookDashed class="size-7 text-(--muted-foreground)"/>
        <div class="text-sm text-(--muted-foreground)">暂无图书</div>
      </div>
    </div>

  </main>
</template>