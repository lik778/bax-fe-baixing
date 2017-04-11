
import { toCamelcase } from 'object-keys-mapping'
import api from './base'

export async function createOrder(order) {
  return await api
    .post('/order')
    .send(order)
    .json()
}

export async function getOrderInfo(id) {
  const body = await api
    .get(`/order/${id}`)
    .json()

  return toCamelcase(body.data)
}

export async function verifyOrder(id, status = 'failed') {
  if (status === 'pass') {
    // pass
    return await api
      .post(`/order/${id}/verify/pass`)
      .json()
  }

  // failed
  return await api
    .post(`/order/${id}/verify/failed`)
    .json()
}

export async function getOrders() {
  const body = await api
    .get('/order')
    .json()

  return toCamelcase(body.data)
}
