
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import api from './base'

export async function createOrder(order) {
  return await api
    .post('/order')
    .send(reverseCamelcase(order))
    .json()
}

export async function getOrderLogs(id) {
  const body = await api
    .get(`/order/${id}/log`)
    .json()

  return toCamelcase(body.data)
}

export async function getOrderInfo(id) {
  const body = await api
    .get(`/order/${id}`)
    .json()

  return toCamelcase(body.data)
}

export async function getOrders(opts = {}) {
  const query = {
    offset: 0,
    limit: 20,
    ...opts
  }

  const [orders, total] = await Promise.all([
    _getOrders(query),
    _getOrderCount(query)
  ])

  return {
    offset: query.offset,
    limit: query.limit,
    orders,
    total
  }
}

export async function changeOrderDiscount(oid, data) {
  return await api
    .post(`/order/${oid}/discount`)
    .send(reverseCamelcase(data))
    .json()
}

export async function payOrder(oid) {
  return await api
    .post(`/order/${oid}/pay`)
    .send({})
    .json()
}

/**
 * private
 */

async function _getOrders(query) {
  const body = await api
    .get('/order')
    .query(reverseCamelcase(query))
    .json()

  return toCamelcase(body.data)
}

async function _getOrderCount(query) {
  const body = await api
    .get('/order/count')
    .query(reverseCamelcase(query))
    .json()

  return body.data
}
