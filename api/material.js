
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import api from './base'

const assign = Object.assign

export async function getMaterials(opts = {}) {
  const query = assign({}, {
    offset: 0,
    limit: 20
  }, opts)

  const [{materials}, total] = await Promise.all([
    _getMaterials(query),
    getMaterialCount(query)
  ])

  return {
    offset: query.offset,
    limit: query.limit,
    materials,
    total
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

/**
 * private
 */
async function _getMaterials(opts = {}) {
  const body = await api
    .get('/material')
    .query(reverseCamelcase(opts))
    .json()

  return {
    materials: toCamelcase(body.data)
  }
}

/**
 * @param {*} opts
 * @returns {Number}
 */
async function getMaterialCount(opts = {}) {
  const body = await api
    .get('/material/count')
    .query(reverseCamelcase(opts))
    .json()

  return body.data
}
