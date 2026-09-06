<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { X, CheckCircle, CircleX, Info, AlertTriangle, Loader } from '@lucide/vue'

export type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading'

const props = defineProps<{
  id: string | number
  content: string
  type: MessageType
  duration?: number
  closable?: boolean
}>()

const emit = defineEmits<{
  close: [id: string | number]
}>()

const isEntering = ref(false)
const isLeaving = ref(false)

const typeMap = {
  success: {
    icon: CheckCircle,
    class: 'text-green-500 bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900',
  },
  error: {
    icon: CircleX,
    class: 'text-red-500 bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900',
  },
  warning: {
    icon: AlertTriangle,
    class: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950 border-yellow-100 dark:border-yellow-900',
  },
  info: {
    icon: Info,
    class: 'text-blue-500 bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900',
  },
  loading: {
    icon: Loader,
    class: 'text-blue-500 bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900',
  },
}

let timer: ReturnType<typeof setTimeout> | null = null

const close = () => {
  if (isLeaving.value) return
  isLeaving.value = true
  setTimeout(() => {
    emit('close', props.id)
  }, 200)
}

onMounted(() => {
  // 进入动画
  requestAnimationFrame(() => {
    isEntering.value = true
  })

  // 自动关闭
  if (props.duration && props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div
    class="flex items-center gap-3 px-4 py-3 rounded-lg shadow border border-(--border) bg-(--background) min-w-32 max-w-md transition-all duration-300"
    :class="[
      typeMap[type].class,
      {
        'animate-in slide-in-from-top-4 fade-in duration-200': isEntering,
        'animate-out slide-out-to-top-4 fade-out duration-200': isLeaving,
      }
    ]"
  >
    <!-- 图标 -->
    <component :is="typeMap[type].icon" class="size-5 shrink-0" />

    <!-- 内容 -->
    <span class="flex-1 text-sm text-(--foreground)">{{ content }}</span>

    <!-- 关闭按钮 -->
    <button v-if="closable" @click="close" class="p-0.5 rounded hover:bg-(--muted) transition-colors shrink-0">
      <X class="size-4 text-(--muted-foreground)" />
    </button>
  </div>
</template>

<style scoped>

</style>