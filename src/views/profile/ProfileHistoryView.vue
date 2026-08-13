<script setup lang="ts">
import { BookOpen, ChevronLeft } from "@lucide/vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import api from "@/api";
import type { Book } from "@/types";
import { DateTime } from "luxon";

interface History {
  id: number;
  book_copy_id: number;
  book_id: number;
  borrow_time: string;
  return_time: string;
  close_status: 'CLOSED' | 'LOST' | 'DAMAGED';
  is_renewed: string;
  due_time: string;
}

interface ExtendedHistory extends History {
  book: Book;
  is_overdue: boolean;
}

const router = useRouter();

const history = ref<ExtendedHistory[]>([]);
const books = ref<Book[]>([]);

function formatTime(time: string) {
  return DateTime.fromISO(time).toFormat("yyyy-MM-dd")
}

onMounted(async () => {
  // 查询历史记录
  const history_ = (await api.get<History[]>('/api/users/history')).data;
  // 收集待查询的图书 id （去掉已查过的图书）
  const bookIds = history_.map(record => record.book_id as number).filter(bookId => !books.value.some(book => bookId === book.id));
  // 构造批量查询
  const bookPromises = bookIds.map(bookId => api.get<Book>(`/api/books/${bookId}`));
  // 并发请求数据
  const data = await Promise.all(bookPromises);
  // 获取结果
  const books_ = data.map(d => d.data);
  // 追加保存
  books.value.push(...books_);
  // 构造历史记录
  history.value = history_.map(record => ({
    ...record,
    book: books.value.find(book => book.id === record.book_id)!,
    is_overdue: DateTime.fromISO(record.return_time).diff(DateTime.fromISO(record.due_time)).milliseconds > 0
  }));
})
</script>

<template>
  <div class="flex flex-col sm:gap-8">
    <!-- 标题 -->
    <div class="flex items-center px-4 sm:px-0 pt-4 sm:pt-0 sm:pb-4 gap-4 sm:border-b sm:border-(--border)">
      <ChevronLeft @click="router.back()" class="block sm:hidden ml-2 size-5 cursor-pointer"/>
      <div class="block sm:hidden tracking-wide text-lg font-bold">借阅历史</div>
      <div class="hidden sm:block tracking-wide text-lg font-bold">借阅过的好书</div>
    </div>

    <!-- 无历史信息 -->
    <div v-if="history.length === 0" class="flex flex-col items-center py-20 sm:py-4 gap-2">
      <BookOpen class="size-8 text-(--muted-foreground)/50"/>
      <p class="text-sm text-(--muted-foreground)">还没有借阅记录</p>
    </div>

    <!-- 卡片展示 -->
    <div v-if="history.length > 0" class="flex flex-col p-4 sm:p-0 gap-4">
      <template v-for="record in history">
        <!-- 卡片 -->
        <div class="flex flex-col gap-4">
          <!-- 标题 -->
          <div class="flex items-center justify-between px-4 py-1.5 rounded-lg text-sm bg-(--muted)">
            <!-- 左侧：借阅日 + 借阅单号 -->
            <div class="flex items-center gap-4">
              <p>{{ formatTime(record.borrow_time) }}</p>
              <p>借阅单号: {{ record.id }}</p>
            </div>
            <!-- 右侧：归还状态 -->
            <div class="flex items-center gap-2">
              <p v-if="record.is_overdue">逾期</p>
              <p v-if="record.close_status === 'CLOSED'">正常归还</p>
              <p v-if="record.close_status === 'LOST'">借阅丢失</p>
              <p v-if="record.close_status === 'DAMAGED'">借阅损坏</p>
            </div>
          </div>

          <!-- 数据 -->
          <div class="flex justify-between gap-4 pr-4">
            <!-- 图书信息 -->
            <div class="flex gap-4">
              <img :src="`/books/${record.book_id}`" alt="图书封面" class="size-24 rounded-lg"/>
              <div class="flex flex-col gap-1.5">
                <RouterLink :to="{ name: 'book', params: { id: record.book_id } }" class="line-clamp-1 text-sm hover:text-(--primary) hover:underline">{{ record.book.title }}</RouterLink>
                <p class="line-clamp-1 text-xs text-(--muted-foreground)">{{ record.book.author }} / {{ record.book.publish_date }} / {{ record.book.publisher }} / {{ record.book.price.toFixed(2) }}￥</p>
              </div>
            </div>
            <!-- 归还信息 -->
            <div class="flex flex-col items-center gap-1 shrink-0">
              <div class="flex items-center gap-2">
                <p class="text-xs">归还</p>
                <p class="text-sm font-semibold">{{ formatTime(record.return_time) }}</p>
              </div>
              <div class="flex items-center gap-2 text-xs text-(--muted-foreground)">
                <p>应还:</p>
                <p>{{ formatTime(record.due_time) }}</p>
              </div>
              <p class="text-xs text-(--muted-foreground)">{{ record.is_renewed ? '已续借' : '未续借' }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>