import axios from 'axios'
import router from '@/router'
import { message, notification, Modal } from 'ant-design-vue'
import { store } from '@/store'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8088/api': 'http://119.91.99.233:8088/api',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    config.headers = {
      token: localStorage.getItem('token') || ''
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const data = response.data
    if (data.status == -1) {
      router.push('/login')
      localStorage.removeItem('token')
      throw data
    }
    if (data.status != 200) {
      message.error(data.statusText || '系统异常常常')
      throw data
    }
    if (data.data) {
      if (data.data.player) {
        store.commit('setPlayer', data.data.player)
      }
      if (data.data.pos) {
        store.commit('setPos', data.data.pos)
      }
      if (data.data.mapUnits) {
        store.commit('setUnits', data.data.mapUnits)
      }
      if (data.data.skillList) {
        store.commit('setSkillList', data.data.skillList)
      }
      if (data.data.equipList) {
        store.commit('setEquipList', data.data.equipList)
      }
      if (data.data.goodsList) {
        store.commit('setGoodsList', data.data.goodsList)
      }
      if (data.data.confirm) {
        const { title, content, tid } = data.data.confirm
        if (tid) {
          Modal.info({
            title,
            content,
            okText: '没问题！',
            onOk() {
              service({ url: '/task', method: 'post', data: { tid } })
            }
          })
        } else {
          Modal.info({ title, content, okText: '哦' })
        }
      }
      if (data.data.goodsNews) {
        notification.success({
          message: '任务完成！',
          description: data.data.goodsNews
        })
      }
      if (data.data.normalNews) {
        message.info(data.data.normalNews)
      }
    }
    return response.data
  },
  error => {
    console.log('接口错误：', error)
    return Promise.reject(error)
  }
)

export default service
