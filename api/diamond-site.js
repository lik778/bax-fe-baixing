
import { api } from './base'

export async function getUserSites () {
  const body = await api
    .get('/midway/user/shop-info')
    .query({})
    .json()

  return body.data
}
