
import { sleep } from './tools'
import RouteHooks from '../api/gameRouteHooks'
import store from '../store/index'
import { message } from 'ant-design-vue'
const pinus = window.pinus
let ok = false

// 查找可用服务器
function queryEntry(username, callback) {
  pinus.init({
    // host: '8.135.60.250',
    host: process.env.VUE_APP_WS_IP,
    // port: 13761,
    port: process.env.VUE_APP_WS_PORT,
    log: true
  }, function() {
    pinus.request('gate.gateHandler.entry', {
      username
    }, function(data) {
      pinus.disconnect()
      if (data.code === 500) {
        console.error(data.msg)
        message.error(data.msg || '服务器繁忙')
        return
      }
      callback(data.host, data.port)
    })
  })
}

Object.keys(RouteHooks).map(route => {
  pinus.on(route, RouteHooks[route])
})

export default {
  login(userdata) {
    return new Promise((r, j) => {
      queryEntry(userdata.username, function(host, port) {
        pinus.init({
          host: host,
          port: port,
          log: true
        }, function() {
          pinus.request('connector.entryHandler.entry', userdata, function(data) {
            if (data.code !== 200) {
              console.error(data.msg)
              j(data)
            } else {
              ok = true
              store.commit('setLogin', true)
              r(data)
            }
          })
        })
      })
    })
  },
  async send(route, data) {
    await sleep(() => ok)
    return new Promise((resolve, reject) => {
      pinus.request(route, data, (data) => {
        if (data.code !== 200) {
          message.error(data.msg)
          reject()
        } else {
          resolve(data)
        }
      })
    })
  }
}
