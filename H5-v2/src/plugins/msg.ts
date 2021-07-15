import { App, createApp, h } from "vue"
import Msg from '@/components/Msg.vue'

// vue全局变量声明添加
interface MsgModel {
  show: (txt: string) => void
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $msg: MsgModel
  }
}

export default{
  install: (app: App<Element>) => {
    app.config.globalProperties.$msg = {
      el: document.getElementById('loading'),
      show(txt: string) {
        const msgInstance = createApp(Msg, { txt })
        const mountNode = document.createElement('div')
        document.body.appendChild(mountNode)
        msgInstance.mount(mountNode)

        setTimeout(() => {
          msgInstance.unmount()
          document.body.removeChild(mountNode)
        }, 3000)
      }
    }
  }
}