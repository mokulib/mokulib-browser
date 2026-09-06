<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Loader, CircleCheck, CircleX, GlobeX } from "@lucide/vue";
import api from "@/api";

const { token } = defineProps(['token'])

const status = ref<'ACTIVATING' | 'OK' | 'ERROR' | 'NETWORK_ERROR'>('ACTIVATING');
const statusClass = computed(() => {
  switch (status.value) {
    case 'ACTIVATING': return 'text-(--muted-foreground)'
    case 'OK': return 'text-green-700'
    case 'ERROR': return 'text-red-700'
    case 'NETWORK_ERROR': return 'text-(--muted-foreground)'
  }
})
const statusIcon = computed(() => {
  switch (status.value) {
    case 'ACTIVATING': return Loader
    case 'OK': return CircleCheck
    case 'ERROR': return CircleX
    case 'NETWORK_ERROR': return GlobeX
  }
})
const message = ref('激活中，请稍候');

onMounted(async () => {
  // 请求
  const data = await api.post('/api/auth/activate/' + token);
  // 处理（增加延迟以避免屏幕闪烁）
  setTimeout(() => {
    status.value = data.status as 'OK' | 'ERROR' | 'NETWORK_ERROR'
    message.value = data.message
  }, 1000)
})
</script>

<template>
  <main class="flex-1 flex flex-col items-center justify-center">
    <div class="mb-6 px-1 pb-1 border-b border-(--border)">
      <h1 class="font-serif text-2xl text-(--muted-foreground)">账户激活</h1>
    </div>

    <div class="flex flex-col items-center gap-4 text-(--muted-foreground)">
      <status-icon class="size-14" :class="[ statusClass, status === 'ACTIVATING' ? 'animate-spin [animation-duration:3s]' : '' ]"/>
      <p class="font-serif text-2xl font-semibold" :class="statusClass">{{ message }}</p>
    </div>

    <div class="mt-6 pt-1 px-1 border-t border-(--border) text-center text-sm text-(--muted-foreground)">
      <p v-if="status === 'ACTIVATING'">正在激活，请稍候...</p>
      <p v-if="status === 'OK'">激活成功！<a class="text-(--primary) transition-colors hover:opacity-80" href="/login">立即登录</a></p>
      <p v-if="status === 'ERROR'">激活码过期？ <a class="text-(--primary) transition-colors hover:opacity-80" href="/login">重新注册</a></p>
      <p v-if="status === 'NETWORK_ERROR'">请检查网络连接，<a class="text-(--primary) transition-colors hover:opacity-80" href="javascript:void(0)" onclick="location.reload()">刷新重试</a></p>
    </div>
  </main>
</template>

<style scoped>

</style>