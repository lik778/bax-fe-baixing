import { api } from './base'
import { reverseCamelcase } from 'object-keys-mapping'

/**
 * 查询优选推店铺
 * 会返回所有可设置为落地页（未过期）的优选推店铺
 */
export async function queryMvipShops (params) {
  return await api
    .get('/user/shop/list')
    .query(reverseCamelcase(params))
    .json()
}
