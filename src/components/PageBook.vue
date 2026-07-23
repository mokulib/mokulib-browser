<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ArrowDownToLine, ArrowUpFromLine, BookUp, Heart, Lock, Pencil, Plus, RefreshCw, Star, Tag as TagIcon, Trash2, Undo2, Upload, X } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useUserStore } from "@/stores/user.ts";
import { usePopupStore } from "@/stores/popup.ts";
import type { Book, BookCopy, BookReview, Category, Tag } from "@/types";
import api from "@/api"

const { id } = defineProps(['id']);

const authStore = useAuthStore();
const userStore = useUserStore();
const popupStore = usePopupStore();

const book = ref<Book>();
const category = ref<Category>();
const tags = ref<Tag[]>();
const bookCopies = ref<BookCopy[]>();
const bookReviews = ref<BookReview[]>([]);

const isBorrowedByMe = computed(() => bookCopies.value?.some(bookCopy => bookCopy.is_borrowed_by_me) ?? false);
const isInWishlist = ref(false);
const isWishlistEnabled = computed(() => authStore.isLoggedIn && !isBorrowedByMe.value)
const hasWrittenBookReview = computed(() => bookReviews.value.some(bookReview => userStore.user_id === bookReview.user_id));

const statusToString = (status: string) => {
  switch (status) {
    case 'AVAILABLE':
      return '可借阅';
    case 'UNAVAILABLE':
      return '已借出';
    case 'WITHDRAWN':
      return '已下架';
    default:
      return '未知';
  }
}

const isRenewedToString = (isRenewed: boolean) => {
  return isRenewed ? '已续借' : '未续借'
}

const removeStatusToString = (removeStatus: string) => {
  switch (removeStatus) {
    case 'LOST':
      return '借阅丢失';
    case 'DAMAGED':
      return '借阅损坏';
    case 'OTHER':
      return '其他图书馆原因';
    default:
      return '未知';
  }
}

onMounted(async () => {
  // 请求图书信息
  book.value = (await api.get<Book>('/api/books/' + id)).data ?? {};
  // 请求分类信息
  category.value = (await api.get<Category>('/api/categories/' + book.value.categoryId)).data ?? {};
  // 请求标签信息
  tags.value = (await api.get<Tag[]>('/api/books/' + id + '/tags')).data ?? [];
  // 请求心愿单信息
  if (authStore.isLoggedIn)
    isInWishlist.value = (await api.get('/api/wishlist/' + id)).data ?? false;
  // 仅用户或管理员可以请求馆藏信息
  if (authStore.isLoggedIn)
    bookCopies.value = (await api.get('/api/book-copy/' + id)).data ?? [];
  // 书评信息
  bookReviews.value = (await api.get('/api/book-review/' + id)).data ?? [];
  // 处理书评信息
  if (authStore.isLoggedIn && bookReviews.value.length > 0) {
    const bookReviewIndex = bookReviews.value.findIndex(bookReview => userStore.user_id === bookReview.user_id);
    // 如果我写过评论
    if (bookReviewIndex !== -1) {
      const firstItem = bookReviews.value[0];
      const foundItem = bookReviews.value[bookReviewIndex];
      // 交换置顶评论和我的评论
      if (firstItem && foundItem) {
        bookReviews.value[0] = foundItem;
        bookReviews.value[bookReviewIndex] = firstItem;
      }
    }
  }
});
</script>

<template>
  <main class="flex-1">
    <!-- 信息 -->
    <section v-if="book" class="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div class="flex flex-col gap-8 md:flex-row">
        <!-- 封面 -->
        <div class="mx-auto w-full max-w-64 shrink-0 md:mx-0">
          <div class="relative aspect-3/4 overflow-hidden rounded-lg shadow-md ring-1 ring-(--border)">
            <img :alt="book.title + '封面'" loading="lazy" decoding="async" data-nimg="fill" class="absolute h-full w-full top-0 right-0 bottom-0 left-0 text-transparent object-cover" :src="'/books/' + book.id + '.png'">
            <div class="absolute right-2 bottom-2 flex flex-col gap-2">
              <button v-if="userStore.user_is_admin" type="button" class="
                px-2 py-2 rounded-md text-(--foreground) bg-(--background)/60 bg-clip-padding outline-none transition-all
                hover:bg-(--background)
                focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50
                active:not-aria-[haspopup]:translate-y-px">
                <Upload class="size-4 shrink-0 pointer-events-none"/>
              </button>
              <button type="button" @click="isInWishlist = !isInWishlist" :disabled="!isWishlistEnabled" :data-is-in-wishlist="isInWishlist" class="
                px-2 py-2 rounded-md text-(--foreground) bg-(--background)/60 bg-clip-padding outline-none transition-all
                hover:not-disabled:bg-(--background)
                focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50
                active:not-disabled:not-aria-[haspopup]:translate-y-px
                disabled:text-(--muted-foreground) active:disabled:not-aria-[haspopup]:translate-x-px
                data-[is-in-wishlist=true]:[&_svg]:fill-(--primary) data-[is-in-wishlist=true]:[&_svg]:text-(--primary)"
              >
                <Heart class="size-4 shrink-0 pointer-events-none"/>
              </button>
              <!-- <p v-if="!authStore.isLoggedIn" class="mt-2 text-xs text-(&#45;&#45;muted-foreground)">登录后可将图书加入心愿单。</p> -->
              <!-- <p v-else-if="isBorrowedByMe" class="mt-2 text-xs text-(&#45;&#45;muted-foreground)">您正在借阅本书的副本，暂不可加入心愿单。</p> -->
            </div>
          </div>
        </div>
        <!-- 图书信息 -->
        <div class="min-w-0 flex-1">
          <span class="inline-flex items-center gap-1 rounded-full bg-(--accent) px-2.5 py-0.5 text-xs font-medium text-(--accent-foreground)">
            {{ category?.name }}
            <button v-if="userStore.user_is_admin" type="button" aria-label="编辑分类" class="ml-0.5 text-(--accent-foreground)/70 hover:text-(--accent-foreground)">
              <Pencil class="size-3"/>
            </button>
          </span>
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h1 class="mt-2 font-serif text-3xl font-semibold leading-tight md:text-4xl">{{ book.title }}</h1>
              <p class="mt-1 text-pretty text-lg text-(--muted-foreground)">{{ book.subtitle }}</p>
              <p class="mt-2 text-sm text-(--foreground)">{{ book.author }}</p>
            </div>
            <button v-if="userStore.user_is_admin" type="button" tabindex="0" data-slot="button" class="group/button inline-flex items-center justify-center mt-2 border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 border-(--border) bg-(--background) hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*='size-'])]:size-3.5 shrink-0 gap-1.5">
              <Pencil class="size-3.5"/>
              编辑
            </button>
          </div>
          <div class="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            <div class="flex gap-2 text-sm">
              <span class="w-20 shrink-0 text-(--muted-foreground)">图书 ID</span>
              <span class="text-(--foreground)">{{ book.id }}</span>
            </div>
            <div class="flex gap-2 text-sm">
              <span class="w-20 shrink-0 text-(--muted-foreground)">ISBN</span>
              <span class="text-(--foreground)">{{ book.isbn }}</span>
            </div>
            <div class="flex gap-2 text-sm">
              <span class="w-20 shrink-0 text-(--muted-foreground)">出版社</span>
              <span class="text-(--foreground)">{{ book.publisher }}</span>
            </div>
            <div class="flex gap-2 text-sm">
              <span class="w-20 shrink-0 text-(--muted-foreground)">出版日期</span>
              <span class="text-(--foreground)">{{ book.publishDate }}</span>
            </div>
            <div class="flex gap-2 text-sm">
              <span class="w-20 shrink-0 text-(--muted-foreground)">版次</span>
              <span class="text-(--foreground)">{{ book.edition }}</span>
            </div>
            <div class="flex gap-2 text-sm">
              <span class="w-20 shrink-0 text-(--muted-foreground)">页数</span>
              <span class="text-(--foreground)">{{ book.pageCount }} 页</span>
            </div>
            <div class="flex gap-2 text-sm">
              <span class="w-20 shrink-0 text-(--muted-foreground)">语言</span>
              <span class="text-(--foreground)">{{ book.language }}</span>
            </div>
            <div class="flex gap-2 text-sm">
              <span class="w-20 shrink-0 text-(--muted-foreground)">定价</span>
              <span class="text-(--foreground)">¥ {{ book.price.toFixed(2) }}</span>
            </div>
          </div>
          <p class="mt-5 text-pretty leading-relaxed text-(--muted-foreground)">{{ book.description }}</p>
          <div class="mt-5 flex flex-wrap items-center gap-2">
            <!-- 标签图标 -->
            <TagIcon class="size-4 text-(--muted-foreground)"/>
            <!-- 标签列表 -->
            <template v-for="tag in tags" :key="tag.id">
              <span class="inline-flex items-center gap-1 rounded-full bg-(--secondary) px-2.5 py-0.5 text-xs text-(--secondary-foreground)">
                {{ tag.name }}
                <button v-if="userStore.user_is_admin" type="button" class="text-(--secondary-foreground)/60 hover:text-(--destructive)">
                  <X class="size-3"/>
                </button>
              </span>
            </template>
            <!-- 添加标签 -->
            <button v-if="userStore.user_is_admin" type="button" @click="popupStore.open('addTag')" class="inline-flex items-center gap-1 rounded-full border border-dashed border-(--border) px-2.5 py-0.5 text-xs text-(--muted-foreground) transition-colors hover:border-(--primary) hover:text-(--primary)">
              <Plus class="size-3"/>
              添加标签
            </button>
          </div>
        </div>
      </div>
    </section>
    <!-- 馆藏状态 -->
    <section class="border-t border-(--border) bg-(--muted)/30">
      <div class="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <!-- 标题 -->
        <div class="flex items-baseline justify-between">
          <div class="flex items-center gap-4">
            <h2 class="font-serif text-2xl font-semibold">馆藏状态</h2>
            <span v-if="authStore.isLoggedIn" class="text-sm text-(--muted-foreground)">共 {{ bookCopies?.length ?? 0 }} 本</span>
          </div>
          <button v-if="userStore.user_is_admin" type="button" class="group/button inline-flex items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 border-(--border) bg-(--muted)/30 hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*='size-'])]:size-3.5 shrink-0 gap-1.5">
            <Plus class="size-3"/>
            添加馆藏
          </button>
        </div>
        <!-- 游客 -->
        <div v-if="!authStore.isLoggedIn" class="mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-(--border) py-14 text-center">
          <Lock class="size-7 text-(--muted-foreground)"/>
          <p class="text-(--muted-foreground)">登录后可查看馆藏状态</p>
          <button type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5">
            <a href="/login">前往登录</a>
          </button>
        </div>
        <!-- 用户/管理员 -->
        <div v-if="authStore.isLoggedIn" class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <template v-for="bookCopy in bookCopies" :key="bookCopy.id">
            <div class="rounded-xl border p-4 transition-colors border-(--border)" :class="{
              'bg-(--card)': !bookCopy.is_borrowed_by_me,
              'bg-linear-to-b from-(--primary)/1 to-(--card) ring-1 ring-(--primary)/40': bookCopy.is_borrowed_by_me,
            }">
              <!-- 我借阅的标签 + 查看全部借阅记录 -->
              <div class="flex justify-between">
                <div v-if="bookCopy.is_borrowed_by_me" class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-(--primary) px-2.5 py-0.5 text-xs font-medium text-(--primary-foreground)">
                  <Star class="size-3"/>
                  我借阅的
                </div>
                <a v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="mb-3 inline-flex items-center gap-1 text-xs text-(--primary) underline-offset-2 hover:underline" href="/borrow_record/999"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link size-3" aria-hidden="true"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>查看全部借阅记录</a>
              </div>
              <!-- 标题 -->
              <div class="flex items-start justify-between gap-3">
                <div><p class="font-serif text-base font-medium">编号 #{{ bookCopy.id }}</p></div>
                <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                      :class="{'text-(--chart-2)': bookCopy.status === 'AVAILABLE',
                               'bg-(--chart-2)/15': bookCopy.status === 'AVAILABLE',
                               'text-(--primary)': bookCopy.status === 'UNAVAILABLE',
                               'bg-(--primary)/15': bookCopy.status === 'UNAVAILABLE',
                               'text-(--muted-foreground)': bookCopy.status === 'WITHDRAWN',
                               'bg-(--muted)': bookCopy.status === 'WITHDRAWN' }">
                  {{ statusToString(bookCopy.status) }}
                </span>
              </div>
              <!-- 状态描述 -->
              <div class="mt-3 space-y-1.5">
                <!-- 可借阅 -->
                <p v-if="userStore.user_is_user && bookCopy.role === 'USER' && bookCopy.status === 'AVAILABLE'" class="text-sm text-(--muted-foreground)">当前可借阅，欢迎到馆借阅。</p>
                <!-- 已借出 -->
                <div v-if="bookCopy.status === 'UNAVAILABLE'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">预计归还</span>
                  <span class="min-w-0 text-(--foreground)">{{ bookCopy.due_time }}</span>
                </div>
                <div v-if="bookCopy.status === 'UNAVAILABLE'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">是否续借</span>
                  <span class="min-w-0 text-(--foreground)">{{ isRenewedToString(bookCopy.is_renewed) }}</span>
                </div>
                <div v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN' && bookCopy.status === 'UNAVAILABLE'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">借阅人</span>
                  <span class="min-w-0 text-(--foreground)">
                    <a class="text-(--primary) underline-offset-2 hover:underline" href="#">reader_chen</a>
                  </span>
                </div>
                <div v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN' && bookCopy.status === 'UNAVAILABLE'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">借阅时间</span>
                  <span class="min-w-0 text-(--foreground)">2026-07-05</span>
                </div>
                <div v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN' && bookCopy.status === 'UNAVAILABLE'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">应还时间</span>
                  <span class="min-w-0 text-(--foreground)">2026-07-12</span>
                </div>
                <!-- 已下架 -->
                <div v-if="bookCopy.status === 'WITHDRAWN'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">下架原因</span>
                  <span class="min-w-0 text-(--foreground)">{{ removeStatusToString(bookCopy.remove_status) }}</span>
                </div>
                <div v-if="bookCopy.status === 'WITHDRAWN'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">下架时间</span>
                  <span class="min-w-0 text-(--foreground)">{{ bookCopy.remove_time }}</span>
                </div>
              </div>
              <!-- 入库信息 -->
              <div v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="mt-3 space-y-1.5 rounded-lg bg-(--muted)/50 p-3">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-xs font-medium uppercase tracking-wide text-(--muted-foreground)">入库信息</p>
                  <button type="button" aria-label="编辑分类" class="ml-0.5 text-(--accent-foreground)/70 hover:text-(--accent-foreground) active:not-aria-[haspopup]:translate-y-px transition-all">
                    <Pencil class="size-3"/>
                  </button>
                </div>
                <div class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">购入价格</span>
                  <span class="min-w-0 text-(--foreground)">¥ {{ bookCopy.purchase_price }}</span>
                </div>
                <div class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">购入日期</span>
                  <span class="min-w-0 text-(--foreground)">{{ bookCopy.purchase_date }}</span>
                </div>
                <div class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">来源</span>
                  <span class="min-w-0 text-(--foreground)">{{ bookCopy.source }}</span>
                </div>
                <div class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">入库人</span>
                  <span class="min-w-0 text-(--foreground)">
                    <a class="text-(--primary) underline-offset-2 hover:underline" :href="'/user/' + bookCopy.entry_by">{{ bookCopy.entry_by_name }}</a>
                  </span>
                </div>
                <div class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">入库时间</span>
                  <span class="min-w-0 text-(--foreground)">{{ bookCopy.create_time }}</span>
                </div>
                <div v-if="bookCopy.status === 'WITHDRAWN'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">出库时间</span>
                  <span class="min-w-0 text-(--foreground)">{{ bookCopy.remove_time }}</span>
                </div>
              </div>
              <!-- 操作按钮 -->
              <div class="mt-4 flex flex-wrap gap-2">
                <button v-if="userStore.user_is_user && bookCopy.role === 'USER' && bookCopy.is_borrowed_by_me || userStore.user_is_admin && bookCopy.role === 'ADMIN' && bookCopy.status === 'UNAVAILABLE'" type="button" :data-disabled="bookCopy.status === 'UNAVAILABLE' && bookCopy.is_renewed" tabindex="0" :disabled="bookCopy.status === 'UNAVAILABLE' && bookCopy.is_renewed" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-(--border) bg-(--background) hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 gap-1.5">
                  <RefreshCw class="size-3.5"/>
                  {{ bookCopy.status === 'UNAVAILABLE' && bookCopy.is_renewed ? '已续借' : '续借' }}
                </button>
                <button v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN' && bookCopy.status === 'AVAILABLE'" type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 gap-1.5">
                  <BookUp class="size-3.5"/>
                  借出
                </button>
                <button v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN' && bookCopy.status === 'UNAVAILABLE'" type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-(--border) bg-(--background) hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 gap-1.5">
                  <Undo2 class="size-3.5"/>
                  归还
                </button>
                <button v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN' && bookCopy.status === 'AVAILABLE'" type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-(--border) bg-(--background) hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 gap-1.5">
                  <ArrowDownToLine class="size-3.5"/>
                  下架
                </button>
                <button v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN' && bookCopy.status === 'WITHDRAWN' && bookCopy.remove_status === 'OTHER'" type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-(--border) bg-(--background) hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 gap-1.5">
                  <ArrowUpFromLine class="size-3.5"/>
                  重新上架
                </button>
              </div>
            </div>
          </template>
        </div>
        <!-- 管理员 -->
        <div></div>
      </div>
    </section>
    <!-- 书评 -->
    <section class="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <h2 class="font-serif text-2xl font-semibold">书评</h2>
      <div class="mt-5 space-y-4">
        <!-- 游客 -->
        <div v-if="!authStore.isLoggedIn" class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-(--border) py-10 text-center">
          <Lock class="size-6 text-(--muted-foreground)"/>
          <p class="text-(--muted-foreground)">登录后可发表评论</p>
        </div>
        <!-- 未发表过书评 -->
        <form v-if="!hasWrittenBookReview" class="rounded-xl border border-(--border) bg-(--card) p-4">
          <p class="text-sm font-medium">发表书评</p>
          <div class="mt-3 flex items-center gap-2">
            <span class="text-sm text-(--muted-foreground)">评分</span>
            <div class="flex gap-0.5">
              <button type="button" aria-label="1 星"><Star class="size-5 fill-(--primary) text-(--primary)"/></button>
              <button type="button" aria-label="2 星"><Star class="size-5 fill-(--primary) text-(--primary)"/></button>
              <button type="button" aria-label="3 星"><Star class="size-5 fill-(--primary) text-(--primary)"/></button>
              <button type="button" aria-label="4 星"><Star class="size-5 fill-(--primary) text-(--primary)"/></button>
              <button type="button" aria-label="5 星"><Star class="size-5 fill-(--primary) text-(--primary)"/></button>
            </div>
          </div>
          <textarea rows="3" placeholder="写下你对这本书的看法……" class="mt-3 flex w-full rounded-md border border-(--input) bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--ring)"></textarea>
          <div class="mt-3 flex justify-end">
            <button type="submit" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2">
              发表
            </button>
          </div>
        </form>
        <!-- 其他书评 -->
        <template v-for="bookReview in bookReviews">
          <article class="rounded-xl border p-4" :class="{
            'border-(--border) bg-(--card)': userStore.user_id !== bookReview.user_id,
            'border-(--primary)/40 bg-(--primary)/5': userStore.user_id === bookReview.user_id,
          }">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="relative size-10 overflow-hidden rounded-full ring-1 ring-(--border)">
                  <img alt="history_fan 的头像" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-1.png">
                </div>
                <div class="self-stretch flex flex-col justify-between">
                  <p class="flex items-center gap-2 text-sm font-medium">
                    <span>{{ bookReview.user_name }}</span>
                    <span v-if="userStore.user_id === bookReview.user_id" class="rounded-full bg-(--primary) px-1.5 py-0.5 text-xs text-(--primary-foreground)">我的书评</span>
                  </p>
                  <p class="text-xs text-(--muted-foreground)">{{ bookReview.create_time }}</p>
                </div>
              </div>
              <div class="flex gap-0.5" aria-label="评分 4 星">
                <template v-for="i in bookReview.score" :key="i">
                  <Star class="size-4 fill-(--primary) text-(--primary)"/>
                </template>
                <template v-for="i in 5 - bookReview.score" :key="i">
                  <Star class="size-4 text-(--border)"/>
                </template>
              </div>
            </div>
            <p class="mt-3 text-pretty leading-relaxed text-(--foreground)">{{ bookReview.content }}</p>
            <div class="mt-3 flex justify-end">
              <button v-if="userStore.user_id === bookReview.user_id || userStore.user_is_admin" type="button" @click="popupStore.open('deleteBookReviewConfirm', bookReview)" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 hover:bg-(--muted) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:hover:bg-(--muted)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*='size-'])]:size-3.5 gap-1.5 text-(--destructive) hover:text-(--destructive)">
                <Trash2 class="size-3.5"/>
                删除
              </button>
            </div>
          </article>
        </template>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>