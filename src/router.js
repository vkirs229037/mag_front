import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/login', component: () => import('@/components/LoginForm.vue'), meta: { guest: true } },
  { path: '/register', component: () => import('@/components/RegisterForm.vue'), meta: { guest: true } },
  { 
    path: '/', 
    component: () => import('@/components/UserProfile.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/users', 
    component: () => import('@/components/UserList.vue'),
    meta: { requiresAuth: true, adminOnly: true }
  },
  { 
    path: '/files', 
    component: () => import('@/components/FileBrowser.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/search', 
    component: () => import('@/components/LogSearch.vue'),
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }
  
  if (to.meta.adminOnly && !auth.isAdmin) {
    return next('/')
  }

  if (to.meta.adminOnly) {
    if (auth.token && !auth.user) {
      try {
        auth.fetchUser()
      } catch {
        return next("/login")
      }
    }
    if (!auth.isAdmin) {
      return next("/")
    }
  }
  
  if (to.meta.guest && auth.isAuthenticated) {
    return next('/')
  }
  
  next()
})

export default router