export default [
  {
    path: '/',
    name: 'home',
    meta: {
      name: '首页'
    },
    component: () => import('@/views/home.vue')
  }, {
    path: '/login',
    name: 'login',
    meta: {
      name: '登录'
    },
    component: () => import('@/views/login.vue')
  }
]