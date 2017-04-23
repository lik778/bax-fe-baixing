
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import api from './base'

export async function getAdPrice(aid, opts) {
  const body = await api
    .get(`/ad/${aid}/price`)
    .query(reverseCamelcase(opts))
    .json()

  return body.data
}

export async function getAds() {
  const body = await api
    .get('/ad/meta')
    .json()

  return {
    ads: toCamelcase(body.data)
  }
}

export async function queryAdItems(opts) {
  const body = await api
    .get('/ad/item/query')
    .query(reverseCamelcase(opts))
    .json()

  return {
    items: toCamelcase(body.data)
  }
}

export async function verifyAdItem(id, status) {
  if (status === 'pass') {
    return await api
      .post(`/ad/item/${id}/verify/pass`)
      .send({})
      .json()
  }

  // failed
  return await api
    .post(`/ad/item/${id}/verify/failed`)
    .send({})
    .json()
}
