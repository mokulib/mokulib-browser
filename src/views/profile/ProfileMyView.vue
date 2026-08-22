<script setup lang="ts">
import { BookOpen, FolderHeart, Folders } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.ts";
import { onMounted, ref } from "vue";
import RouteCard from "@/components/profile/my/RouteCard.vue";
import RouteButton from "@/components/profile/my/RouteButton.vue";
import api from "@/api";
import type { BorrowRecordWithBookId, History, Response } from "@/types";
import { usePopupStore } from "@/stores/popup.ts";
import { ElMessage } from "element-plus";
import { useBookStore } from "@/stores/book.ts";

const authStore = useAuthStore();
const popupStore = usePopupStore();
const bookStore = useBookStore();

const borrowing = ref<{ id: number, title: string }[]>([]);
const favorites = ref<{ id: number, title: string }[]>([]);
const history = ref<{ id: number, title: string }[]>([]);

/////////////////////////////////////////////
// 弹窗回调
/////////////////////////////////////////////

async function uploadAvatarCallback(data: Response<any>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    authStore.avatarTimestamp = Date.now(); // 刷新头像
  } else {
    ElMessage.error(data.message);
  }
}

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

onMounted(async () => {
  const borrowing_ = (await api.get<BorrowRecordWithBookId[]>('/api/users/borrowing')).data;
  const favorites_ = (await api.get<number[]>("/api/users/favorites")).data;
  const history_ = (await api.get<History[]>('/api/users/history')).data;
  // 预加载
  await bookStore.preload(...borrowing_.map(record => record.book_id), ...favorites_, ...history_.map(record => record.book_id));
  // 将数据转换为 { id: number, title: string }[] 格式
  borrowing.value = borrowing_.map(record => ({ id: record.book_id, title: bookStore.book(record.book_id).value?.title! as string }));
  favorites.value = favorites_.map(bookId => ({ id: bookId, title: bookStore.book(bookId).value?.title! as string }));
  history.value = history_.map(record => ({ id: record.book_id, title: bookStore.book(record.book_id).value?.title! as string }));
})
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-6">
    <!-- 个人卡片 -->
    <div class="flex px-6 py-4 gap-4 sm:rounded-lg bg-(--primary)/8">
      <div class="relative group w-28 h-28 rounded-full overflow-hidden">
        <!-- 头像 -->
        <img :src="authStore.avatar" alt="avatar" class="w-full h-full object-cover">
        <!-- 遮罩 -->
        <div @click="popupStore.open('uploadAvatar', { id: authStore.id }, uploadAvatarCallback)" class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
          <span class="text-sm text-white">上传头像</span>
        </div>
      </div>
      <!-- 昵称、邮箱 -->
      <div class="flex flex-col gap-3">
        <p class="text-xl">{{ authStore.username }}</p>
        <div class="flex items-center gap-3">
          <p class="text-sm">{{ authStore.email }}</p>
          <div class="w-px h-3/4 bg-(--primary)/10"></div>
          <span class="px-2 py-0.5 rounded-full text-xs text-(--primary) bg-(--primary)/10">{{ authStore.roleName }}</span>
        </div>
      </div>
    </div>

    <!-- 窄屏：路由按钮 -->
    <div class="grid grid-cols-3 sm:hidden mx-2 py-2 shadow rounded bg-(--card)">
      <RouteButton title="我的借阅" route="profile-borrowing" :icon="BookOpen"></RouteButton>
      <RouteButton title="收藏" route="profile-favorite" :icon="FolderHeart"></RouteButton>
      <RouteButton title="借阅历史" route="profile-history" :icon="Folders"></RouteButton>
    </div>

    <!-- 宽屏：路由卡片 -->
    <div class="hidden sm:flex gap-3 md:gap-4">
      <RouteCard title="我的借阅" route="profile-borrowing" empty-text="当前没有借阅" :empty-icon="BookOpen" :book-list="borrowing"/>
      <RouteCard title="好书收藏" route="profile-favorite" empty-text="还没有收藏图书" :empty-icon="FolderHeart" :book-list="favorites"/>
      <RouteCard title="借阅过的好书" route="profile-history" empty-text="没有借阅记录" :empty-icon="Folders" :book-list="history"/>
    </div>
  </div>
</template>

<style scoped>

</style>