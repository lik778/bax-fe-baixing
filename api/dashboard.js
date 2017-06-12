import { dashboardApi } from './base'

export function getProfitByProduct(range) {
  range = range || 'yesterday'
  return dashboardApi
    .get(`/profit-by-product`)
    .query({ range })
    .json()
}

export function getProfitByProductAndDay() {
  return dashboardApi
    .get('/profit-by-product-and-day')
    .json()
}

export function getTarget(range) {
  return new Promise(res => {
    setTimeout(() => {
      console.log('getTarget')
      res({
        '站内广告': 100,
        '站外广告': 100000,
        '凤鸣': 20000,
        '摇钱树': 100,
        '标王': 1000,
        '大客户': 100,
        '拼框': 1000
      })
    }, 200)
  })
}

export function setTarget(range, product, value) {
  return new Promise(res => {
    setTimeout(() => {
      console.log('call set api')
      res('ok')
    })
  })
}