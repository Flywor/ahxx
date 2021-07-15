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
      name: '首页'
    },
    component: () => import('@/views/home.vue')
  }
]