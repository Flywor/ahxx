import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/MainPage')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
