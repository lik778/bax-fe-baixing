
import { toCamelcase } from 'object-keys-mapping'
import api from './base'

export async function getMaterials() {
  const body = await api
    .get('/material')
    .json()

  return {
    materials: toCamelcase(body.data)
  }
}

export async function getMaterial(id) {
  const body = await api
    .get(`/material/${id}`)
    .json()

  return toCamelcase(body.data)
}

/**
 * @returns {String}
 */
export async function getQiniuToken() {
  const body = await api
    .get('/material/qiniu/token')
    .json()

  return body.data
}
