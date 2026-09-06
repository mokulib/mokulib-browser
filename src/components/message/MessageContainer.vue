<script setup lang="ts">
import { ref } from 'vue'
import Message, { type MessageType } from './Message.vue'

export interface MessageItem {
  id: string | number
  content: string
  type: MessageType
  duration?: number
  closable?: boolean
}

const messages = ref<MessageItem[]>([])
let idCounter = 0

const addMessage = (options: Omit<MessageItem, 'id'>) => {
  const id = ++idCounter
  messages.value.push({ ...options, id })
  return id
}

const removeMessage = (id: string | number) => {
  const index = messages.value.findIndex(m => m.id === id)
  if (index > -1) {
    messages.value.splice(index, 1)
  }
}

const clear = () => {
  messages.value = []
}

defineExpose({
  addMessage,
  removeMessage,
  clear,
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      <div v-for="msg in messages" :key="msg.id" class="pointer-events-auto">
        <Message :id="msg.id" :content="msg.content" :type="msg.type" :duration="msg.duration" :closable="msg.closable" @close="removeMessage"/>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

</style>