<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ArrowDownToLine, ArrowUpFromLine, BookUp, Heart, Lock, Pencil, Plus, RefreshCw, Star, Tag as TagIcon, Trash2, ExternalLink, BookDown, Upload, X } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useUserStore } from "@/stores/user.ts";
import { usePopupStore } from "@/stores/popup.ts";
import type {
  Book,
  BookCopy,
  BookReview,
  Category,
  Tag,
  Response,
  Wishlist,
  BorrowRecord,
  BookCopyAdmin
} from "@/types";
import api from "@/api"
import { ElMessage } from "element-plus";

const { id } = defineProps(['id']);

const authStore = useAuthStore();
const userStore = useUserStore();
const popupStore = usePopupStore();

const book = ref<Book>();
const category = ref<Category>({ id: -1, name: '' });
const tags = ref<Tag[]>([]);
const bookCopies = ref<BookCopy[]>([]);
const bookReviews = ref<BookReview[]>([]);

const bookCoverTimestamp = ref<number>(Date.now());
const bookCoverSrc = computed<string>(() => '/books/' + id + '?timestamp=' + bookCoverTimestamp.value);
const isBorrowedByMe = computed(() => bookCopies.value?.some(bookCopy => isMyBorrowRecord(bookCopy.current_borrow_record)) ?? false);
const isInWishlist = ref(false);
const isWishlistEnabled = computed(() => authStore.isLoggedIn && !isBorrowedByMe.value)
const idUsernameMapping = ref<Record<number,string>>({});
const availableCount = computed(() => bookCopies.value.filter(bookCopy => bookCopy.status === 'AVAILABLE').length);
const unavailableCount = computed(() => bookCopies.value.filter(bookCopy => bookCopy.status === 'UNAVAILABLE').length);
const withdrawnCount = computed(() => bookCopies.value.filter(bookCopy => bookCopy.status === 'WITHDRAWN').length);
const hasWrittenBookReview = computed(() => bookReviews.value.some(bookReview => userStore.user_id === bookReview.user_id));

/////////////////////////////////////////////
// 工具方法
/////////////////////////////////////////////

const isMyBorrowRecord = (borrowRecord: BorrowRecord | null) => {
  return borrowRecord?.user_id === userStore.user_id;
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

/////////////////////////////////////////////
// 页面展示用数据请求
/////////////////////////////////////////////

async function fetchCategory() {
  category.value = (await api.get<Category>('/api/categories/' + book.value?.category_id)).data ?? {};
}

async function fetchTags() {
  tags.value = (await api.get<Tag[]>('/api/books/' + id + '/tags')).data ?? [];
}

async function fetchIdUsernameMapping() {
  // 收集需要查询的用户名（未去重）
  const ids = bookCopies.value?.flatMap(bookCopy => {
    if (bookCopy.role === 'ADMIN' && !bookCopy.current_borrow_record)
      return [bookCopy.entry_by];
    if (bookCopy.role === 'ADMIN' && !!bookCopy.current_borrow_record)
      return [bookCopy.entry_by, bookCopy.current_borrow_record.user_id];
    return [];
  });
  // 去重
  const uniqueIds = [...new Set(ids)];
  // 去掉已查询过的
  const requestIds = uniqueIds.filter(id => !idUsernameMapping.value[id]);
  // 需要请求的用户名不为空时再请求
  if (requestIds.length) {
    // 请求新映射
    const newIdUsernameMapping = (await api.get<{ id: number, username: string }[]>('/api/users/usernames', {
      params: { ids: requestIds.join(',') }
    })).data.reduce((acc, item) => { // 转换类型，便于模板中使用 usernames[user_id] 直接查询
      acc[item.id] = item.username;
      return acc;
    }, {} as Record<number, string>);
    // 合并到已有映射
    idUsernameMapping.value = { ...idUsernameMapping.value, ...newIdUsernameMapping };
  }
}

async function fetchBookCopies() {
  bookCopies.value = (await api.get('/api/books/' + id + '/book-copies')).data ?? [];
  // 置顶我的借阅
  bookCopies.value = [...bookCopies.value].sort((a, b) => {
    if (isMyBorrowRecord(a.current_borrow_record) && !isMyBorrowRecord(b.current_borrow_record)) return -1  // a 是我借的，b 不是，a 排前面
    if (!isMyBorrowRecord(a.current_borrow_record) && isMyBorrowRecord(b.current_borrow_record)) return 1   // b 是我借的，a 不是，b 排前面
    return 0  // 其他情况顺序不变
  })
  // 管理员能看到详细信息，其中包含用户 id，需要刷新 id-username 映射
  if (userStore.user_is_admin)
    await fetchIdUsernameMapping();
}

/////////////////////////////////////////////
// 业务操作请求
/////////////////////////////////////////////

async function wishlistHandler() {
  // 根据当前状态决定请求类型
  const data = isInWishlist.value ? await api.delete<Wishlist>('/api/wishlists/' + id) : await api.post<Wishlist>('/api/wishlists/' + id);
  // 处理数据
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    isInWishlist.value = data.data.is_in_wishlist;
  } else {
    ElMessage.error(data.message);
  }
}

async function deleteTagHandler(tagId: number) {
  // 提交请求
  const data = await api.delete('/api/books/' + id + '/tags/' + tagId);
  // 处理数据
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    await fetchTags();
  } else {
    ElMessage.error(data.message);
  }
}

async function renew(borrowRecordId: number) {
  // 提交请求
  const data = await api.post<BorrowRecord>('/api/borrow-records/' + borrowRecordId + '/renew');
  // 处理数据
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    (bookCopies.value.find(bookCopy => bookCopy.current_borrow_record?.id === data.data.id) as BookCopy).current_borrow_record = data.data; // 刷新借阅记录
  } else {
    ElMessage.error(data.message);
  }
}

/////////////////////////////////////////////
// 弹窗回调
/////////////////////////////////////////////

async function uploadBookCoverCallback(data: Response<any>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    bookCoverTimestamp.value = Date.now(); // 刷新封面
  } else {
    ElMessage.error(data.message);
  }
}

async function editCategoryCallback(data: Response<Book>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    book.value = data.data;
    await fetchCategory(); // 更新分类名
  } else {
    ElMessage.error(data.message);
  }
}

function editBookCallback(data: Response<Book>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    book.value = data.data;
  } else {
    ElMessage.error(data.message);
  }
}

async function addTagCallback(data: Response<undefined>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    await fetchTags();
  } else {
    ElMessage.error(data.message);
  }
}

async function addBookCopyCallback(data: Response<BookCopyAdmin>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    bookCopies.value?.push(data.data);
    await fetchIdUsernameMapping();
  } else {
    ElMessage.error(data.message);
  }
}

async function editBookCopyCallback(data: Response<BookCopyAdmin>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    bookCopies.value[bookCopies.value.findIndex(bookCopy => bookCopy.id === data.data.id)] = data.data; // 刷新数据
  } else {
    ElMessage.error(data.message);
  }
}

async function borrowCallback(data: Response<BookCopyAdmin>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    bookCopies.value[bookCopies.value.findIndex(bookCopy => bookCopy.id === data.data.id)] = data.data; // 刷新数据
    await fetchIdUsernameMapping();
  } else {
    ElMessage.error(data.message);
  }
}

async function withdrawnCallback(data: Response<BookCopyAdmin>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    bookCopies.value[bookCopies.value.findIndex(bookCopy => bookCopy.id === data.data.id)] = data.data; // 刷新数据
  } else {
    ElMessage.error(data.message);
  }
}

async function returnBookCallback(data: Response<BookCopyAdmin>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    bookCopies.value[bookCopies.value.findIndex(bookCopy => bookCopy.id === data.data.id)] = data.data; // 刷新数据
  } else {
    ElMessage.error(data.message);
  }
}

async function relistCallback(data: Response<BookCopyAdmin>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    bookCopies.value[bookCopies.value.findIndex(bookCopy => bookCopy.id === data.data.id)] = data.data; // 刷新数据
  } else {
    ElMessage.error(data.message);
  }
}

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

onMounted(async () => {
  // 请求图书信息
  book.value = (await api.get<Book>('/api/books/' + id)).data ?? {};
  // 请求分类信息
  await fetchCategory();
  // 请求标签信息
  await fetchTags();
  // 请求心愿单信息
  if (authStore.isLoggedIn)
    isInWishlist.value = (await api.get<Wishlist>('/api/wishlists/' + id)).data.is_in_wishlist ?? false;
  // 仅用户或管理员可以请求馆藏信息
  if (authStore.isLoggedIn)
    await fetchBookCopies();
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
            <img :src="bookCoverSrc" :alt="book.title + '封面'" loading="lazy" decoding="async" data-nimg="fill" class="absolute h-full w-full top-0 right-0 bottom-0 left-0 text-transparent object-cover">
            <div class="absolute right-2 bottom-2 flex flex-col gap-2">
              <button v-if="userStore.user_is_admin" type="button" @click="popupStore.open('uploadBookCover', { id }, uploadBookCoverCallback)" class="
                px-2 py-2 rounded-md text-(--foreground) bg-(--background)/60 bg-clip-padding outline-none transition-all border border-(--border)
                hover:bg-(--background)
                focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50
                active:not-aria-[haspopup]:translate-y-px">
                <Upload class="size-4 shrink-0 pointer-events-none"/>
              </button>
              <button type="button" @click="wishlistHandler" :disabled="!isWishlistEnabled" :data-is-in-wishlist="isInWishlist" class="
                px-2 py-2 rounded-md text-(--foreground) bg-(--background)/60 bg-clip-padding outline-none transition-all border border-(--border)
                hover:not-disabled:bg-(--background)
                focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50
                active:not-disabled:not-aria-[haspopup]:translate-y-px
                disabled:text-(--muted-foreground) active:disabled:not-aria-[haspopup]:translate-x-px
                data-[is-in-wishlist=true]:[&_svg]:fill-(--primary) data-[is-in-wishlist=true]:[&_svg]:text-(--primary)"
              >
                <Heart class="size-4 shrink-0 pointer-events-none"/>
              </button>
            </div>
          </div>
        </div>
        <!-- 图书信息 -->
        <div class="min-w-0 flex-1">
          <span class="inline-flex items-center gap-1 rounded-full bg-(--accent) px-2.5 py-0.5 text-xs font-medium text-(--accent-foreground)">
            {{ category?.name }}
            <button v-if="userStore.user_is_admin" type="button" @click="popupStore.open('editCategory', { book, category }, editCategoryCallback)" aria-label="编辑分类" class="ml-0.5 text-(--accent-foreground)/70 hover:text-(--accent-foreground)">
              <Pencil class="size-3"/>
            </button>
          </span>
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h1 class="mt-2 font-serif text-3xl font-semibold leading-tight md:text-4xl">{{ book.title }}</h1>
              <p class="mt-1 text-pretty text-lg text-(--muted-foreground)">{{ book.subtitle }}</p>
              <p class="mt-2 text-sm text-(--foreground)">{{ book.author }}</p>
            </div>
            <button v-if="userStore.user_is_admin" type="button" @click="popupStore.open('editBook', { book }, editBookCallback)" tabindex="0" data-slot="button" class="group/button inline-flex items-center justify-center mt-2 border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 border-(--border) bg-(--background) hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*='size-'])]:size-3.5 shrink-0 gap-1.5">
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
              <span class="text-(--foreground)">{{ book.publish_date }}</span>
            </div>
            <div class="flex gap-2 text-sm">
              <span class="w-20 shrink-0 text-(--muted-foreground)">版次</span>
              <span class="text-(--foreground)">{{ book.edition }}</span>
            </div>
            <div class="flex gap-2 text-sm">
              <span class="w-20 shrink-0 text-(--muted-foreground)">页数</span>
              <span class="text-(--foreground)">{{ book.page_count }} 页</span>
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
                <button v-if="userStore.user_is_admin" type="button" @click="deleteTagHandler(tag.id)" class="text-(--secondary-foreground)/60 hover:text-(--destructive)">
                  <X class="size-3"/>
                </button>
              </span>
            </template>
            <!-- 添加标签 -->
            <button v-if="userStore.user_is_admin" type="button" @click="popupStore.open('addTag', { id, tags }, addTagCallback)" class="inline-flex items-center gap-1 rounded-full border border-dashed border-(--border) px-2.5 py-0.5 text-xs text-(--muted-foreground) transition-colors hover:border-(--primary) hover:text-(--primary)">
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
        <div v-if="authStore.isLoggedIn" class="flex items-center justify-between">
          <div class="flex items-baseline gap-4">
            <h2 class="font-serif text-2xl font-semibold">全部馆藏</h2>
            <div class="flex items-center">
              <span v-if="!bookCopies.length" class="text-sm text-(--muted-foreground)">暂无馆藏</span>
              <span v-if="bookCopies.length" class="text-sm text-(--muted-foreground)">共 {{ bookCopies.length }} 本</span>
              <!-- 宽屏时显示详细统计 -->
              <div class="hidden md:flex md:items-center">
                <span v-if="availableCount" class="text-sm text-(--muted-foreground) whitespace-pre-wrap"> · 可借阅 {{ availableCount }} 本</span>
                <span v-if="unavailableCount" class="text-sm text-(--muted-foreground) whitespace-pre-wrap"> · 已借出 {{ unavailableCount }} 本</span>
                <span v-if="userStore.user_is_admin && withdrawnCount" class="text-sm text-(--muted-foreground) whitespace-pre-wrap"> · 已下架 {{ withdrawnCount }} 本</span>
              </div>
            </div>
          </div>
          <button v-if="userStore.user_is_admin" type="button" @click="popupStore.open('addBookCopy', { id }, addBookCopyCallback)" class="group/button inline-flex items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 border-(--border) bg-(--muted)/30 hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*='size-'])]:size-3.5 shrink-0 gap-1.5">
            <Plus class="size-3"/>
            添加馆藏
          </button>
        </div>
        <!-- 游客 -->
        <div v-if="!authStore.isLoggedIn" class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-(--border) py-14 text-center">
          <Lock class="size-7 text-(--muted-foreground)"/>
          <p class="text-(--muted-foreground)">登录后可查看馆藏状态</p>
          <button type="button" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5">
            <a href="/login">前往登录</a>
          </button>
        </div>
        <!-- 用户/管理员 -->
        <div v-if="authStore.isLoggedIn" class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 min-[1152px]:grid-cols-3!">
          <template v-for="bookCopy in bookCopies" :key="bookCopy.id">
            <div class="flex flex-col rounded-xl border p-4 transition-colors border-(--border)" :class="{
              'bg-(--card)': !isMyBorrowRecord(bookCopy.current_borrow_record),
              'bg-linear-to-b from-(--primary)/1 to-(--card) ring-1 ring-(--primary)/40': isMyBorrowRecord(bookCopy.current_borrow_record),
            }">
              <!-- 查看全部借阅记录 -->
              <a v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="mb-3 inline-flex items-center gap-1 text-xs text-(--primary) underline-offset-2 hover:underline" href="/borrow_record/999">
                <ExternalLink class="size-3"/>
                查看全部借阅记录
              </a>
              <!-- 标题 -->
              <div class="flex items-start justify-between gap-3">
                <div><p class="font-serif text-base font-medium">编号 #{{ bookCopy.id }}</p></div>
                <span v-if="bookCopy.status === 'AVAILABLE'" class="inline-flex leading-none rounded-full px-2.5 py-1 text-xs font-medium text-(--chart-2) bg-(--chart-2)/15">
                  可借阅
                </span>
                <span v-if="bookCopy.status === 'UNAVAILABLE' && !isMyBorrowRecord(bookCopy.current_borrow_record)" class="inline-flex leading-none rounded-full px-2.5 py-1 text-xs font-medium text-(--primary) bg-(--primary)/15">
                  已借出
                </span>
                <div v-if="bookCopy.status === 'UNAVAILABLE' && isMyBorrowRecord(bookCopy.current_borrow_record)" class="inline-flex items-center leading-none gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-(--primary-foreground) bg-(--primary)">
                  <Star class="size-3"/>
                  我的借阅
                </div>
                <span v-if="bookCopy.status === 'WITHDRAWN'" class="inline-flex leading-none rounded-full px-2.5 py-1 text-xs font-medium text-(--muted-foreground) bg-(--muted)">
                  已下架
                </span>
              </div>
              <!-- 状态描述 -->
              <div class="flex-1 mt-3 space-y-1.5">
                <!-- 可借阅欢迎语（仅用户显示） -->
                <p v-if="bookCopy.status === 'AVAILABLE' && userStore.user_is_user && bookCopy.role === 'USER'" class="text-sm text-(--muted-foreground)">当前可借阅，欢迎到馆借阅。</p>
                <!-- 可借阅提示语（仅管理显示） -->
                <p v-if="bookCopy.status === 'AVAILABLE' && userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="text-sm text-(--muted-foreground)">当前可借阅。</p>
                <!-- 已借出欢迎语（仅用户显示）（非当前用户借阅时） -->
                <p v-if="bookCopy.status === 'UNAVAILABLE' && !bookCopy.current_borrow_record && userStore.user_is_user && bookCopy.role === 'USER'" class="text-sm text-(--muted-foreground)">这一本被人借走啦。</p>
                <!-- 已借出详情（仅用户显示）（当前用户借阅时） -->
                <div v-if="bookCopy.status === 'UNAVAILABLE' && bookCopy.current_borrow_record && userStore.user_is_user && bookCopy.role === 'USER'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">应还时间</span>
                  <span class="min-w-0 text-(--foreground)">{{ bookCopy.current_borrow_record.due_time }}</span>
                </div>
                <div v-if="bookCopy.status === 'UNAVAILABLE' && bookCopy.current_borrow_record && userStore.user_is_user && bookCopy.role === 'USER'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">是否续借</span>
                  <span class="min-w-0 text-(--foreground)">{{ isRenewedToString(bookCopy.current_borrow_record.is_renewed) }}</span>
                </div>
                <!-- 已借出详情（仅管理显示） -->
                <div v-if="bookCopy.status === 'UNAVAILABLE' && userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">借阅人</span>
                  <span class="min-w-0 text-(--foreground)">
                    <a class="text-(--primary) underline-offset-2 hover:underline" href="#">{{ idUsernameMapping[bookCopy.current_borrow_record.user_id] }}</a>
                  </span>
                </div>
                <div v-if="bookCopy.status === 'UNAVAILABLE' && userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">是否续借</span>
                  <span class="min-w-0 text-(--foreground)">{{ isRenewedToString(bookCopy.current_borrow_record.is_renewed) }}</span>
                </div>
                <div v-if="bookCopy.status === 'UNAVAILABLE' && userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">借阅时间</span>
                  <span class="min-w-0 text-(--foreground)">2026-07-05</span>
                </div>
                <div v-if="bookCopy.status === 'UNAVAILABLE' && userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">应还时间</span>
                  <span class="min-w-0 text-(--foreground)">2026-07-12</span>
                </div>
                <!-- 已下架（仅管理显示） -->
                <div v-if="bookCopy.status === 'WITHDRAWN' && userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">下架原因</span>
                  <span class="min-w-0 text-(--foreground)">{{ removeStatusToString(bookCopy.withdrawn_reason) }}</span>
                </div>
                <div v-if="bookCopy.status === 'WITHDRAWN' && userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">下架时间</span>
                  <span class="min-w-0 text-(--foreground)">{{ bookCopy.withdrawn_time }}</span>
                </div>
              </div>
              <!-- 入库信息 -->
              <div v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN'" class="mt-3 space-y-1.5 rounded-lg bg-(--muted)/50 p-3">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-xs font-medium uppercase tracking-wide text-(--muted-foreground)">入库信息</p>
                  <button type="button" @click="popupStore.open('editBookCopy', { bookCopyId: bookCopy.id, purchasePrice: bookCopy.purchase_price, purchaseDate: bookCopy.purchase_date, source: bookCopy.source }, editBookCopyCallback)" aria-label="编辑分类" class="ml-0.5 text-(--accent-foreground)/70 hover:text-(--accent-foreground) active:not-aria-[haspopup]:translate-y-px transition-all">
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
                    <a class="text-(--primary) underline-offset-2 hover:underline" :href="'/user/' + bookCopy.entry_by">{{ idUsernameMapping[bookCopy.entry_by] }}</a>
                  </span>
                </div>
                <div class="flex gap-2 text-sm">
                  <span class="w-24 shrink-0 text-(--muted-foreground)">入库时间</span>
                  <span class="min-w-0 text-(--foreground)">{{ bookCopy.create_time }}</span>
                </div>
              </div>
              <!-- 操作按钮 -->
              <div class="mt-4 flex flex-wrap gap-2">
                <!-- 可借阅状态按钮 - 借出 -->
                <button v-if="bookCopy.status === 'AVAILABLE' && userStore.user_is_admin && bookCopy.role === 'ADMIN'" type="button" @click="popupStore.open('borrow', { id: bookCopy.id }, borrowCallback)" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 gap-1.5">
                  <BookUp class="size-3.5"/>
                  借出
                </button>
                <!-- 可借阅状态按钮 - 下架 -->
                <button v-if="bookCopy.status === 'AVAILABLE' && userStore.user_is_admin && bookCopy.role === 'ADMIN'" type="button" @click="popupStore.open('withdrawn', { id: bookCopy.id }, withdrawnCallback)" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-(--border) bg-(--background) hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 gap-1.5">
                  <ArrowDownToLine class="size-3.5"/>
                  下架
                </button>
                <!-- 已借出状态按钮 - 归还 -->
                <button v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN' && bookCopy.status === 'UNAVAILABLE'" type="button" @click="popupStore.open('returnBook', { id: bookCopy.current_borrow_record.id }, returnBookCallback)" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-(--border) bg-(--background) hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 gap-1.5">
                  <BookDown class="size-3.5"/>
                  归还
                </button>
                <!-- 已借出状态按钮 - 续借 -->
                <button v-if="bookCopy.status === 'UNAVAILABLE' && bookCopy.current_borrow_record" type="button" @click="renew(bookCopy.current_borrow_record.id)" :data-disabled="bookCopy.current_borrow_record.is_renewed" tabindex="0" :disabled="bookCopy.current_borrow_record.is_renewed" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-(--border) bg-(--background) hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 gap-1.5">
                  <RefreshCw class="size-3.5"/>
                  {{ bookCopy.current_borrow_record.is_renewed ? '已续借' : '续借' }}
                </button>
                <!-- 已下架状态按钮 - 重新上架 -->
                <button v-if="userStore.user_is_admin && bookCopy.role === 'ADMIN' && bookCopy.status === 'WITHDRAWN'" type="button" @click="popupStore.open('relist', { id: bookCopy.id }, relistCallback)" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-(--border) bg-(--background) hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:border-(--input) dark:bg-(--input)/30 dark:hover:bg-(--input)/50 h-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 gap-1.5">
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
        <!-- 已登录，且未发表过书评 -->
        <form v-if="authStore.isLoggedIn && !hasWrittenBookReview" class="rounded-xl border border-(--border) bg-(--card) p-4">
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