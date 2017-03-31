
import { toCamelcase } from 'object-keys-mapping'
import api from './base'

export async function getAd(id) {
  const body = await api
    .get(`/ad/${id}`)
    .json()

  return toCamelcase(body.data)
}
