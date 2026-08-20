<script setup lang="ts">
import Popup from "@/components/popup/core/Popup.vue";
import api from "@/api";
import { onMounted, ref } from "vue";
import type { Book, Category } from "@/types";
import { usePopupStore } from "@/stores/popup.ts";

const categories = ref<Category[]>([]);
const input = ref<Book>({ id: 0, isbn: "", category_id: 0, title: "", subtitle: "", author: "", publisher: "", publish_date: "", edition: "", page_count: 0, language: "zh", description: "", price: 0 });

function confirmHandler() {
  return api.post<number>("/api/books", input.value);
}

onMounted(() => {
  usePopupStore().registerInitHook("addBook", async () => {
    categories.value = (await api.get<Category[]>("/api/categories")).data.sort((a, b) => a.id - b.id);
    input.value.category_id = categories.value[0]?.id ?? 0;
    input.value.language = "zh";
  });
})
</script>

<template>
  <Popup popup-key="addBook" title="录入新书" confirm-text="保存" :confirm-handler="confirmHandler">
    <form class="max-h-[50vh] space-y-3 overflow-y-auto pl-1 pr-1 pb-1">
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          ISBN
        </label>
        <input id="isbn" v-model="input.isbn" type="text" placeholder="ISBN" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40"/>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          分类
        </label>
        <select id="category" v-model="input.category_id" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40">
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          标题
        </label>
        <input id="title" v-model="input.title" type="text" placeholder="标题" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40"/>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          作者
        </label>
        <input id="author" v-model="input.author" type="text" placeholder="作者" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40"/>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          出版社
        </label>
        <input id="publisher" v-model="input.publisher" type="text" placeholder="出版社" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40"/>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          出版日期
        </label>
        <input id="publish_date" v-model="input.publish_date" type="date" placeholder="出版日期" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40"/>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          版次
        </label>
        <input id="edition" v-model="input.edition" type="text" placeholder="版次" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40"/>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          页数
        </label>
        <input id="page_count" v-model="input.page_count" type="number" placeholder="页数" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40"/>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          语言
        </label>
        <select id="language" v-model="input.language" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40">
          <option value="zh">中文</option>
          <option value="en">英文</option>
        </select>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          价格
        </label>
        <input id="price" v-model="input.price" type="number" placeholder="价格" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40"/>
      </div>
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          描述
        </label>
        <textarea id="description" v-model="input.description" rows="5" placeholder="描述" class="w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40"></textarea>
      </div>
    </form>
  </Popup>
</template>

<style scoped>

</style>