
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { api, trim } from './base'

export async function createAdItem(item) {
  return await api
    .post('/ad/item')
    .send(reverseCamelcase(item))
    .json()
}

export async function getAdPrice(aid, opts = {}) {
  const body = await api
    .get(`/ad/${aid}/price`)
    .query(reverseCamelcase(opts))
    .json()

  return toCamelcase(body.data)
}

export async function getAds() {
  const body = await api
    .get('/ad/meta')
    .json()

  return {
    ads: toCamelcase(body.data)
  }
}

export async function getAdItems(opts = {}) {
  const query = trim({
    offset: 0,
    limit: 20,
    ...opts
  })

  const [items, total] = await Promise.all([
    _getAdItems(query),
    _getAdItemCount(query)
  ])

  return {
    items: toCamelcase(items),
    query: {
      ...query,
      total
    }
  }
}

export async function addAdItemMaterial(itemId, data) {
  return await api
    .post(`/ad/item/${itemId}/material/new`)
    .send(reverseCamelcase(data))
    .json()
}

export async function setAdItemMaterial(itemId, materialId) {
  return await api
    .post(`/ad/item/${itemId}/material/existed`)
    .send(reverseCamelcase({materialId}))
    .json()
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

/**
 * private
 */

async function _getAdItems(opts) {
  const body = await api
    .get('/ad/item')
    .query(reverseCamelcase(opts))
    .json()

  return toCamelcase(body.data)
}

async function _getAdItemCount(opts) {
  const body = await api
    .get('/ad/item/count')
    .query(reverseCamelcase(opts))
    .json()

  return body.data
}
