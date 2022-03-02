import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { store, key } from '@/store'
import '@/theme/index.less'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)

// vue全局变量声明添加
interface LoadingModel {
  show: () => void
  hide: () => void
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $loading: LoadingModel
  }
}

app.config.globalProperties.$loading = {
  el: document.getElementById('loading'),
  show() {
    if (this.el) {
      this.el.style.opacity = '1'
      this.el.style.display = 'block'
    }
  },
  hide() {
    if (this.el) {
      this.el.style.opacity = '0'
      this.el.style.display = 'none'
    }
  }
}

app.use(store, key)
app.use(router)
app.use(Antd)
app.mount('#app')

document.getElementById('loading')?.remove()
