import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { store } from '@/store'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !localStorage.getItem('token')) {
    next('login')
    return
  }
  next()
})

export default router
