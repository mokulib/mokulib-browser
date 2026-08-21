<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Library, BookOpen, ArrowRightToLine, ArrowLeftToLine, Layers, BookX, Ban } from '@lucide/vue'
import * as echarts from 'echarts'
import api from "@/api";
import type { Dashboard, OverdueRecord } from "@/types";
import { DateTime } from "luxon";
import { useBookStore } from "@/stores/book.ts";

const bookStore = useBookStore();

const availableCopies = ref(0);           // 可流通馆藏
const bookTypes = ref(0);                 // 图书种类
const borrowing = ref(0);                 // 借阅中
const todayBorrowed = ref(0);             // 今日借出
const todayReturned = ref(0);             // 今日归还
const availableCopiesChange = ref(0);     // 可流通馆藏较上月变化
const bookTypesChange = ref(0);           // 图书种类较上月变化
const borrowingPercentage = ref(0);       // 借阅中占馆藏比例
const todayBorrowedChange = ref(0);       // 今日借出较昨日变化
const todayReturnedChange = ref(0);       // 今日归还较昨日变化
const borrowTrend = ref<number[]>([]);    // 借出趋势
const returnTrend = ref<number[]>([]);    // 归还趋势
const newCopyTrend = ref<number[]>([]);   // 新增馆藏趋势
const newTypeTrend = ref<number[]>([]);   // 新增图书趋势
const categoryStats = ref<{ name: string; value: number }[]>([]);
const overdueBooks = ref<OverdueRecord[]>([]);
const withdrawnCount = ref(0);            // 已下架总量
const lostWithdrawnCount = ref(0);        // 丢失数量
const damagedWithdrawnCount = ref(0);     // 损坏数量
const otherWithdrawnCount = ref(0);       // 其他下架数量

/////////////////////////////////////////////
// 图表初始化 & 切换数据
/////////////////////////////////////////////

const trendChartRef = ref<HTMLElement | null>(null)
const categoryChartRef = ref<HTMLElement | null>(null)
const trendMode = ref<'borrowReturn' | 'new'>('borrowReturn')
let trendChart: echarts.ECharts | null = null

function initTrendChart() {
  if (!trendChartRef.value) return
  trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption({
    grid: { left: 30, right: 10, top: 20, bottom: 20 },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#9ca3af' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
      axisLabel: { fontSize: 11, color: '#9ca3af' },
    },
    legend: {
      data: ['借出', '归还'],
      right: 0,
      top: 0,
      icon: 'circle',
      itemWidth: 6,
      itemHeight: 6,
      textStyle: { fontSize: 11, color: '#9ca3af' },
    },
    series: [
      {
        name: '借出',
        type: 'line',
        smooth: true,
        data: borrowTrend.value,
        lineStyle: { color: '#d4a574', width: 2 },
        areaStyle: { color: 'rgba(212, 165, 116, 0.10)' },
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: { color: '#d4a574' },
      },
      {
        name: '归还',
        type: 'line',
        smooth: true,
        data: returnTrend.value,
        lineStyle: { color: '#b8a08e', width: 2 },
        areaStyle: { color: 'rgba(184, 160, 142, 0.10)' },
        symbol: 'diamond',
        symbolSize: 5,
        itemStyle: { color: '#b8a08e' },
      },
    ],
  })
  window.addEventListener('resize', () => trendChart?.resize())
}

function initCategoryChart() {
  if (!categoryChartRef.value) return
  const chart = echarts.init(categoryChartRef.value)
  chart.setOption({
    color: categoryStats.value.length % 5 === 0 ? ['#d4a574', '#8fa8b8', '#cdb5a2', '#a8b8a0', '#a8d5ba'] : ['#d4a574', '#8fa8b8', '#cdb5a2', '#a8b8a0'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { fontSize: 12 },
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'transparent',
        },
        label: {
          show: true,
          fontSize: 11,
          color: '#9ca3af',
          formatter: '{b}',
        },
        labelLine: {
          length: 8,
          length2: 6,
        },
        data: categoryStats.value,
      },
    ],
  })
  window.addEventListener('resize', () => chart.resize())
}

function updateTrendChart() {
  if (!trendChart) return
  const isBorrowReturn = trendMode.value === 'borrowReturn'
  trendChart.setOption({
    series: [
      {
        name: isBorrowReturn ? '借出' : '新增馆藏',
        data: isBorrowReturn ? borrowTrend.value : newCopyTrend.value,
        lineStyle: { color: isBorrowReturn ? '#d4a574' : '#8fa8b8' },
        areaStyle: { color: isBorrowReturn ? 'rgba(212, 165, 116, 0.10)' : 'rgba(143, 168, 184, 0.10)' },
        itemStyle: { color: isBorrowReturn ? '#d4a574' : '#8fa8b8' },
      },
      {
        name: isBorrowReturn ? '归还' : '新增图书',
        data: isBorrowReturn ? returnTrend.value : newTypeTrend.value,
        lineStyle: { color: isBorrowReturn ? '#b8a08e' : '#a8b8a0' },
        areaStyle: { color: isBorrowReturn ? 'rgba(184, 160, 142, 0.10)' : 'rgba(168, 184, 160, 0.10)' },
        itemStyle: { color: isBorrowReturn ? '#b8a08e' : '#a8b8a0' },
      },
    ],
    legend: {
      data: isBorrowReturn ? ['借出', '归还'] : ['新增馆藏', '新增图书'],
    },
  })
}

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

onMounted(async () => {
  const data = (await api.get<Dashboard>('/api/dashboard')).data;

  availableCopies.value = data.available_copies;
  bookTypes.value = data.book_types;
  borrowing.value = data.borrowing;
  todayBorrowed.value = data.today_borrowed;
  todayReturned.value = data.today_returned;
  availableCopiesChange.value = data.available_copies_change;
  bookTypesChange.value = data.book_types_change;
  borrowingPercentage.value = data.borrowing_percentage;
  todayBorrowedChange.value = data.today_borrowed_change;
  todayReturnedChange.value = data.today_returned_change;
  borrowTrend.value = data.borrow_trend;
  returnTrend.value = data.return_trend;
  newCopyTrend.value = data.new_book_copy_trend;
  newTypeTrend.value = data.new_book_trend;
  categoryStats.value = data.category_stats.map(stats => ({ name: stats.name, value: stats.count }));
  overdueBooks.value = data.overdue_records;
  withdrawnCount.value = data.withdrawn_count;
  lostWithdrawnCount.value = data.lost_withdrawn_count;
  damagedWithdrawnCount.value = data.damaged_withdrawn_count;
  otherWithdrawnCount.value = data.other_withdrawn_count;

  initTrendChart()
  initCategoryChart()

  // 预加载图书数据
  await bookStore.preload(...overdueBooks.value.map(record => record.book_id));
})
</script>

<template>
  <main class="flex-1 mx-auto max-w-6xl w-full flex flex-col px-4 py-8 md:px-8">
    <!-- 第一行：页面标题 -->
    <div class="mb-8">
      <h1 class="font-serif text-3xl">数据概览</h1>
      <p class="mt-1 text-sm text-(--muted-foreground)">个人图书馆运营数据总览 · 更新于今日 14:30</p>
    </div>

    <!-- 第二行：统计卡片 -->
    <div class="grid grid-cols-2 gap-4 md:grid-cols-5">
      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-(--muted-foreground)">可流通馆藏</span>
          <Library class="size-4 text-(--primary)" />
        </div>
        <p class="mt-2 font-serif text-2xl">{{ availableCopies.toLocaleString() }}</p>
        <p class="mt-1 text-xs text-(--muted-foreground)">较上月 {{ availableCopiesChange > 0 ? `+${availableCopiesChange.toLocaleString()}` : availableCopiesChange.toLocaleString() }}</p>
      </div>

      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-(--muted-foreground)">图书种类</span>
          <Layers class="size-4 text-(--primary)" />
        </div>
        <p class="mt-2 font-serif text-2xl">{{ bookTypes.toLocaleString() }}</p>
        <p class="mt-1 text-xs text-(--muted-foreground)">较上月 {{ bookTypesChange > 0 ? `+${bookTypesChange.toLocaleString()}` : bookTypesChange.toLocaleString() }}</p>
      </div>

      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-(--muted-foreground)">借阅中</span>
          <BookOpen class="size-4 text-(--primary)" />
        </div>
        <p class="mt-2 font-serif text-2xl">{{ borrowing.toLocaleString() }}</p>
        <p class="mt-1 text-xs text-(--muted-foreground)">占馆藏 {{ borrowingPercentage }}%</p>
      </div>

      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-(--muted-foreground)">今日借出</span>
          <ArrowRightToLine class="size-4 text-(--primary)" />
        </div>
        <p class="mt-2 font-serif text-2xl">{{ todayBorrowed.toLocaleString() }}</p>
        <p class="mt-1 text-xs text-(--muted-foreground)">较昨日 {{ todayBorrowedChange > 0 ? `+${todayBorrowedChange.toLocaleString()}` : todayBorrowedChange.toLocaleString() }}</p>
      </div>

      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-(--muted-foreground)">今日归还</span>
          <ArrowLeftToLine class="size-4 text-(--primary)" />
        </div>
        <p class="mt-2 font-serif text-2xl">{{ todayReturned.toLocaleString() }}</p>
        <p class="mt-1 text-xs text-(--muted-foreground)">较昨日 {{ todayReturnedChange > 0 ? `+${todayReturnedChange.toLocaleString()}` : todayReturnedChange.toLocaleString() }}</p>
      </div>
    </div>

    <!-- 第三行：趋势图（左）+ 分类饼图（右） -->
    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- 趋势图 -->
      <div class="md:col-span-2 rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <h3 class="font-serif text-base">近7日趋势</h3>
            <div class="flex gap-2 text-sm">
              <button
                @click="trendMode = 'borrowReturn'; updateTrendChart()"
                class="transition-colors"
                :class="trendMode === 'borrowReturn' ? 'text-(--primary)' : 'text-(--muted-foreground) hover:text-(--foreground)'"
              >
                借出归还
              </button>
              <button
                @click="trendMode = 'new'; updateTrendChart()"
                class="transition-colors"
                :class="trendMode === 'new' ? 'text-(--primary)' : 'text-(--muted-foreground) hover:text-(--foreground)'"
              >
                新增好书
              </button>
            </div>
          </div>
          <span class="text-xs text-(--muted-foreground)">单位：次</span>
        </div>
        <div ref="trendChartRef" class="h-48 w-full"></div>
      </div>

      <!-- 分类饼图 -->
      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="mb-4">
          <h3 class="font-serif text-base">分类分布</h3>
        </div>
        <div ref="categoryChartRef" class="h-48 w-full"></div>
      </div>
    </div>

    <!-- 第四行：逾期未还列表 + 已下架统计 -->
    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-serif text-base">逾期未还</h3>
          <span class="text-xs text-(--muted-foreground)">共 {{ overdueBooks.length }} 本</span>
        </div>
        <div class="max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-(--muted) scrollbar-track-transparent">
          <div v-for="book in overdueBooks" :key="book.book_copy_id" class="flex items-center justify-between border-b border-(--border)/50 py-2.5 last:border-0">
            <div class="min-w-0 flex-1">
              <p class="line-clamp-1 text-sm">
                <span class="text-(--primary)">#{{ book.book_copy_id }}</span>
                <span class="ml-2">{{ book.user_id }}</span>
              </p>
              <p class="line-clamp-1 text-xs text-(--muted-foreground)">应还 {{ DateTime.fromISO(book.due_time).toFormat("yyyy-MM-dd") }} · {{ bookStore.book(book.book_id).value?.title }}</p>
            </div>
              <span class="ml-3 shrink-0 text-sm text-(--destructive)">+{{ Math.ceil(DateTime.now().diff(DateTime.fromISO(book.due_time), 'days').days) }}天</span>
          </div>
        </div>
      </div>

      <!-- 已下架统计 -->
      <div class="rounded-lg border border-(--border) bg-(--card) p-4 flex flex-col">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-serif text-base">已下架状态</h3>
          <span class="text-xs text-(--muted-foreground)">单位：本</span>
        </div>
        <div class="flex flex-col flex-1 justify-between gap-3">
          <div class="flex items-center justify-between rounded-md bg-(--muted)/30 px-4 py-2.5">
            <span class="text-sm text-(--muted-foreground)">已下架总量</span>
            <span class="font-serif text-xl">{{ withdrawnCount }}</span>
          </div>
          <div class="grid grid-cols-3 flex-1 gap-3">
            <div class="flex items-center gap-3 rounded-md bg-(--muted)/20 px-3 py-2">
              <BookX class="size-5 shrink-0 text-(--chart-3)" />
              <div>
                <p class="text-base text-(--chart-3)">{{ lostWithdrawnCount }}</p>
                <p class="text-xs text-(--muted-foreground)">丢失</p>
                <p class="text-[10px] text-(--muted-foreground)/60">借阅中遗失</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-md bg-(--muted)/20 px-3 py-2">
              <BookOpen class="size-5 shrink-0 text-(--chart-4)" />
              <div>
                <p class="text-base text-(--chart-4)">{{ damagedWithdrawnCount }}</p>
                <p class="text-xs text-(--muted-foreground)">损坏</p>
                <p class="text-[10px] text-(--muted-foreground)/60">污损或破损</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-md bg-(--muted)/20 px-3 py-2">
              <Ban class="size-5 shrink-0 text-(--chart-5)" />
              <div>
                <p class="text-base text-(--chart-5)">{{ otherWithdrawnCount }}</p>
                <p class="text-xs text-(--muted-foreground)">其他</p>
                <p class="text-[10px] text-(--muted-foreground)/60">维护或剔旧</p>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 rounded-md bg-(--muted)/20 px-3 py-1.5">
            <span class="text-xs text-(--muted-foreground)">分布</span>
            <div class="flex-1 h-1.5 rounded-full overflow-hidden flex">
              <div class="h-full bg-(--chart-3)" :style="{ width: (lostWithdrawnCount / withdrawnCount) * 100 + '%' }"></div>
              <div class="h-full bg-(--chart-4)/75" :style="{ width: (damagedWithdrawnCount / withdrawnCount) * 100 + '%' }"></div>
              <div class="h-full bg-(--chart-5)/50" :style="{ width: (otherWithdrawnCount / withdrawnCount) * 100 + '%' }"></div>
            </div>
            <span class="text-[10px] text-(--muted-foreground)">{{ lostWithdrawnCount }}:{{ damagedWithdrawnCount }}:{{ otherWithdrawnCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>