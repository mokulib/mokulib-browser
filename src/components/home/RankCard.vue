<script setup lang="ts">
import { ref } from "vue";
import { useBookStore } from "@/stores/book.ts";
import { useRouter } from "vue-router";

defineProps({
  title: { type: String, required: true },
  backgroundImage: { type: String, required: true },
  backgroundImageDark: { type: String, required: true },
  rank: { type: Array as () => number[], required: true },
})

const router = useRouter();
const bookStore = useBookStore();

const activatedIndex = ref<number>(0);
</script>

<template>
  <div class="flex flex-col p-4 rounded-lg bg-contain bg-top bg-no-repeat bg-white dark:bg-black shadow-[0_12px_67px_0_rgba(0,0,0,0.04)]" :class="[ `bg-[url('/${backgroundImage}')]`, `dark:bg-[url('/${backgroundImageDark}')]` ]">
    <div class="text-xl tracking-wider">{{ title }}</div>
    <div class="mt-0.5 mb-4 text-xs text-(--muted-foreground)/60">仅展示前十本，统计时间截止至04-01 24:00</div>
    <div class="flex flex-col gap-1" :class="{ 'pb-2': activatedIndex === 0 }">
      <template v-for="(bookId, index) in rank" :key="bookId">
        <div v-if="activatedIndex !== index" @click="activatedIndex = index" @mouseenter="activatedIndex = index" class="flex items-center mt-2 cursor-pointer">
          <div class="text-sm font-semibold text-(--muted-foreground)/50" :class="{ 'text-[#FF5F00]': index === 0, 'text-[#00754A]': index === 1, 'text-[#D6A562]': index === 2 }">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="line-clamp-1 ml-2 text-sm">{{ bookStore.book(bookId).value?.title }}</div>
        </div>
        <div v-if="activatedIndex === index" @click="router.push({ name: 'book', params: { id: bookId } })" class="flex mt-8 first:mt-6 p-4 rounded-lg bg-white dark:bg-black shadow cursor-pointer">
          <div class="text-sm font-semibold text-(--muted-foreground)/50" :class="{ 'text-[#FF5F00]': index === 0, 'text-[#00754A]': index === 1, 'text-[#D6A562]': index === 2 }">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="flex-1 flex flex-col ml-2 mr-4 gap-2">
            <div class="line-clamp-1 text-sm">{{ bookStore.book(bookId).value?.title }}</div>
            <div class="line-clamp-1 text-xs">{{ bookStore.book(bookId).value?.author }}</div>
            <div class="line-clamp-2 text-xs">{{ bookStore.book(bookId).value?.description }}</div>
          </div>
          <img :src="`/books/${bookId}`" class="w-26 aspect-3/4 object-cover -mt-12 -mb-2 rounded shadow" :alt="bookStore.book(bookId).value?.title"/>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>