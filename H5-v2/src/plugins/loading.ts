import { App } from "vue"

// vue全局变量声明添加
interface LoadingModel {
  show: (txt?: string) => void
  hide: () => void
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $loading: LoadingModel
  }
}

export default{
  install: (app: App<Element>) => {
    app.config.globalProperties.$loading = {
      el: document.getElementById('loading'),
      txtel: document.getElementById('loadingtxt'),
      show(txt = '加载中...') {
        if (this.el) {
          this.el.style.opacity = '1'
          this.el.style.display = 'block'
        }
        if (this.txtel) {
          this.txtel.innerText = txt
          this.txtel.style.display = 'block'
        }
      },
      hide() {
        if (this.el) {
          this.el.style.opacity = '0'
          this.el.style.display = 'none'
        }
        if (this.txtel) {
          this.txtel.style.display = 'none'
        }
      }
    }
  }
}