import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { store, key } from '@/store'
import '@/theme/index.less'
import Loading from '@/plugins/loading'
import Msg from '@/plugins/msg'

const app = createApp(App)

Loading.install(app)
Msg.install(app)

const isMobile = /Android|webOS|iPhone|iPod/i.test(navigator.userAgent)
const handleWinResize = () => {
  if (!isMobile) {
    const html = document.getElementsByTagName('html')[0]
    html.style.fontSize = `${document.documentElement.clientHeight / 750 * 100}px`
    const clientHeight = document.documentElement.clientHeight
    document.body.style.width = `${clientHeight / 1.7777777}px`
  }
}
window.onresize = handleWinResize
handleWinResize()

app.use(store, key)
app.use(router)
app.mount('#app')
