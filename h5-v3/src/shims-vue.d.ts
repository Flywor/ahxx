declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// window全局变量声明添加
interface Window {
  pinus: any // pinus demo给出的实例，没有types版本
}
