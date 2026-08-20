<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Library, BookOpen, ArrowRightToLine, ArrowLeftToLine, Layers, BookX, Ban } from '@lucide/vue'
import * as echarts from 'echarts'

const trendChartRef = ref<HTMLElement | null>(null)
const categoryChartRef = ref<HTMLElement | null>(null)
const trendMode = ref<'borrow' | 'return' | 'new'>('borrow')

const overdueBooks = [
  { id: 1, title: '挪威的森林', borrower: '张明', dueDate: '2026-08-10', days: 7 },
  { id: 2, title: '百年孤独', borrower: '李丽', dueDate: '2026-08-12', days: 5 },
  { id: 3, title: '人类简史', borrower: '王强', dueDate: '2026-08-14', days: 3 },
  { id: 4, title: '三体', borrower: '赵雪', dueDate: '2026-08-15', days: 2 },
  { id: 5, title: '活着', borrower: '陈晨', dueDate: '2026-08-16', days: 1 },
  { id: 6, title: '瓦尔登湖', borrower: '刘静', dueDate: '2026-08-17', days: 0 },
]

const trendData = {
  borrow: [12, 18, 15, 22, 19, 14, 8],
  return: [8, 10, 12, 16, 14, 9, 6],
  new: [2, 3, 1, 4, 2, 0, 3],
}

function getTrendData() {
  return trendData[trendMode.value]
}

function getTrendName() {
  const map = { borrow: '借出', return: '归还', new: '新增' }
  return map[trendMode.value]
}

function initCharts() {
  // 趋势图
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      grid: { left: 30, right: 10, top: 10, bottom: 20 },
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
      series: [
        {
          type: 'line',
          smooth: true,
          data: getTrendData(),
          lineStyle: { color: '#d4a574', width: 2 },
          areaStyle: { color: 'rgba(212, 165, 116, 0.12)' },
          symbol: 'circle',
          symbolSize: 5,
          itemStyle: { color: '#d4a574' },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  // 分类饼图
  if (categoryChartRef.value) {
    const chart = echarts.init(categoryChartRef.value)
    chart.setOption({
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
          data: [
            { value: 256, name: '文学', itemStyle: { color: '#d4a574' } },
            { value: 180, name: '历史', itemStyle: { color: '#b8a08e' } },
            { value: 145, name: '计算机', itemStyle: { color: '#8fa8b8' } },
            { value: 120, name: '哲学', itemStyle: { color: '#a8b8a0' } },
            { value: 98, name: '其他', itemStyle: { color: '#c8b8a8' } },
          ],
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

onMounted(() => {
  initCharts()
})
</script>

<template>
  <main class="flex-1 mx-auto max-w-6xl w-full flex flex-col px-4 py-8 md:px-8">
    <!-- 第一行：页面标题 -->
    <div class="mb-8">
      <h1 class="font-serif text-3xl font-medium">数据概览</h1>
      <p class="mt-1 text-sm text-(--muted-foreground)">个人图书馆运营数据总览 · 更新于今日 14:30</p>
    </div>

    <!-- 第二行：统计卡片 -->
    <div class="grid grid-cols-2 gap-4 md:grid-cols-5">
      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-(--muted-foreground)">可流通馆藏</span>
          <Library class="size-4 text-(--primary)" />
        </div>
        <p class="mt-2 font-serif text-2xl font-medium">1,272</p>
        <p class="mt-1 text-xs text-(--muted-foreground)">较上月 +12</p>
      </div>

      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-(--muted-foreground)">图书种类</span>
          <Layers class="size-4 text-(--primary)" />
        </div>
        <p class="mt-2 font-serif text-2xl font-medium">684</p>
        <p class="mt-1 text-xs text-(--muted-foreground)">较上月 +8</p>
      </div>

      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-(--muted-foreground)">借阅中</span>
          <BookOpen class="size-4 text-(--primary)" />
        </div>
        <p class="mt-2 font-serif text-2xl font-medium">47</p>
        <p class="mt-1 text-xs text-(--muted-foreground)">占馆藏 3.7%</p>
      </div>

      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-(--muted-foreground)">今日借出</span>
          <ArrowRightToLine class="size-4 text-(--primary)" />
        </div>
        <p class="mt-2 font-serif text-2xl font-medium">23</p>
        <p class="mt-1 text-xs text-(--muted-foreground)">较昨日 +5</p>
      </div>

      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-(--muted-foreground)">今日归还</span>
          <ArrowLeftToLine class="size-4 text-(--primary)" />
        </div>
        <p class="mt-2 font-serif text-2xl font-medium">18</p>
        <p class="mt-1 text-xs text-(--muted-foreground)">较昨日 -2</p>
      </div>
    </div>

    <!-- 第三行：趋势图 + 分类饼图 -->
    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- 趋势图 -->
      <div class="md:col-span-2 rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <h3 class="font-serif text-base font-medium">近7日趋势</h3>
            <div class="flex gap-2 text-sm">
              <button @click="trendMode = 'borrow'" class="transition-colors" :class="trendMode === 'borrow' ? 'text-(--primary) font-medium' : 'text-(--muted-foreground) hover:text-(--foreground)'">
                借出
              </button>
              <button @click="trendMode = 'return'" class="transition-colors" :class="trendMode === 'return' ? 'text-(--primary) font-medium' : 'text-(--muted-foreground) hover:text-(--foreground)'">
                归还
              </button>
              <button @click="trendMode = 'new'" class="transition-colors" :class="trendMode === 'new' ? 'text-(--primary) font-medium' : 'text-(--muted-foreground) hover:text-(--foreground)'">
                新增
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
          <h3 class="font-serif text-base font-medium">分类分布</h3>
        </div>
        <div ref="categoryChartRef" class="h-48 w-full"></div>
      </div>
    </div>

    <!-- 第四行：逾期未还列表 + 已下架统计 -->
    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- 逾期未还列表 -->
      <div class="rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-serif text-base font-medium">逾期未还</h3>
          <span class="text-xs text-(--muted-foreground)">共 {{ overdueBooks.length }} 本</span>
        </div>
        <div class="max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-(--muted) scrollbar-track-transparent">
          <div v-for="book in overdueBooks" :key="book.id" class="flex items-center justify-between border-b border-(--border)/50 py-2.5 last:border-0">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">{{ book.title }}</p>
              <p class="text-xs text-(--muted-foreground)">{{ book.borrower }} · 应还 {{ book.dueDate }}</p>
            </div>
            <span class="ml-3 shrink-0 text-sm font-medium text-(--destructive)">+{{ book.days }}天</span>
          </div>
        </div>
      </div>

      <!-- 已下架统计 -->
      <div class="rounded-lg border border-(--border) bg-(--card) p-4 flex flex-col">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-serif text-base font-medium">已下架状态</h3>
          <span class="text-xs text-(--muted-foreground)">占馆藏 0.9%</span>
        </div>
        <div class="flex flex-col flex-1 justify-between gap-3">
          <!-- 总量 -->
          <div class="flex items-center justify-between rounded-md bg-(--muted)/30 px-4 py-2.5">
            <span class="text-sm text-(--muted-foreground)">已下架总量</span>
            <span class="font-serif text-xl font-medium">12 本</span>
          </div>
          <!-- 三个原因 - 横向布局，四要素完整 -->
          <div class="grid grid-cols-3 flex-1 gap-3">
            <div class="flex items-center gap-3 rounded-md bg-(--muted)/20 px-3 py-2">
              <BookX class="size-5 shrink-0 text-(--chart-3)" />
              <div>
                <p class="text-base font-medium text-(--chart-3)">5</p>
                <p class="text-xs text-(--muted-foreground)">丢失</p>
                <p class="text-[10px] text-(--muted-foreground)/60">借阅中遗失</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-md bg-(--muted)/20 px-3 py-2">
              <BookOpen class="size-5 shrink-0 text-(--chart-4)" />
              <div>
                <p class="text-base font-medium text-(--chart-4)">4</p>
                <p class="text-xs text-(--muted-foreground)">损坏</p>
                <p class="text-[10px] text-(--muted-foreground)/60">污损或破损</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-md bg-(--muted)/20 px-3 py-2">
              <Ban class="size-5 shrink-0 text-(--chart-5)" />
              <div>
                <p class="text-base font-medium text-(--chart-5)">3</p>
                <p class="text-xs text-(--muted-foreground)">其他</p>
                <p class="text-[10px] text-(--muted-foreground)/60">维护或剔旧</p>
              </div>
            </div>
          </div>
          <!-- 分布条 -->
          <div class="flex items-center gap-2 rounded-md bg-(--muted)/20 px-3 py-1.5">
            <span class="text-xs text-(--muted-foreground)">分布</span>
            <div class="flex-1 h-1.5 rounded-full overflow-hidden flex">
              <div class="h-full bg-(--chart-3)" style="width: 41.7%"></div>
              <div class="h-full bg-(--chart-4)/75" style="width: 33.3%"></div>
              <div class="h-full bg-(--chart-5)/50" style="width: 25%"></div>
            </div>
            <span class="text-[10px] text-(--muted-foreground)">5:4:3</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>