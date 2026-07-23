<script setup lang="ts">
import { useUserStore } from "@/stores/user.ts";
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();

const userStore = useUserStore();

const currentRouteOptions = computed(() => router.options.routes.find(r => r.name === 'profile'));
</script>

<template>
  <main class="flex-1">
    <!-- 标题 -->
    <section class="mx-auto max-w-6xl px-4 pt-12 md:px-8 md:pt-16">
      <div class="flex justify-between">
        <div class="flex">
          <img :src="userStore.user_avatar" alt="avatar" class="size-16">
          <div class="flex flex-col">
            <span>{{ userStore.user_username }}</span>
            <span>{{ userStore.user_email }}</span>
          </div>
        </div>
        <button>
          编辑资料
        </button>
      </div>
      <div>
        {{ userStore.user_bio ?? '暂无简介' }}
      </div>
    </section>

    <!-- tab -->
    <section class="flex mx-auto max-w-6xl px-4 pt-12 md:px-8 md:pt-16 border-b border-(--border) gap-2">
      <RouterLink v-for="route in currentRouteOptions?.children?.slice(1, 4)" :key="route.name" :to="{ name: route.name }"
                  class="px-4 py-2 text-sm font-medium transition-all rounded-t-lg hover:bg-(--muted)"
                  active-class="text-(--primary) border-b-2 border-(--primary)"
                  inactive-class="text-(--muted-foreground)"
      >
        <component :is="route.meta?.icon"/>
        {{ route.meta?.label }}
      </RouterLink>
    </section>

    <section class="mx-auto max-w-6xl px-4 pt-12 md:px-8 md:pt-16">
      <RouterView/>
    </section>
  </main>
</template>

<style scoped>

</style>