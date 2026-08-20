import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth.ts";
import { usePopupStore } from "@/stores/popup.ts";

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
      async beforeEnter() {
        const authStore = useAuthStore();
        const isLoggedIn: boolean = await authStore.ping(); // 使用 await 等待异步函数返回结果

        if (isLoggedIn) {
          return { name: 'home' };
        } else {
          return true;
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
      async beforeEnter() {
        const authStore = useAuthStore();

        if (authStore.isLoggedIn) // 强制登出
          authStore.logout();

        return true;
      }
    },
    {
      path: '/profile',
      redirect: { name: 'profile-my' },
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        requiresAuth: true,
        redirectToHomeOnLogout: true,
      },
      children: [
        {
          path: 'my',
          name: 'profile-my',
          component: () => import('@/views/profile/ProfileMyView.vue'),
        },
        {
          path: 'borrowing',
          name: 'profile-borrowing',
          component: () => import('@/views/profile/ProfileBorrowingView.vue'),
        },
        {
          path: 'favorite',
          name: 'profile-favorite',
          component: () => import('@/views/profile/ProfileFavoriteView.vue'),
        },
        {
          path: 'history',
          name: 'profile-history',
          component: () => import('@/views/profile/ProfileHistoryView.vue'),
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
      path: '/borrow-record/:id',
      name: 'borrow-record',
      component: () => import('@/views/BorrowRecordView.vue'),
      props: true, // 将路径参数作为 props 传递给组件
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
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
router.beforeEach(async (to) => {
  // 关闭弹窗
  usePopupStore().close();
  // 根据需要验证登录状态
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要登录，进行验证
    const authStore = useAuthStore()
    const isLoggedIn: boolean = await authStore.ping();

    if (!isLoggedIn) { // 如果未登录
      return { name: 'login' }; // 跳转到登录页
    }
  }
  // 允许导航
  return true;
})

export default router
