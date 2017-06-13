import { dashboardApi } from './base'

export function getProfitByProduct(range) {
  range = range || 'yesterday'
  return dashboardApi
    .get(`/profit-by-product`)
    .query({ range })
    .json()
}

export function getProfitByProductAndRange(range) {
  return dashboardApi
    .get('/profit-by-product-and-range')
    .query({ range })
    .json()
}

export function getTarget(range) {
  return dashboardApi
    .get('/target')
    .query({ range })
    .json()
}

export function setTarget(range, product, value) {
  return dashboardApi
    .put('/target')
    .send({ range, product, value })
    .json()
}