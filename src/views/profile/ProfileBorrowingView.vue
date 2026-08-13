<script setup lang="ts">
import { onMounted, ref } from "vue";
import api from "@/api";
import { BookOpen, CalendarClock } from "@lucide/vue";
import { useRouter } from "vue-router";
import { DateTime } from "luxon";

const router = useRouter();

const borrowing = ref<any[]>([])

onMounted(async () => {
  const borrowing_ = (await api.get<{ books: any[], borrow_records: any[] }>('/api/users/borrowing')).data;
  borrowing.value = borrowing_.borrow_records.length > 0 ? borrowing_.borrow_records.map(record => ({
    ...record,
    book: borrowing_.books.find(book => book.id === record.book_id),
    isOverdue: DateTime.fromISO(record.due_time) < DateTime.now(),
    percent: (1 - DateTime.fromISO(record.due_time).diffNow('days').days / DateTime.fromISO(record.due_time).diff(DateTime.fromISO(record.create_time), 'days').days) * 100,
  })) : []
})
</script>

<template>
  <div class="flex flex-col sm:gap-8">
    <!-- 标题 -->
    <div class="px-4 sm:px-0 pt-4 sm:pt-0 sm:pb-4 sm:border-b sm:border-(--border) tracking-wide text-lg font-bold">我的借阅</div>

    <!-- 无收藏信息 -->
    <div v-if="borrowing.length === 0" class="flex flex-col items-center py-20 sm:py-4 gap-2">
      <BookOpen class="size-8 text-(--muted-foreground)/50"/>
      <p class="text-sm text-(--muted-foreground)">当前没有借阅</p>
    </div>

    <!-- 卡片展示 -->
    <div v-if="borrowing.length > 0" class="flex flex-col p-4 sm:p-0 gap-4">
      <template v-for="record in borrowing">
        <!-- 卡片 -->
        <div class="flex flex-col p-4 gap-2 border border-(--border) rounded-lg bg-(--card)">
          <!-- 上部 -->
          <div class="flex gap-2">
            <!-- 图书封面 -->
            <img :src="`/books/${record.book.id}`" @click="router.push({ name: 'book', params: { id: record.book.id } })" class="size-26 rounded cursor-pointer" alt="图书封面"/>
            <!-- 其他信息 -->
            <div class="flex-1 flex flex-col justify-between">
              <!-- 上部信息 -->
              <div class="flex flex-col gap-1.5">
                <!-- 标题 -->
                <RouterLink :to="{ name: 'book', params: { id: record.book.id } }" class="line-clamp-1 text-sm text-(--foreground) hover:text-(--primary) hover:underline">{{ record.book.title }}</RouterLink>
                <!-- 作者 -->
                <p class="line-clamp-1 text-xs text-(--muted-foreground)">{{ record.book.author }} / {{ record.book.publish_date }} / {{ record.book.publisher }} / {{ record.book.price.toFixed(2) }}￥</p>
                <!-- 续借情况 -->
                <div class="flex">
                  <p class="px-2 rounded-full bg-(--muted) text-xs" :class="{
                    'text-(--muted-foreground)': record.is_renewed,
                    'text-(--primary)': !record.is_renewed,
                  }">{{ record.is_renewed ? "已续借" : "未续借" }}</p>
                </div>
              </div>
              <!-- 下部信息：应还时间 -->
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-1 text-(--muted-foreground)">
                  <CalendarClock class="size-3.5"/>
                  <p>应还 {{ DateTime.fromISO(record.due_time).toFormat('M月d日') }}</p>
                </div>
                <p v-if="record.isOverdue" class="font-medium text-(--destructive)">逾期 {{ DateTime.now().diff(DateTime.fromISO(record.due_time), 'days').days.toFixed(0) }} 天</p>
                <p v-if="!record.isOverdue" class="font-medium text-(--foreground)">剩余 {{ DateTime.fromISO(record.due_time).diffNow('days').days.toFixed(0) }} 天</p>
              </div>
            </div>
          </div>
          <!-- 进度条 -->
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-(--muted)" role="progressbar" aria-valuenow="29" aria-valuemin="0" aria-valuemax="100" aria-label="《百年孤独》归还进度">
            <div v-if="record.isOverdue" class="w-full h-full rounded-full bg-(--destructive)"></div>
            <div v-if="!record.isOverdue" class="h-full rounded-full bg-(--primary)" :style="{ width: record.percent + '%' }"></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>