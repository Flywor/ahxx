import request from '@/util/request'

export function getData() {
  return request({
    url: `/equip/list`,
    method: 'get'
  })
}
export function insertData(data) {
  return request({
    url: `/equip/insert`,
    method: 'post',
    data: data
  })
}
export function deleteData(data) {
  return request({
    url: `/equip/del`,
    method: 'post',
    data: data
  })
}
export function updateData(data) {
  return request({
    url: `/equip/update`,
    method: 'post',
    data: data
  })
}
