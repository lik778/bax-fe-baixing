
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { api, trim } from './base'

const isArray = Array.isArray

export async function getCalendar (opts = {}) {
  const body = await api
    .get('/order/calendar')
    .query(reverseCamelcase(opts))
    .json()

  return {
    orders: toCamelcase(body.data)
  }
}

export async function cancelOrder (oid) {
  const body = await api
    .post(`/order/${oid}/cancel`)
    .send({})
    .json()

  return body
}

export async function createOrder (order) {
  const body = await api
    .post('/order')
    .send(reverseCamelcase(order))
    .json()

  return body.data
}

export async function getOrderLogs (id) {
  const body = await api
    .get(`/order/${id}/log`)
    .json()

  return toCamelcase(body.data)
}

export async function getOrderInfo (id) {
  const body = await api
    .get(`/order/${id}`)
    .json()

  return toCamelcase(body.data)
}

export async function getOrders (opts = {}) {
  const query = trim({
    offset: 0,
    limit: 20,
    ...opts
  })

  const [orders, total] = await Promise.all([
    _getOrders(query),
    _getOrderCount(query)
  ])

  return {
    orders,
    query: {
      ...query,
      total
    }
  }
}

export async function changeOrderDiscount (oid, data) {
  const body = await api
    .post(`/order/${oid}/discount`)
    .send(reverseCamelcase(data))
    .json()

  return body
}

export async function getOrderPayUrl (oids, summary = '') {
  if (!isArray(oids)) {
    oids = [oids]
  }

  const body = await api
    .get('/order/pay/url')
    .query(reverseCamelcase({
      orderIds: oids,
      summary
    }))
    .json()

  return body.data
}

export async function payOrders (oids) {
  const body = await api
    .post('/order/pay/agent/multi')
    .send(reverseCamelcase({
      orderIds: oids
    }))
    .json()

  return body
}

export async function payOrder (oid) {
  const body = await api
    .post(`/order/${oid}/pay/agent`)
    .send({})
    .json()

  return body
}

/**
 * private
 */

async function _getOrders (query) {
  const body = await api
    .get('/order')
    .query(reverseCamelcase(query))
    .json()

  return toCamelcase(body.data)
}

async function _getOrderCount (query) {
  const body = await api
    .get('/order/count')
    .query(reverseCamelcase(query))
    .json()

  return body.data
}

export async function createPreOrder (order) {
  const body = await api
    .post('/order/pre/create')
    .send(reverseCamelcase(order))
    .json()

  return body.data
}
