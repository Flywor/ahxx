export default [
  {
    path: '/',
    name: 'login',
    meta: {
      name: '登录'
    },
    component: () => import('@/views/login.vue')
  }, {
    path: '/home',
    name: 'home',
    meta: {
      name: '洞天福地'
    },
    component: () => import('@/views/home.vue')
  }, {
    path: '/battle',
    name: 'battle',
    meta: {
      name: '战斗'
    },
    component: () => import('@/views/battle.vue')
  }
]