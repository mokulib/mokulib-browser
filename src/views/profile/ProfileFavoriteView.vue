<script setup lang="ts">
import { ChevronLeft, FolderHeart, Heart } from "@lucide/vue";
import { onMounted, ref } from "vue";
import api from "@/api";
import type { Book, Favorite } from "@/types";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

interface FavoriteBook extends Book {
  is_favorite: boolean;
}

const router = useRouter();

const favoriteBooks = ref<FavoriteBook[]>([]);

/////////////////////////////////////////////
// 业务操作请求
/////////////////////////////////////////////

async function favoriteHandler(index: number) {
  // 根据当前状态决定请求类型
  const data = favoriteBooks.value[index]!.is_favorite ? await api.delete<Favorite>('/api/favorites/' + favoriteBooks.value[index]!.id) : await api.post<Favorite>('/api/favorites/' + favoriteBooks.value[index]!.id);
  // 处理数据
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    favoriteBooks.value[index]!.is_favorite = data.data.is_favorite;
  } else {
    ElMessage.error(data.message);
  }
}

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

onMounted(async () => {
  const favorites = (await api.get<Book[]>("/api/users/favorites")).data;
  favoriteBooks.value = favorites.map((book: Book) => ({ ...book, is_favorite: true }));
})
</script>

<template>
  <div class="flex flex-col sm:gap-8">
    <!-- 标题 -->
    <div class="flex items-center px-4 sm:px-0 pt-4 sm:pt-0 sm:pb-4 gap-4 sm:border-b sm:border-(--border)">
      <ChevronLeft @click="router.back()" class="block sm:hidden ml-2 size-5 cursor-pointer"/>
      <div class="tracking-wide text-lg font-bold">我的收藏</div>
    </div>

    <!-- 无收藏信息 -->
    <div v-if="favoriteBooks.length === 0" class="flex flex-col items-center py-20 sm:py-4 gap-2">
      <FolderHeart class="size-8 text-(--muted-foreground)/50"/>
      <p class="text-sm text-(--muted-foreground)">收藏夹空空的</p>
    </div>

    <!-- 网格展示 -->
    <div v-if="favoriteBooks.length > 0" class="grid grid-cols-3 md:grid-cols-4 p-4 sm:p-0 gap-4 md:gap-8">
      <template v-for="(favoriteBook, index) in favoriteBooks">
        <!-- 卡片 -->
        <div class="flex flex-col items-center gap-2">
          <!-- 封面 Box -->
          <div class="relative">
            <img :src="`/books/${favoriteBook.id}`" class="rounded" alt="book.title">
            <Heart @click="favoriteHandler(index)" :disabled="false" :data-is-favorite="favoriteBook.is_favorite" class="
                absolute bottom-2 left-2 size-5 shrink-0 text-(--foreground) bg-clip-padding outline-none transition-all cursor-pointer
                focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50
                active:not-disabled:not-aria-[haspopup]:translate-y-px
                disabled:text-(--muted-foreground) active:disabled:not-aria-[haspopup]:translate-x-px
                data-[is-favorite=true]:fill-(--destructive) data-[is-favorite=true]:text-(--destructive)"/>
          </div>
          <!-- 标题 -->
          <RouterLink :to="{ name: 'book', params: { id: favoriteBook.id } }" class="px-1 line-clamp-2 tracking-wider text-center text-sm text-(--foreground) hover:text-(--primary) hover:underline">{{ favoriteBook.title }}</RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>