import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App'
import 'ant-design-vue/dist/antd.css'
import 'normalize.css/normalize.css'
import './style/global.less'
import './permission'
const Antd = require('ant-design-vue')
const app = createApp(App)

app.use(store).use(router)
app.use(Antd)

app.mount('#app')
