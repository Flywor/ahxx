declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// window全局变量声明添加
interface Window {
  showShop: any
  token: any 
  echarts: any
}
