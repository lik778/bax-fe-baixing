
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import api from './base'

export async function getAdPrice(aid, opts) {
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

export async function createAdGroup(group) {
  return await api
    .post('/ad/item/group')
    .send(reverseCamelcase(group))
    .json()
}

export async function transferGroupItems(data) {
  return await api
    .post('/ad/item/group/transfer')
    .send(reverseCamelcase(data))
    .json()
}

export async function getAdGroups(type = 'unverified', opts) {
  const query = {
    offset: 0,
    limit: 20,
    ...opts
  }

  if (type === 'all') {
    const body = await api
      .get('/ad/item/group')
      .query(reverseCamelcase(query))
      .json()

    return {
      groups: toCamelcase(body.data)
    }
  }

  const body = await api
    .get(`/ad/item/group/unverified`)
    .query(query)
    .json()

  return {
    groups: toCamelcase(body.data)
  }
}

export async function setAdGroupMaterial(gid, mid) {
  return await api
    .post(`/ad/item/group/${gid}/material/existed`)
    .send(reverseCamelcase({materialId: mid}))
    .json()
}

export async function addAdGroupMaterial(gid, material) {
  const data = {
    ...material,
    itemGroupId: gid
  }

  return await api
    .post(`/ad/item/group/${gid}/material/new`)
    .send(reverseCamelcase(data))
    .json()
}

export async function getAdGroupItems(gid) {
  const body = await api
    .get(`/ad/item/group/${gid}/item`)
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

export async function verifyAdGroup(id, status) {
  if (status === 'pass') {
    return await api
      .post(`/ad/item/group/${id}/verify/pass`)
      .send({})
      .json()
  }

  // failed
  return await api
    .post(`/ad/item/group/${id}/verify/failed`)
    .send({})
    .json()
}
