export const randomNum = function(minNum, maxNum = Infinity, exclude = []) {
  let result = parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
  if (exclude.length >= (maxNum - minNum)) {
    return null
  }
  if (exclude.includes(result)) {
    result = randomNum(minNum, maxNum, exclude)
  }
  return result
}

export const sleep = function(method, timeout = 10000) {
  const start = Number(Date.now())
  return new Promise((resolve, reject) => {
    (function selfRecursion() {
      setTimeout(() => {
        if (Date.now() - start > timeout) {
          return reject(`sleep timeout ${timeout}`)
        }
        let flag
        if (typeof method === 'function') {
          flag = !method()
        }
        if (typeof method === 'number') {
          if (method > timeout) {
            return reject(`堵塞时间超过arguments[1]::timeout=${timeout}`)
          }
          flag = Number(Date.now()) - start < method
        }
        if (flag) {
          selfRecursion()
        } else {
          resolve()
        }
      }, 10)
    })()
  })
}

export const formatDate = (time, format = 'yyyy-MM-dd') => {
  if (!time) return ''
  const date = new Date(time)
  const o = {
    "M+" : date.getMonth()+1, //month
    "d+" : date.getDate(),    //day
    "h+" : date.getHours(),   //hour
    "m+" : date.getMinutes(), //minute
    "s+" : date.getSeconds(), //second
    "q+" : Math.floor((date.getMonth() + 3) /3),  //quarter
    "S" : date.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp("("+ k +")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
    }
  }
  return format
}