
import { sleep } from './tools'
import RouteHooks from '@/api/gameRouteHooks'
import { store } from '@/store'
import WSPack from '@/types/WSPack'
const pinus = window.pinus
let ok = false

// 查找可用服务器
function queryEntry(username: string, callback: (host: string, port: string) => void) {
  pinus.init({
    // host: '8.135.60.250',
    host: '127.0.0.1',
    // port: 13761,
    port: '4000',
    log: true
  }, function() {
    pinus.request('gate.gateHandler.entry', {
      username
    }, function({ code, data, msg }: WSPack) {
      pinus.disconnect()
      if (code === 500) {
        console.error(msg)
        return
      }
      callback(data.host, data.port)
    })
  })
}

Object.keys(RouteHooks).map(route => {
  pinus.on(route, RouteHooks[route])
})

// pinus.on('close', (a) => {
//   if (ok) {
//     Modal.confirm({
//       content: '连接已断开',
//       centered: true,
//       maskClosable: false,
//       cancelText: 'who cares?',
//       closable: false,
//       okText: '返回登录',
//       onOk() {
//         location.reload()
//       }
//     })
//   }
// })

export default {
  login(userdata: { username: string, password: string }) {
    return new Promise((r, j) => {
      queryEntry(userdata.username, function(host, port) {
        pinus.init({
          host: host,
          port: port,
          log: true
        }, function() {
          pinus.request('connector.entryHandler.entry', userdata, function(data: WSPack) {
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
  async send(route: string, data?: any) {
    await sleep(() => ok)
    return new Promise((resolve, reject) => {
      pinus.request(route, data, (data: WSPack) => {
        if (data.code !== 200) {
          reject()
        } else {
          resolve(data)
        }
      })
    })
  }
}
