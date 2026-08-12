<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const navItems = [
  { route: 'profile-my', title: "我的墨库" },
  { route: 'profile-borrowing', title: "我的借阅" },
  { route: 'profile-favorite', title: "好书收藏" },
  { route: 'profile-history', title: "借阅过的好书" }
]
</script>

<template>
  <!-- 宽屏：横幅 + (路由 + 组件) -->
  <main class="flex-1 hidden sm:block">
    <!-- 横幅 -->
    <div class="mx-auto max-w-6xl flex px-4 md:px-8 py-12">
      横幅
    </div>

    <!-- 主区域 -->
    <div class="mx-auto max-w-6xl flex px-4 pb-4 md:px-8 md:pb-8 gap-4 md:gap-8">
      <!-- 路由 -->
      <aside class="flex flex-col mx-auto max-w-6xl gap-2">
        <template v-for="navItem in navItems" :key="navItem.route">
          <!-- 按钮 -->
          <RouterLink :to="{ name: navItem.route }"
                      class="pl-3 pr-8 md:pr-16 py-2 rounded-lg text-sm text-(--foreground) transition-transform duration-300"
                      :class="{ 'hover:bg-(--secondary) hover:-translate-y-0.5': route.name !== navItem.route }"
                      active-class="font-bold text-(--primary) bg-(--primary)/8">
            {{ navItem.title }}
          </RouterLink>
        </template>
      </aside>
      <!-- 组件 -->
      <section class="flex-1">
        <RouterView/>
      </section>
    </div>
  </main>

  <!-- 窄屏：组件 -->
  <main class="flex-1 block sm:hidden">
    <RouterView/>
  </main>
</template>

<style scoped>

</style>