
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import api from './base'

export async function createOrder(order) {
  return await api
    .post('/order')
    .send(reverseCamelcase(order))
    .json()
}

export async function getOrderInfo(id) {
export async function getOrderLogs(id) {
  const body = await api
    .get(`/order/${id}`)
    .get(`/order/${id}/log`)
    .json()

  return toCamelcase(body.data)
}

export async function getOrders() {
  const body = await api
    .get('/order')
    .json()

  return {
    orders: toCamelcase(body.data)
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
