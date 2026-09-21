<script setup lang="ts">
import { BookDashed, Loader, Undo2 } from "@lucide/vue";
import { ref, toRef, watch } from "vue";
import api, { simpleResponseHandler } from "@/api";
import { DateTime } from "luxon";
import type { BorrowRecord, FullBookCopy } from "@/types";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.ts";
import { usePopupStore } from "@/stores/popup.ts";
import { useBookStore } from "@/stores/book.ts";
import { useConfirm } from "@/composables/useConfirm.ts";

const props = defineProps({ id: { type: String, required: true } });
const id = toRef(props, "id");

const router = useRouter();
const bookStore = useBookStore();
const userStore = useUserStore();
const popupStore = usePopupStore();

const isLoading = ref(false);
const isError = ref(false);
const bookCopy = ref<FullBookCopy>({ id: 0, book_id: 0, purchase_price: 0, purchase_date: "", source: "", status: "AVAILABLE", entry_by: 0, withdrawn_reason: null, create_time: "", withdrawn_time: null });
const borrowRecords = ref<BorrowRecord[]>([]);

async function rollbackReturn(id: number) {
  // 确认弹窗
  if (!await useConfirm().confirm({ message: '确认撤销 #' + id + ' 的借阅记录归还操作？' }))
    return;
  // 提交请求
  const data = await api.post(`/api/borrow-records/${id}/rollback-return`);
  // 处理数据
  await simpleResponseHandler(data, init);
}

async function init() {
  // 初始化
  isLoading.value = true;
  isError.value = false;
  // 获取馆藏信息
  bookCopy.value = (await api.get<FullBookCopy>(`/api/book-copies/${id.value}`)).data ?? undefined;
  // 获取借阅记录
  borrowRecords.value = (await api.get<BorrowRecord[]>(`/api/book-copies/${id.value}/borrow-records`)).data ?? undefined;
  // 检查
  if (!bookCopy.value || !borrowRecords.value)
    isError.value = true;
  // 预加载图书数据
  await bookStore.preload(bookCopy.value.book_id);
  // 预加载用户数据
  await userStore.preload(bookCopy.value.entry_by, ...borrowRecords.value.map(item => item.user_id));
  // 加载完成
  isLoading.value = false
}

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

watch(id, async () => init(), { immediate: true })
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

    <div v-if="!isLoading && !isError" class="flex-1 flex flex-col">
      <!-- 头部 -->
      <div class="mx-auto max-w-6xl w-full flex flex-col md:flex-row p-4 md:p-8 gap-4 md:gap-8">
        <!-- 封面 -->
        <div class="my-auto max-w-64 flex justify-center">
          <img :src="`/books/${bookCopy.book_id}`" class="object-cover aspect-3/4 rounded-lg shadow-md" alt="cover"/>
        </div>
        <!-- 信息 -->
        <div class="w-full flex flex-col py-2">
          <!-- 标题 -->
          <div class="flex flex-col">
            <div>
              <span v-if="bookCopy.status === 'UNAVAILABLE'" class="rounded-full bg-(--accent)/10 px-2 py-0.5 text-xs text-(--accent-foreground)">已借出</span>
              <span v-if="bookCopy.status === 'AVAILABLE'" class="rounded-full bg-(--accent) px-2 py-0.5 text-xs text-(--accent-foreground)">可借阅</span>
              <span v-if="bookCopy.status === 'WITHDRAWN'" class="rounded-full bg-(--accent)/10 px-2 py-0.5 text-xs text-(--accent-foreground)">已下架</span>
            </div>
            <p class="mt-2 font-serif text-3xl leading-tight md:text-4xl "># {{ bookCopy.id }}</p>
            <RouterLink :to="{ name: 'book', params: { id: bookCopy.book_id } }" class="mt-1 text-pretty text-lg text-(--muted-foreground) hover:text-(--primary) hover:underline">{{ bookStore.book(bookCopy.book_id).value?.title }}</RouterLink>
            <p class="mt-2 text-sm text-(--foreground)">{{ bookStore.book(bookCopy.book_id).value?.author }}</p>
          </div>
          <!-- 信息列表 -->
          <div class="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 text-sm">
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
              <a href="/" @click.prevent="popupStore.open('userInfo', { x: $event.clientX, y: $event.clientY, id: bookCopy.entry_by })" class="text-(--primary) underline-offset-2 hover:underline">
                {{ userStore.user(bookCopy.entry_by).value?.username }}
              </a>
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
          <p class="mt-5 text-pretty leading-relaxed text-(--muted-foreground)">{{ bookStore.book(bookCopy.book_id).value?.description }}</p>
        </div>
      </div>

      <div class="border-t border-(--border) bg-(--muted)/30">
        <div class="mx-auto max-w-6xl w-full flex-1 flex flex-col p-4 md:p-8 gap-4">
          <!-- 标题 -->
          <div class="flex items-center justify-between">
            <div class="font-serif text-2xl font-semibold">全部借阅记录</div>
            <button v-if="borrowRecords[0] && borrowRecords[0].status !== 'BORROWING'" @click="rollbackReturn(borrowRecords[0].id)" class="flex items-center px-2 py-1 gap-2 bg-(--background) hover:bg-(--muted) border border-(--border) rounded text-sm">
              <Undo2 class="size-3"/>
              撤销 #{{ borrowRecords[0].id }} 借阅记录的归还操作
            </button>
          </div>
          <!-- 记录列表 -->
          <div v-if="borrowRecords.length > 0" class="flex flex-col gap-4">
            <div v-for="item in borrowRecords" :key="item.id" class="rounded-lg border border-(--border) bg-(--card) p-4">
              <div class="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
                <div><span class="text-(--muted-foreground)">记录编号：</span>{{ item.id }}</div>
                <div><span class="text-(--muted-foreground)">借阅人：</span>
                  <a href="/" @click.prevent="popupStore.open('userInfo', { x: $event.clientX, y: $event.clientY, id: item.user_id })" class="text-(--primary) underline-offset-2 hover:underline">
                    {{ userStore.user(item.user_id).value?.username }}
                  </a>
                </div>
                <div>
                  <span class="text-(--muted-foreground)">状态：</span>
                  <span v-if="item.status === 'BORROWING'" class="text-(--primary)">尚未归还</span>
                  <span v-if="item.status === 'RETURNED'">正常归还</span>
                  <span v-if="item.status === 'LOST'" class="text-(--primary)">借阅丢失</span>
                  <span v-if="item.status === 'DAMAGED'" class="text-(--primary)">借阅损坏</span>
                </div>
                <div><span class="text-(--muted-foreground)">创建时间：</span>{{ DateTime.fromISO(item.create_time).toFormat("yyyy-MM-dd HH:mm:ss") }}</div>
                <div><span class="text-(--muted-foreground)">应还时间：</span>{{ DateTime.fromISO(item.due_time).toFormat("yyyy-MM-dd HH:mm:ss") }}</div>
                <div><span class="text-(--muted-foreground)">关闭时间：</span>{{
                    item.end_time ? DateTime.fromISO(item.end_time).toFormat("yyyy-MM-dd HH:mm:ss") : '-'
                  }}</div>
                <div><span class="text-(--muted-foreground)">是否续借：</span>{{ item.is_renewed ? '是' : '否' }}</div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="flex flex-col items-center justify-center rounded-lg border border-(--border) bg-(--card) py-12">
            <p class="text-(--muted-foreground)">暂无借阅记录</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>