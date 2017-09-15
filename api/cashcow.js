
import { toCamelcase, reverseCamelcase } from 'object-keys-mapping'
import { cashcowHost } from 'config'
import { cashcowApi } from './base'

export const createPageApiUrl = cashcowHost + '/create'
export const editPageApiUrl = cashcowHost + '/edit'

export function getEditURL(opts) {
  const { id, userId: uid } = opts
  return cashcowApi
    .get(`/edit/${id}`)
    .query({uid})
    .json()
    .then(toCamelcase)
}

export function getDraftPageList(opts) {
  return cashcowApi
    .get('/pages')
    .query(reverseCamelcase(opts))
    .json()
    .then(toCamelcase)
}

export function getReleasePageList(opts) {
  return cashcowApi
    .get('/releases')
    .query(reverseCamelcase(opts))
    .json()
    .then(toCamelcase)
}

export function removeDraftPage(opts) {
  const { id, userId: uid } = opts
  return cashcowApi
    .delete(`/pages/${id}`)
    .query({uid})
    .json()
    .then(toCamelcase)
}

export function removeReleasePage(opts) {
  const { id, userId: uid } = opts
  return cashcowApi
    .delete(`/releases/${id}`)
    .query({uid})
    .json()
    .then(toCamelcase)
}

export function updatePage(opts) {
  const { id, userId, ...restOpts } = opts
  return cashcowApi
    .put(`/pages/${id}?uid=${userId}`)
    .send(reverseCamelcase(restOpts))
    .json()
    .then(toCamelcase)
}
