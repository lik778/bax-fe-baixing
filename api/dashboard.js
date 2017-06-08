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
      console.log('call get api')
      res({
        '站内公告': 100,
        '百度广告': 100,
        '凤鸣': 100,
        '摇钱树': 100,
        '标王': 100,
        '大客户': 100,
      })
    }, 1000)
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