import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        requiresAuth: false, // 使用局部路由守卫进行验证，禁用全局路由守卫验证
        hideHeader: true,
        hideFooter: true,
      },
      // 局部路由守卫
      async beforeEnter(to, from, next) {
        const authStore = useAuthStore();
        const isLoggedIn: boolean = await authStore.ping(); // 使用 await 等待异步函数返回结果

        if (isLoggedIn) {
          next({ name: 'home' });
        } else {
          next();
        }
      }
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },
    // 激活账户页
    {
      path: '/activate/:token',
      name: 'activate',
      component: () => import('@/views/ActivateView.vue'),
      props: true, // 将路径参数作为 props 传递给组件
      // 局部路由守卫
      async beforeEnter(to, from, next) {
        const authStore = useAuthStore();

        if (authStore.isLoggedIn) // 强制登出
          authStore.logout();

        next();
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        requiresAuth: true,
        redirectToHomeOnLogout: true,
      },
      children: [
        {
          path: '',
          redirect: { name: 'profile-home' },
        },
        {
          path: 'borrowing',
          name: 'profile-home',
          component: () => import('@/views/profile/ProfileHomeView.vue'),
          meta: {
            label: '借阅中'
          }
        },
        {
          path: 'wishlist',
          name: 'profile-wishlist',
          component: () => import('@/views/profile/ProfileWishlistView.vue'),
          meta: {
            label: '心愿单'
          }
        },
        {
          path: 'history',
          name: 'profile-history',
          component: () => import('@/views/profile/ProfileHistoryView.vue'),
          meta: {
            label: '历史借阅'
          }
        },
      ],
    },
    {
      path: '/security',
      name: 'security',
      component: () => import('@/views/SecurityView.vue'),
      meta: {
        requiresAuth: true,
        redirectToHomeOnLogout: true,
      },
    },
    {
      path: '/book/:id',
      name: 'book',
      component: () => import('@/views/BookView.vue'),
      props: true, // 将路径参数作为 props 传递给组件
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    // 匹配所有未定义的路由
    {
      path: '/:pathMatch(.*)*', // 通配符路由
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    }
  ],
})

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要登录，进行验证
    const authStore = useAuthStore()
    const isLoggedIn: boolean = await authStore.ping();

    if (!isLoggedIn) { // 如果未登录
      next({ name: 'login' }) // 跳转到登录页
    }
  }
  // 允许导航
  next()
})

export default router
