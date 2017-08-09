
import { toCamelcase } from 'object-keys-mapping'
import { api } from './base'

const isArray = Array.isArray

export async function getProductDiscounts(type) {
  if (isArray(type)) {
    const arr = await Promise.all(type.map(t => _getProductDiscounts(t)))
    return arr.reduce((a, b) => [...a, ...b], [])
  } else {
    const arr = await _getProductDiscounts(type)
    return arr
  }
}

export async function getCategories(levels = [1, 2]) {
  const body = await api
    .get('/meta/categories')
    .query({
      levels: levels.join(',')
    })
    .json()

  const categories = toCamelcase(body.data)

  return categories.map(c => ({
    ...c,
    value: c.name,
    label: c.nameCn
  }))
}

export async function getAreas() {
  const body = await api
    .get('/meta/areas')
    .json()

  const cities = toCamelcase(body.data)

  return cities.map(c => ({
    ...c,
    value: c.name,
    label: c.nameCn
  }))
}

/**
 * private
 */

async function _getProductDiscounts(type) {
  const body = await api
    .get('/meta/template/discount')
    .query({
      product_type: type
    })
    .json()

  return toCamelcase(body.data)
}
