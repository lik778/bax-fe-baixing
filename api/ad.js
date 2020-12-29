
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { api, trim } from './base'

export async function createAdItem (item) {
  const body = await api
    .post('/ad/item')
    .send(reverseCamelcase(item))
    .json()

  return body
}

export async function pauseAdItem (id, opts = {}) {
  const body = await api
    .post(`/ad/item/${id}/pause`)
    .send(reverseCamelcase(opts))
    .json()

  return body
}

export async function continueAdItem (id, opts = {}) {
  const body = await api
    .post(`/ad/item/${id}/continue`)
    .send(reverseCamelcase(opts))
    .json()

  return body
}

export async function getAdPrice (aid, opts = {}) {
  const body = await api
    .get(`/ad/${aid}/price`)
    .query(reverseCamelcase(opts))
    .json()

  return toCamelcase(body.data)
}

export async function getAds () {
  const body = await api
    .get('/ad/meta')
    .json()

  return {
    ads: toCamelcase(body.data)
  }
}

export async function getAdItems (opts = {}) {
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

export async function addAdItemMaterial (itemId, data) {
  const body = await api
    .post(`/ad/item/${itemId}/material/new`)
    .send(reverseCamelcase(data))
    .json()

  return body
}

export async function setAdItemMaterial (itemId, materialId) {
  const body = await api
    .post(`/ad/item/${itemId}/material/existed`)
    .send(reverseCamelcase({ materialId }))
    .json()

  return body
}

export async function verifyAdItem (id, status, opts = {}) {
  if (status === 'pass') {
    const body = await api
      .post(`/ad/item/${id}/verify/pass`)
      .send({})
      .json()

    return body
  }

  // failed
  const body = await api
    .post(`/ad/item/${id}/verify/failed`)
    .send(reverseCamelcase(opts))
    .json()

  return body
}

/**
 * private
 */

async function _getAdItems (opts) {
  const body = await api
    .get('/ad/item')
    .query(reverseCamelcase(opts))
    .json()

  return toCamelcase(body.data).map(ad => {
    if (ad.areas && ad.areas.length === 0) {
      // 全国
      ad.areas = ['quanguo']
    }

    return ad
  })
}

async function _getAdItemCount (opts) {
  const body = await api
    .get('/ad/item/count')
    .query(reverseCamelcase(opts))
    .json()

  return body.data
}
