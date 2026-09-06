import { createApp, type App } from 'vue'
import MessageContainer from './MessageContainer.vue'
import type { MessageType } from './Message.vue'

interface MessageOptions {
  content: string          // 消息文本内容
  type?: MessageType       // 消息类型，可选，默认为 'info'
  duration?: number        // 显示时长（毫秒），可选，默认 3000
  closable?: boolean       // 是否显示关闭按钮，可选，默认 false
}

let containerInstance: any = null   // MessageContainer 组件实例
let containerApp: App | null = null // Vue 应用实例

// 获取或创建消息容器
const getContainer = () => {
  if (containerInstance) return containerInstance

  // 创建容器实例
  const div = document.createElement('div')
  document.body.appendChild(div)

  containerApp = createApp(MessageContainer)
  containerInstance = containerApp.mount(div)

  return containerInstance
}

const showMessage = (options: MessageOptions) => {
  const container = getContainer()
  return container.addMessage({
    content: options.content,
    type: options.type || 'info',
    duration: options.duration !== undefined ? options.duration : 3000,
    closable: options.closable !== undefined ? options.closable : false,
  })
}

export const Message = {
  success: (content: string, duration?: number) =>
    showMessage({ content, type: 'success', duration }),

  error: (content: string, duration?: number) =>
    showMessage({ content, type: 'error', duration }),

  warning: (content: string, duration?: number) =>
    showMessage({ content, type: 'warning', duration }),

  info: (content: string, duration?: number) =>
    showMessage({ content, type: 'info', duration }),

  loading: (content: string, duration?: number) =>
    showMessage({ content, type: 'loading', duration: duration || 0 }),

  close: (id: string | number) => {
    const container = getContainer()
    container.removeMessage(id)
  },

  clear: () => {
    const container = getContainer()
    container.clear()
  },
}
