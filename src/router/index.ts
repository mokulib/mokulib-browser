import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth.ts";
import { usePopupStore } from "@/stores/popup.ts";
import { useBookStore } from "@/stores/book.ts";

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
        title: '登录 - 墨库',
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
      meta: {
        title: '用户协议 - 墨库',
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
      meta: {
        title: '隐私政策 - 墨库',
      },
    },
    // 激活账户页
    {
      path: '/activate/:token',
      name: 'activate',
      component: () => import('@/views/ActivateView.vue'),
      props: true, // 将路径参数作为 props 传递给组件
      meta: {
        title: '激活账户 - 墨库',
        simpleFooter: true,
      },
      // 局部路由守卫
      async beforeEnter() {
        const authStore = useAuthStore();

        if (authStore.isAuthed) // 强制登出
          await authStore.logout();

        return true;
      }
    },
    {
      path: '/profile',
      redirect: { name: 'profile-my' },
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        simpleFooter: true,
        requiresAuth: true,
        redirectToHomeOnLogout: true,
      },
      children: [
        {
          path: 'my',
          name: 'profile-my',
          component: () => import('@/views/profile/ProfileMyView.vue'),
          meta: {
            title: '我的 - 墨库',
          },
        },
        {
          path: 'borrowing',
          name: 'profile-borrowing',
          component: () => import('@/views/profile/ProfileBorrowingView.vue'),
          meta: {
            title: '我的借阅 - 墨库',
          },
        },
        {
          path: 'favorite',
          name: 'profile-favorite',
          component: () => import('@/views/profile/ProfileFavoriteView.vue'),
          meta: {
            title: '好书收藏 - 墨库',
          },
        },
        {
          path: 'history',
          name: 'profile-history',
          component: () => import('@/views/profile/ProfileHistoryView.vue'),
          meta: {
            title: '借阅历史 - 墨库',
          },
        },
      ],
    },
    {
      path: '/security',
      name: 'security',
      component: () => import('@/views/SecurityView.vue'),
      meta: {
        title: '账户与安全 - 墨库',
        simpleFooter: true,
        requiresAuth: true,
        redirectToHomeOnLogout: true,
      },
    },
    {
      path: '/book/:id',
      name: 'book',
      component: () => import('@/views/BookView.vue'),
      props: true, // 将路径参数作为 props 传递给组件
      meta: {
        title: async (to) => {
          // 获取 pinia 存储
          const bookStore = useBookStore();
          // 预加载
          await bookStore.preload(Number(to.params.id));
          // 获取图书信息
          const book = bookStore.book(Number(to.params.id)).value;
          // 返回标题
          return book?.title ? `${book.title} - 墨库` : '图书不存在 - 墨库'
        },
        simpleFooter: true,
      },
    },
    {
      path: '/borrow-record/:id',
      name: 'borrow-record',
      component: () => import('@/views/BorrowRecordView.vue'),
      props: true, // 将路径参数作为 props 传递给组件
      meta: {
        simpleFooter: true,
        requiresAuth: true,
        redirectToHomeOnLogout: true,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: {
        title: '数据概览 - 墨库',
        simpleFooter: true,
        requiresAuth: true,
        redirectToHomeOnLogout: true,
      },
    },
    // 匹配所有未定义的路由
    {
      path: '/:pathMatch(.*)*', // 通配符路由
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: '404 - 墨库',
        simpleFooter: true,
      },
    }
  ],
})

// 全局路由守卫
router.beforeEach(async (to) => {
  // 设置页面标题
  if (typeof to.meta.title === 'function')
    document.title = await to.meta.title(to)
  else if (typeof to.meta.title === 'string')
    document.title = to.meta.title
  else
    document.title = '墨库 · 个人图书馆'
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
