import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { store, key } from '@/store'
import '@/theme/index.less'

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
    }
  },
  hide() {
    if (this.el) {
      this.el.style.opacity = '0'
    }
  }
}
console.log( import.meta.env.VUE_APP_WS_IP)
app.use(store, key)
app.use(router)
app.mount('#app')
