<script setup lang="ts">
import { Search, ArrowDownNarrowWide, ArrowUpNarrowWide, BookDashed } from "@lucide/vue";
import { usePopupStore } from "@/stores/popup.ts";
import { computed, onMounted, ref } from "vue";
import type { Book, Category, SortMode } from "@/types";
import api from "@/api";
import type { Page } from "@/types/page.ts";
import { useBookStore } from "@/stores/book.ts";
import { useRouter } from "vue-router";
import RankCard from "@/components/home/RankCard.vue";

type BaseStatus = { isActive: boolean };
type HotStatus = BaseStatus & { type: 'hot' };
type NewStatus = BaseStatus & { type: 'new' };
type CategoryStatus = BaseStatus & { type: 'category'; id: number; pageNum: number; sortMode: SortMode; books: Page<Book>; };
type Status = HotStatus | NewStatus | CategoryStatus;

const router = useRouter();
const bookStore = useBookStore();
const popupStore = usePopupStore();

const hotSearches = ref<string[]>([]);
const categories = ref<Category[]>([]);
const status = ref<Status[]>([ { type: "hot", isActive: true }, { type: "new", isActive: false }, ]);
const isHotActive = computed(() => status.value.some(s => s.type === 'hot' && s.isActive));
const isNewActive = computed(() => status.value.some(s => s.type === 'new' && s.isActive));
const activeCategory = computed<CategoryStatus | undefined>(() => status.value.find(s => s.type === 'category' && s.isActive) as CategoryStatus | undefined);
const borrowRank = ref<number[]>([]);
const favoriteRank = ref<number[]>([]);
const newMonthlyRank = ref<number[]>([]);
const newStoreRank = ref<number[]>([]);

/////////////////////////////////////////////
// 状态管理
/////////////////////////////////////////////

// 切换激活状态
function setActive(type: Status['type'], id?: number) {
  // 取消所有激活
  status.value.forEach(s => s.isActive = false);

  // 激活目标
  if (type === 'hot' || type === 'new') {
    status.value.find(s => s.type === type)!.isActive = true;
  } else if (type === 'category' && id !== undefined) {
    status.value.find(s => s.type === 'category' && s.id === id)!.isActive = true;
  }

  // 检查数据是否需要请求
  if (activeCategory && activeCategory.value?.books.total === -1)
    goToPage(1, "PUBLISH_DATE_FROM_NEW_TO_OLD")
}

/////////////////////////////////////////////
// 页面展示用数据请求
/////////////////////////////////////////////

async function goToPage(pageNum: number, sortMode: SortMode) {
  activeCategory.value!.sortMode = sortMode;
  activeCategory.value!.books = (await api.get<Page<Book>>(`/api/categories/${activeCategory.value!.id}/books`, { params: { pageNum, sortMode } })).data;
}

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

onMounted(async () => {
  // 获取热搜
  hotSearches.value = (await api.get<string[]>('/api/search/hot')).data;
  // 获取所有分类
  categories.value = (await api.get<Category[]>('/api/categories')).data.sort((a, b) => a.id - b.id);
  // 添加分类状态
  status.value.push(...categories.value.map(category => ({ type: "category", isActive: false, id: category.id, pageNum: 1, sortMode: "PUBLISH_DATE_FROM_NEW_TO_OLD", books: { current: 0, pages: 0, records: [], size: 0, total: -1 } })) as CategoryStatus[]);
  // 获取榜单
  borrowRank.value = (await api.get<number[]>('/api/ranks/borrow')).data;
  favoriteRank.value = (await api.get<number[]>('/api/ranks/favorite')).data;
  newMonthlyRank.value = (await api.get<number[]>('/api/ranks/new-monthly')).data;
  newStoreRank.value = (await api.get<number[]>('/api/ranks/new-store')).data;
  // 预加载
  await bookStore.preload(...borrowRank.value, ...favoriteRank.value, ...newMonthlyRank.value, ...newStoreRank.value);
})
</script>

<template>
  <main class="flex-1 flex flex-col">

    <!-- 搜索 -->
    <div class="relative mx-auto max-w-6xl w-full h-62 flex items-center justify-center">
      <div class="absolute inset-0 z-10 mx-4 md:mx-8 rounded-br-lg bg-[url('/banner.png')] dark:bg-[url('/banner-dark.png')] bg-center"></div>
      <div class="z-20 w-full max-w-xl flex flex-col gap-2">
        <!-- 搜索框 -->
        <div class="flex items-center justify-center mx-8 px-8 py-2 gap-3 rounded-2xl border border-(--border) bg-(--card)">
          <Search @click="popupStore.open('search', {})" class="size-5 text-(--foreground)"/>
          <div @click="popupStore.open('search', {})" class="w-full h-6 outline-none cursor-text"/>
        </div>
        <!-- 热搜词 -->
        <div class="flex items-center justify-start mx-8 px-8 text-sm">
          <div class="text-(--muted-foreground) shrink-0">热搜：</div>
          <div class="flex items-center justify-start gap-2 overflow-hidden flex-nowrap">
            <template v-for="search in hotSearches" :key="search">
              <div @click="popupStore.open('search', { keyword: search })" class="cursor-pointer text-(--muted-foreground) hover:text-(--primary) hover:underline whitespace-nowrap">{{ search }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 全部图书分类 + 排序 -->
    <div class="border-b border-(--primary) text-sm"><!-- 全宽下边框 -->
      <div class="mx-auto max-w-6xl w-full flex items-center px-4 md:px-8"><!-- 限制宽度 -->
        <div class="shrink-0 w-44 pl-4 py-2 border-t border-(--primary) text-(--background) bg-(--primary)">全部图书分类</div>
        <div class="flex items-end px-4 gap-4">
          <div @mouseenter="setActive('hot')" :data-is-active="isHotActive" class="relative mt-1 px-6 pt-1 pb-2 rounded-t data-[is-active=true]:text-(--primary) data-[is-active=true]:bg-(--primary)/10 transition-all cursor-pointer">
            <div class="absolute inset-x-5 bottom-1 h-0.5 bg-(--primary) transition-all duration-300 pointer-events-none" :class="{ 'opacity-0': !isHotActive && !isNewActive, 'translate-x-30': isNewActive }"></div>
            热门好书
          </div>
          <div @mouseenter="setActive('new')" :data-is-active="isNewActive" class="mt-1 px-6 pt-1 pb-2 rounded-t data-[is-active=true]:text-(--primary) data-[is-active=true]:bg-(--primary)/10 transition-all cursor-pointer">
            新书上架
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="mx-auto max-w-6xl w-full flex-1 flex px-4 pb-8 md:px-8">
      <!-- 边框 -->
      <div class="flex-1 flex">
        <!-- 导航 -->
        <aside class="shrink-0 flex flex-col text-sm bg-(--muted)">
          <div class="h-2"></div>
          <template v-for="category in categories" :key="category.id">
            <div @mouseenter="setActive('category', category.id)" :data-is-hovered="status.find(s => s.type === 'category' && s.id === category.id)!.isActive" class="w-42 ml-2 pl-2 data-[is-hovered=true]:pl-4 py-1 data-[is-hovered=true]:bg-(--primary)/10 border-(--primary) rounded-l data-[is-hovered=true]:text-base data-[is-hovered=true]:text-(--primary) transition-all cursor-pointer">
              <div class="line-clamp-1">
                {{ category.name }}
              </div>
            </div>
          </template>
        </aside>
        <!-- 内容 -->
        <section class="flex-1 flex">
          <!-- 热门好书 -->
          <div v-if="isHotActive" class="flex-1 grid grid-rows-1 grid-cols-2 pl-4 pt-4 gap-4">
            <!-- 阅读榜 -->
            <RankCard title="阅读榜单" background-image="bg-card.png" background-image-dark="bg-card-dark.png" :rank="borrowRank"/>
            <!-- 收藏榜 -->
            <RankCard title="收藏榜单" background-image="bg-card-2.png" background-image-dark="bg-card-2-dark.png" :rank="favoriteRank"/>
          </div>
          <!-- 新书上架 -->
          <div v-if="isNewActive" class="flex-1 grid grid-rows-1 grid-cols-2 pl-4 pt-4 gap-4">
            <!-- 本月上新 -->
            <RankCard title="本月上新" background-image="bg-card.png" background-image-dark="bg-card-dark.png" :rank="newMonthlyRank"/>
            <!-- 近期入库 -->
            <RankCard title="近期入库" background-image="bg-card-2.png" background-image-dark="bg-card-2-dark.png" :rank="newStoreRank"/>
          </div>
          <!-- 分类页 - 空 -->
          <div v-if="activeCategory && activeCategory.books.total === 0" class="flex-1 flex flex-col items-center justify-center gap-4">
            <BookDashed class="size-10 text-(--muted-foreground)"/>
            <div class="text-sm text-(--muted-foreground)">没有找到符合条件的图书</div>
          </div>
          <!-- 分类页 - 排序 -->
          <div v-if="activeCategory && activeCategory.books.total > 0" class="flex items-center pl-4 py-2 gap-4">
            <button @click="() => goToPage(1, activeCategory?.sortMode === 'PUBLISH_DATE_FROM_NEW_TO_OLD' ? 'PUBLISH_DATE_FROM_OLD_TO_NEW' : 'PUBLISH_DATE_FROM_NEW_TO_OLD')" class="flex items-center gap-2 hover:-translate-y-0.5 transition-transform cursor-pointer" :class="{ 'text-(--primary)': activeCategory?.sortMode === 'PUBLISH_DATE_FROM_NEW_TO_OLD' || activeCategory?.sortMode === 'PUBLISH_DATE_FROM_OLD_TO_NEW' }">
              <span class="text-sm">出版时间</span>
              <ArrowDownNarrowWide v-if="activeCategory?.sortMode !== 'PUBLISH_DATE_FROM_OLD_TO_NEW'" class="size-4"/>
              <ArrowUpNarrowWide v-if="activeCategory?.sortMode === 'PUBLISH_DATE_FROM_OLD_TO_NEW'" class="size-4"/>
            </button>
            <div class="w-px h-4 block bg-(--primary)"></div>
            <button @click="() => goToPage(1, activeCategory?.sortMode === 'PRICE_FROM_LOW_TO_HIGH' ? 'PRICE_FROM_HIGH_TO_LOW' : 'PRICE_FROM_LOW_TO_HIGH')" class="flex items-center gap-2 hover:-translate-y-0.5 transition-transform cursor-pointer" :class="{ 'text-(--primary)': activeCategory?.sortMode === 'PRICE_FROM_HIGH_TO_LOW' || activeCategory?.sortMode === 'PRICE_FROM_LOW_TO_HIGH' }">
              <span class="text-sm">价格</span>
              <ArrowDownNarrowWide v-if="activeCategory?.sortMode !== 'PRICE_FROM_HIGH_TO_LOW'" class="size-4"/>
              <ArrowUpNarrowWide v-if="activeCategory?.sortMode === 'PRICE_FROM_HIGH_TO_LOW'" class="size-4"/>
            </button>
          </div>
          <!-- 分类页 - 图书展示 -->
          <div v-if="activeCategory && activeCategory.books.total > 0" class="flex-1 grid grid-rows-3 grid-cols-4 m-4 gap-2">
            <template v-for="book in activeCategory.books?.records" :key="book.id">
              <div class="flex flex-col items-center justify-start px-4 gap-1">
                <img :src="`/books/${book.id}`" class="size-24 object-cover" :alt="book.title"/>
                <div class="line-clamp-2 text-sm text-center">{{ book.title }}</div>
              </div>
            </template>
          </div>
          <!-- 分类页 - 分页组件 -->
          <div v-if="activeCategory && activeCategory.books.total > 0" class="flex items-center justify-center mb-2 gap-2">
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
    </div>
  </main>
</template>