<script setup lang="ts">
import { ref, toRef, watch } from "vue";
import api from "@/api";
import { useRouter } from "vue-router";
import { DateTime } from "luxon";
import { Loader } from "@lucide/vue";

const props = defineProps({ id: { type: String, required: true } });
const id = toRef(props, "id");

const router = useRouter();

const requestTimestamp = ref(DateTime.now());
const isLoading = ref(false);
const isError = ref(false);
const bookCopy = ref<any>();
const borrowRecords = ref<any[]>([]);

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

watch(id, async () => {
  // 初始化
  requestTimestamp.value = DateTime.now();
  isLoading.value = true;
  isError.value = false;
  // 获取馆藏信息
  bookCopy.value = (await api.get<any>(`/api/book-copies/${id.value}`)).data ?? undefined;
  // 获取借阅记录
  borrowRecords.value = (await api.get<any[]>(`/api/book-copies/${id.value}/borrow-records`)).data ?? undefined;
  // 检查
  if (!bookCopy.value || !borrowRecords.value)
    isError.value = true;
  // 获取完成
  console.log("请求错误：", isError.value)
  console.log("起始时间：", requestTimestamp.value)
  console.log("结束时间：", DateTime.now())
  console.log("耗时：", DateTime.now().diff(requestTimestamp.value).milliseconds)
  setTimeout(() => isLoading.value = false, Math.max(0, 1000 - DateTime.now().diff(requestTimestamp.value).milliseconds));
}, { immediate: true })
</script>

<template>
  <main class="flex-1 flex">
    <div v-if="isLoading" class="flex-1 flex items-center justify-center gap-2">
      <Loader class="size-5 text-(--muted-foreground) opacity-0 animate-spin" :class="{ 'opacity-100': isLoading }" style="transition-duration: 500ms; animation-duration: 3000ms"/>
      <p class="text-(--muted-foreground) tracking-wide">加载中 . . .</p>
    </div>
    <div v-if="!isLoading && isError" class="flex-1 flex items-center justify-center">
      <p class="text-(--danger)">图书不存在</p>
    </div>
    <div v-if="!isLoading && !isError" class="mx-auto max-w-6xl flex flex-col px-4 md:px-8">
      <!-- 头部 -->
      <div class="mb-6 rounded-lg border border-(--border) bg-(--card) p-4">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="rounded-full bg-(--primary)/10 px-3 py-1 text-xs font-medium text-(--primary)">
                {{ bookCopy.status }}
              </span>
              <span class="text-sm text-(--muted-foreground)">#{{ bookCopy.id }}</span>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div>
                <span class="text-(--muted-foreground)">购入价格</span>
                <p class="font-medium">¥{{ bookCopy.purchase_price }}</p>
              </div>
              <div>
                <span class="text-(--muted-foreground)">购入日期</span>
                <p class="font-medium">{{ bookCopy.purchase_date }}</p>
              </div>
              <div>
                <span class="text-(--muted-foreground)">来源</span>
                <p class="font-medium">{{ bookCopy.source }}</p>
              </div>
              <div>
                <span class="text-(--muted-foreground)">入库人</span>
                <p class="font-medium">#{{ bookCopy.entry_by }}</p>
              </div>
              <div>
                <span class="text-(--muted-foreground)">入库时间</span>
                <p class="font-medium">{{ bookCopy.create_time }}</p>
              </div>
              <div v-if="bookCopy.withdrawn_reason">
                <span class="text-(--muted-foreground)">下架原因</span>
                <p class="font-medium">{{ bookCopy.withdrawn_reason }}</p>
              </div>
              <div v-if="bookCopy.withdrawn_time">
                <span class="text-(--muted-foreground)">下架时间</span>
                <p class="font-medium">{{ bookCopy.withdrawn_time }}</p>
              </div>
            </div>
          </div>
          <button @click="router.back()" class="shrink-0 text-sm text-(--muted-foreground) hover:text-(--foreground) transition-colors">
            ← 返回
          </button>
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
              <span :class="{
                'text-green-600': item.close_status === 'CLOSED',
                'text-amber-600': item.close_status === 'OPEN',
                'text-red-600': item.close_status === 'LOST' || item.close_status === 'DAMAGED'
              }">
                {{ item.close_status }}
              </span>
            </div>
            <div><span class="text-(--muted-foreground)">创建时间：</span>{{ item.create_time }}</div>
            <div><span class="text-(--muted-foreground)">应还时间：</span>{{ item.due_time }}</div>
            <div><span class="text-(--muted-foreground)">关闭时间：</span>{{ item.close_time || '-' }}</div>
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