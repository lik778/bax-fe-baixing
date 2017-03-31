
import { toCamelcase } from 'object-keys-mapping'
import api from './base'

export async function getMaterials() {
  const body = await api
    .get('/material')
    .json()

  return toCamelcase(body.data)
}

export async function getMaterial(id) {
  const body = await api
    .get(`/material/${id}`)
    .json()

  return toCamelcase(body.data)
}
