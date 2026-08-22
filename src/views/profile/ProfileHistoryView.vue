<script setup lang="ts">
import { Folders } from "@lucide/vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import api from "@/api";
import { DateTime } from "luxon";
import ProfileLayout from "@/components/profile/ProfileLayout.vue";
import { useBookStore } from "@/stores/book.ts";

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
  is_overdue: boolean;
}

const router = useRouter();
const bookStore = useBookStore();

const isLoading = ref(true);
const history = ref<ExtendedHistory[]>([]);

/////////////////////////////////////////////
// 工具方法
/////////////////////////////////////////////

function formatTime(time: string) {
  return DateTime.fromISO(time).toFormat("yyyy-MM-dd")
}

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

onMounted(async () => {
  isLoading.value = true;
  // 查询历史记录
  const history_ = (await api.get<History[]>('/api/users/history')).data;
  // 预加载
  await bookStore.preload(...history_.map(record => record.book_id));
  // 构造历史记录
  history.value = history_.map(record => ({
    ...record,
    is_overdue: DateTime.fromISO(record.return_time).diff(DateTime.fromISO(record.due_time)).milliseconds > 0
  }));
  isLoading.value = false;
})
</script>

<template>
  <ProfileLayout :is-loading="isLoading" :is-empty="history.length === 0" empty-text="还没有借阅记录" :empty-icon="Folders">
    <template #title>
      <div class="block sm:hidden tracking-wide text-lg font-bold">借阅历史</div>
      <div class="hidden sm:block tracking-wide text-lg font-bold">借阅过的好书</div>
    </template>

    <template #default>
      <!-- 卡片展示 -->
      <div class="flex flex-col p-4 sm:p-0 gap-4">
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
                <img :src="`/books/${record.book_id}`" @click="router.push({ name: 'book', params: { id: record.book_id } })" :alt="bookStore.book(record.book_id).value?.title" class="size-24 rounded-lg"/>
                <div class="flex flex-col gap-1.5">
                  <RouterLink :to="{ name: 'book', params: { id: record.book_id } }" class="line-clamp-1 text-sm hover:text-(--primary) hover:underline">{{ bookStore.book(record.book_id).value?.title }}</RouterLink>
                  <p class="line-clamp-1 text-xs text-(--muted-foreground)">{{ bookStore.book(record.book_id).value?.author }} / {{ bookStore.book(record.book_id).value?.publish_date }} / {{ bookStore.book(record.book_id).value?.publisher }} / {{ bookStore.book(record.book_id).value?.price.toFixed(2) }}￥</p>
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
    </template>
  </ProfileLayout>
</template>

<style scoped>

</style>