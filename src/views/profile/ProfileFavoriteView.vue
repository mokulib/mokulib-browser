<script setup lang="ts">
import { FolderHeart, Heart } from "@lucide/vue";
import { onMounted, ref } from "vue";
import api from "@/api";
import type { Book, Favorite } from "@/types";
import { ElMessage } from "element-plus";
import ProfileLayout from "@/components/profile/ProfileLayout.vue";

interface FavoriteBook extends Book {
  is_favorite: boolean;
}

const isLoading = ref(true);
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
  isLoading.value = true;
  const favorites = (await api.get<Book[]>("/api/users/favorites")).data;
  favoriteBooks.value = favorites.map((book: Book) => ({ ...book, is_favorite: true }));
  isLoading.value = false;
})
</script>

<template>
  <ProfileLayout :is-loading="isLoading" :is-empty="favoriteBooks.length === 0" empty-text="收藏夹空空的" :empty-icon="FolderHeart">
    <template #title>
      <div class="tracking-wide text-lg font-bold">我的收藏</div>
    </template>

    <template #default>
      <!-- 网格展示 -->
      <div class="grid grid-cols-3 md:grid-cols-4 p-4 sm:p-0 gap-4 md:gap-8">
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
    </template>
  </ProfileLayout>
</template>

<style scoped>

</style>