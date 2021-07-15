import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { store, key } from '@/store'
import '@/theme/index.less'
import Loading from '@/plugins/loading'
import Msg from '@/plugins/msg'

const isMobile = /Android|webOS|iPhone|iPod/i.test(navigator.userAgent)
const resetRem = () => {
  const html = document.getElementsByTagName('html')[0]
  html.style.fontSize = `${document.documentElement.clientHeight / 750 * 100}px`
}
const resetWidth = () => {
  const clientHeight = document.documentElement.clientHeight
  document.body.style.width = `${clientHeight / 1.7777777}px`
}
window.onresize = () => {
  if(!isMobile) {
    resetWidth()
  }
}
resetRem()
if(!isMobile) {
  resetWidth()
}

const app = createApp(App)
app.use(store, key)
app.use(router)

Loading.install(app)
Msg.install(app)

app.mount('#app')
