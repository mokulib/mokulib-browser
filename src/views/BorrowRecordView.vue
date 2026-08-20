<script setup lang="ts">
import { BookDashed, Loader } from "@lucide/vue";
import { ref, toRef, watch } from "vue";
import api from "@/api";
import { DateTime } from "luxon";
import type { BorrowRecord, FullBookCopy } from "@/types";

const props = defineProps({ id: { type: String, required: true } });
const id = toRef(props, "id");

const requestTimestamp = ref(DateTime.now());
const isLoading = ref(false);
const isError = ref(false);
const bookCopy = ref<FullBookCopy>({ id: 0, book_id: 0, purchase_price: 0, purchase_date: "", source: "", status: "AVAILABLE", entry_by: 0, withdrawn_reason: null, create_time: "", withdrawn_time: null });
const borrowRecords = ref<BorrowRecord[]>([]);

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

watch(id, async () => {
  // 初始化
  requestTimestamp.value = DateTime.now();
  isLoading.value = true;
  isError.value = false;
  // 获取馆藏信息
  bookCopy.value = (await api.get<FullBookCopy>(`/api/book-copies/${id.value}`)).data ?? undefined;
  // 获取借阅记录
  borrowRecords.value = (await api.get<BorrowRecord[]>(`/api/book-copies/${id.value}/borrow-records`)).data ?? undefined;
  // 检查
  if (!bookCopy.value || !borrowRecords.value)
    isError.value = true;
  // 延迟加载完成
  setTimeout(() => isLoading.value = false, Math.max(0, 1000 - DateTime.now().diff(requestTimestamp.value).milliseconds));
}, { immediate: true })
</script>

<template>
  <main class="flex-1 flex">
    <div v-if="isLoading" class="flex-1 flex items-center justify-center gap-2">
      <Loader class="size-5 text-(--muted-foreground) opacity-0 animate-spin" :class="{ 'opacity-100': isLoading }" style="transition-duration: 500ms; animation-duration: 3000ms"/>
      <p class="text-(--muted-foreground) tracking-wide">加载中 . . .</p>
    </div>

    <div v-if="!isLoading && isError" class="flex-1 flex flex-col items-center justify-center gap-2">
      <BookDashed class="size-10 text-(--muted-foreground)"/>
      <p class="text-(--secondary-foreground)">馆藏编号不存在</p>
    </div>

    <div v-if="!isLoading && !isError" class="mx-auto max-w-6xl flex-1 flex flex-col p-4 md:p-8 gap-8">
      <!-- 头部 -->
      <div class="flex px-0 md:px-8 gap-4 md:gap-8">
        <div class="my-auto flex justify-center">
          <img :src="`/books/${bookCopy.book_id}`" class="w-32 md:w-48 object-cover aspect-4/5 rounded-lg" alt="cover"/>
        </div>
        <div class="flex flex-col justify-between gap-2 py-2 text-sm">
          <div class="flex items-center gap-2">
            <span v-if="bookCopy.status === 'UNAVAILABLE'" class="rounded-full bg-(--primary)/10 px-3 py-1 text-xs text-(--primary)">已借出</span>
            <span v-if="bookCopy.status === 'AVAILABLE'" class="rounded-full bg-(--primary)/10 px-3 py-1 text-xs text-(--primary)">可借阅</span>
            <span v-if="bookCopy.status === 'WITHDRAWN'" class="rounded-full bg-(--primary)/10 px-3 py-1 text-xs text-(--primary)">已下架</span>
            <span class="text-(--muted-foreground)">#{{ bookCopy.id }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex">
              <span class="w-20 md:w-24 text-(--muted-foreground)">购入价格</span>
              <p>¥{{ bookCopy.purchase_price }}</p>
            </div>
            <div class="flex">
              <span class="w-20 md:w-24 text-(--muted-foreground)">购入日期</span>
              <p>{{ bookCopy.purchase_date }}</p>
            </div>
            <div class="flex">
              <span class="w-20 md:w-24 text-(--muted-foreground)">来源</span>
              <p>{{ bookCopy.source }}</p>
            </div>
            <div class="flex">
              <span class="w-20 md:w-24 text-(--muted-foreground)">入库人</span>
              <p>#{{ bookCopy.entry_by }}</p>
            </div>
            <div class="flex">
              <span class="w-20 md:w-24 text-(--muted-foreground)">入库时间</span>
              <p>{{ DateTime.fromISO(bookCopy.create_time).toFormat("yyyy-MM-dd HH:mm:ss") }}</p>
            </div>
            <div class="flex">
              <span class="w-20 md:w-24 text-(--muted-foreground)">下架原因</span>
              <p :class="{ 'text-(--muted-foreground)': !bookCopy.withdrawn_reason }">{{ bookCopy.withdrawn_reason ?? '未下架' }}</p>
            </div>
            <div class="flex">
              <span class="w-20 md:w-24 text-(--muted-foreground)">下架时间</span>
              <p :class="{ 'text-(--muted-foreground)': !bookCopy.withdrawn_time }">{{ bookCopy.withdrawn_time ?? '未下架' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 记录列表 -->
      <div v-if="borrowRecords.length > 0" class="flex flex-col gap-4">
        <div v-for="item in borrowRecords" :key="item.id" class="rounded-lg border border-(--border) bg-(--card) p-4">
          <div class="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
            <div><span class="text-(--muted-foreground)">记录编号：</span>{{ item.id }}</div>
            <div><span class="text-(--muted-foreground)">用户编号：</span>{{ item.user_id }}</div>
            <div>
              <span class="text-(--muted-foreground)">状态：</span>
              <span v-if="item.close_status === 'OPEN'" class="text-(--primary)">尚未归还</span>
              <span v-if="item.close_status === 'CLOSED'">正常归还</span>
              <span v-if="item.close_status === 'LOST'" class="text-(--primary)">借阅丢失</span>
              <span v-if="item.close_status === 'DAMAGED'" class="text-(--primary)">借阅损坏</span>
            </div>
            <div><span class="text-(--muted-foreground)">创建时间：</span>{{ DateTime.fromISO(item.create_time).toFormat("yyyy-MM-dd HH:mm:ss") }}</div>
            <div><span class="text-(--muted-foreground)">应还时间：</span>{{ DateTime.fromISO(item.due_time).toFormat("yyyy-MM-dd HH:mm:ss") }}</div>
            <div><span class="text-(--muted-foreground)">关闭时间：</span>{{ item.close_time ? DateTime.fromISO(item.close_time).toFormat("yyyy-MM-dd HH:mm:ss") : '-' }}</div>
            <div><span class="text-(--muted-foreground)">是否续借：</span>{{ item.is_renewed ? '是' : '否' }}</div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center rounded-lg border border-(--border) bg-(--card) py-12">
        <p class="text-(--muted-foreground)">暂无借阅记录</p>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>