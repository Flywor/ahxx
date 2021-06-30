import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import stote from './store/index'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/Manager']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (stote.state.isLogin || whiteList.includes(to.path)) {
    next()
  } else {
    next('/login')
  }
})
router.afterEach(() => {
  NProgress.done()
})
