import 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 标题
    title?: string | ((to: RouteLocationNormalized) => string) | ((to: RouteLocationNormalized) => Promise<string>)
    // 是否隐藏 Header
    hideHeader?: boolean
    // 是否隐藏 Footer
    hideFooter?: boolean
    // 是否使用简单模式的 Footer
    simpleFooter?: boolean
    // 是否需要登录
    requiresAuth?: boolean
    // 在未登录的情况下，是否需要强制跳转到登录页面
    redirectToHomeOnLogout?: boolean
  }
}