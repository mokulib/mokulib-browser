<script setup lang="ts">
import { BookOpen, FolderHeart, Folders } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.ts";
import { onMounted, ref } from "vue";
import RouteCard from "@/components/profile/my/RouteCard.vue";
import RouteButton from "@/components/profile/my/RouteButton.vue";
import api from "@/api";
import type { Book, Response } from "@/types";
import { usePopupStore } from "@/stores/popup.ts";
import { ElMessage } from "element-plus";

const authStore = useAuthStore();
const popupStore = usePopupStore();

const borrowing = ref<{ id: number, title: string }[]>([]);
const favorites = ref<{ id: number, title: string }[]>([]);
const history = ref<{ id: number, title: string }[]>([]);
const books = ref<Book[]>([]);

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
  // 请求借阅中的数据
  const borrowing_ = (await api.get<{ books: any[], borrow_records: any[] }>('/api/users/borrowing')).data;
  // 将数据转换为 { id: number, title: string }[] 格式
  borrowing.value = borrowing_.borrow_records.map(record => {
    const book = borrowing_.books.find(book => book.id === record.book_id)
    return { id: book.id as number, title: book.title as string }
  })
  // 请求收藏夹数据
  const favorites_ = (await api.get<Book[]>("/api/users/favorites")).data;
  // 将数据转换为 { id: number, title: string }[] 格式
  favorites.value = favorites_.map(book => ({ id: book.id as number, title: book.title as string }))
  // 请求借阅历史数据
  const history_ = (await api.get<any[]>('/api/users/history')).data;
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
    id: record.book_id,
    title: books.value.find(book => book.id === record.book_id)!.title
  }));
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