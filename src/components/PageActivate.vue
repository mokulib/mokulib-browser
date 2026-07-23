<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElLoading } from "element-plus";
import { CircleAlert, CircleCheck, CircleX, GlobeX } from "@lucide/vue";
import api from "@/api";

const { token } = defineProps(['token'])

const status = ref<'ACTIVATING' | 'OK' | 'ERROR' | 'NETWORK_ERROR'>('ACTIVATING');
const message = ref('激活中，请稍候');

onMounted(async () => {
  // 设置加载遮罩
  const loading = ElLoading.service({
    lock: true,
    text: '',
    background: 'rgba(0, 0, 0, 0.5)',
  })
  // 请求
  const data = await api.post('/api/auth/activate/' + token);
  // 处理（增加延迟以避免屏幕闪烁）
  setTimeout(() => {
    status.value = data.status as 'OK' | 'ERROR' | 'NETWORK_ERROR'
    message.value = data.message
    loading.close()
  }, 1000)
})
</script>

<template>
  <main class="flex-1 flex flex-col items-center justify-center">
    <div class="mb-6 px-1 pb-1 border-b border-(--border)">
      <h1 class="font-serif text-2xl text-(--muted-foreground)">账户激活</h1>
    </div>

    <div v-if="status === 'ACTIVATING'" class="flex flex-col items-center gap-4 text-(--muted-foreground)">
      <CircleAlert class="size-14"/>
      <p class="font-serif text-2xl font-semibold">{{ message }}</p>
    </div>

    <div v-if="status === 'OK'" class="flex flex-col items-center gap-4 text-green-700">
      <CircleCheck class="size-14"/>
      <p class="font-serif text-2xl font-semibold">{{ message }}</p>
    </div>

    <div v-if="status === 'ERROR'" class="flex flex-col items-center gap-4 text-red-700">
      <CircleX class="size-14"/>
      <p class="font-serif text-2xl font-semibold">{{ message }}</p>
    </div>

    <div v-if="status === 'NETWORK_ERROR'" class="flex flex-col items-center gap-4 text-(--muted-foreground)">
      <GlobeX class="size-14"/>
      <p class="font-serif text-2xl font-semibold">{{ message }}</p>
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