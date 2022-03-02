export const randomNum = function(minNum: number, maxNum: number, exclude: Array<number>): number | null {
  let result = Math.round(Math.random() * (maxNum - minNum + 1) + minNum)
  if (exclude.length >= (maxNum - minNum)) {
    return null
  }
  if (exclude.includes(result)) {
    const rs = randomNum(minNum, maxNum, exclude)
    if (rs) {
      result = rs
    } else {
      return null
    }
  }
  return result
}

export const sleep = function(method: () => boolean | number, timeout = 10000) {
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
          resolve(true)
        }
      }, 10)
    })()
  })
}

export const formatDate = (time: string | number | Date, format = 'yyyy-MM-dd') => {
  if (!time) return ''
  const date = new Date(time)
  const o: { [proppName: string]: number } = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    'S': date.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  Object.keys(o).map(k => {
    if (new RegExp(`(${k})`).test(format)) {
      if (RegExp.$1.length === 1) {
        format = format.replace(RegExp.$1, `${o[k]}`)
      } else {
        format = format.replace(RegExp.$1, `00${o[k]}`.substr(`${o[k]}`.length))
      }
    }
  })
  return format
}

export const formatPercent = function(val: string | number) {
  return `${Math.round((Number(val) || 0) * 100)}%`
}
