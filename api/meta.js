
import { toCamelcase } from 'object-keys-mapping'
import api from './base'

export async function getCategories(levels = [1, 2]) {
  const body = await api
    .get('/meta/categories')
    .query({
      levels: levels.join(',')
    })
    .json()

  return toCamelcase(body.data)
}

export async function getAreas() {
  const body = await api
    .get('/meta/areas')
    .json()

  return toCamelcase(body.data)
}
