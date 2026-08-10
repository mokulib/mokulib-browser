<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();

const currentRouteOptions = computed(() => router.options.routes.find(r => r.name === 'profile'));
</script>

<template>
  <main class="flex-1">
    <!-- 横幅 -->
    <div class="mx-auto max-w-6xl px-4 pt-12 md:px-8 md:pt-16">
      横幅
    </div>

    <!-- tab -->
    <div class="flex mx-auto max-w-6xl px-4 pt-12 md:px-8 md:pt-16 border-b border-(--border) gap-2">
      <RouterLink v-for="route in currentRouteOptions?.children" :key="route.name" :to="{ name: route.name }"
                  class="px-4 py-2 text-sm font-medium transition-all rounded-t-lg hover:bg-(--muted)"
                  active-class="text-(--primary) border-b-2 border-(--primary)"
                  inactive-class="text-(--muted-foreground)"
      >
        <component :is="route.meta?.icon"/>
        {{ route.meta?.label }}
      </RouterLink>
    </div>

    <div class="mx-auto max-w-6xl px-4 pt-12 md:px-8 md:pt-16">
      <RouterView/>
    </div>
  </main>
</template>

<style scoped>

</style>