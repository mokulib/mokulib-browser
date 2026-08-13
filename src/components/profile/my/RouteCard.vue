<script setup lang="ts">
import { ChevronRight } from "@lucide/vue";
import { computed, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  title: { type: String, required: true },
  route: { type: String, required: true },
  emptyText: { type: String, required: true },
  emptyIcon: { type: [ Object, Function ], required: true },
  bookList: { type: Array<{id: number, title: string}>, required: true },
});

const router = useRouter();

const isEmpty = computed(() => props.bookList.length === 0);
const enableSlideshow = computed(() => props.bookList.length > 1);
const nextIndex = ref<number>(1)

const aCardData = ref<{id: number, title: string}>({ id: 0, title: '' })
const bCardData = ref<{id: number, title: string}>({ id: 0, title: '' })

const aCardClass = ref(['translate-x-0'])
const bCardClass = ref(['translate-x-full'])
const isACard = ref(true)

const translateCard = () => {
  nextIndex.value = (nextIndex.value + 1) % props.bookList.length
  if (isACard.value) {
    isACard.value = false
    aCardClass.value = ['-translate-x-full'] // a 离开
    bCardClass.value = ['translate-x-0', 'opacity-100'] // b 进来
  } else {
    isACard.value = true
    aCardClass.value = ['translate-x-0', 'opacity-100'] // a 进来
    bCardClass.value = ['-translate-x-full'] // b 离开
  }
  setTimeout(() => {
    if (isACard.value) { // a 已经进入
      bCardClass.value = ['translate-x-full', 'opacity-0'] // b 进入待入区
      bCardData.value = props.bookList[nextIndex.value]!;
    } else {
      aCardClass.value = ['translate-x-full', 'opacity-0'] // a 进入待入区
      aCardData.value = props.bookList[nextIndex.value]!;
    }
  }, 500)
}

let translateCardInterval: any = null;

const startSlideshow = () => {
  translateCardInterval = setInterval(translateCard, 3000);
}

const stopSlideshow = () => {
  clearInterval(translateCardInterval);
}

watch(() => props.bookList, () => {
  // 无数据返回
  if (isEmpty.value)
    return;
  // 准备首个数据 ACard
  aCardData.value = props.bookList[0]!;
  // 多个数据，准备 BCard，初始化坐标，添加切换任务
  if (enableSlideshow.value) {
    // 准备 BCard
    bCardData.value = props.bookList[1]!;
    // 初始化坐标
    aCardClass.value = ['translate-x-0', 'opacity-100'] // a 进来
    bCardClass.value = ['translate-x-full', 'opacity-0'] // b 进入待入区
    // 添加切换任务
    startSlideshow()
  }
}, { immediate: true })

onUnmounted(() => stopSlideshow())
</script>

<template>
  <div class="flex-1 flex flex-col px-4 pt-4 pb-5 gap-4 rounded-lg bg-(--muted)/80">
    <!-- 标题 -->
    <div @click="router.push({ name: route })" class="flex items-center text-(--foreground) cursor-pointer hover:text-(--primary)">
      <p class="text-sm font-semibold tracking-wide">{{ props.title }}</p>
      <ChevronRight class="size-4"/>
    </div>

    <!-- 卡片 -->
    <div class="relative min-w-26 w-full overflow-hidden">
      <!-- 占位卡片 -->
      <div class="flex flex-col items-center gap-2" :class="{ 'opacity-0': isEmpty || enableSlideshow }">
        <div class="rounded overflow-hidden">
          <img :src="`/books/${aCardData.id}`" alt="图书封面" class="size-26"/>
        </div>
        <p class="line-clamp-1 tracking-wide text-sm text-center">{{ aCardData.title }}</p>
      </div>
      <!-- 缺省卡片 -->
      <div v-if="isEmpty" class="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <component :is="emptyIcon" class="size-8 text-(--muted-foreground)/50"/>
        <p class="text-sm text-(--muted-foreground)">{{ emptyText }}</p>
        <button @click="router.push({ name: 'home'})" class="px-2 py-1 border border-(--border) rounded text-xs bg-(--background) hover:bg-(--muted) cursor-pointer">去逛逛</button>
      </div>
      <!-- 轮播卡片：第一张卡片 -->
      <div v-if="enableSlideshow" @mouseenter="stopSlideshow()" @mouseleave="startSlideshow()" @click="router.push(`/book/${aCardData.id}`)" class="absolute inset-0 flex flex-col items-center gap-2 transition-transform duration-500 ease-in-out cursor-pointer" :class="aCardClass">
        <div class="rounded overflow-hidden">
          <img :src="`/books/${aCardData.id}`" alt="图书封面" class="size-26"/>
        </div>
        <p class="line-clamp-1 tracking-wide text-sm text-center">{{ aCardData.title }}</p>
      </div>
      <!-- 轮播卡片：第二张卡片 -->
      <div v-if="enableSlideshow" @mouseenter="stopSlideshow()" @mouseleave="startSlideshow()" @click="router.push(`/book/${bCardData.id}`)" class="absolute inset-0 flex flex-col items-center gap-2 transition-transform duration-500 ease-in-out cursor-pointer" :class="bCardClass">
        <div class="rounded overflow-hidden">
          <img :src="`/books/${bCardData.id}`" alt="图书封面" class="size-26"/>
        </div>
        <p class="line-clamp-1 tracking-wide text-sm text-center">{{ bCardData.title }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>