import { fengming } from './base'

/**
 * 查询优选推店铺
 * 会返回所有可设置为落地页（未过期）的优选推店铺
 */
export async function queryMvipShops () {
  return await fengming
    .get('/user/shop/list')
    .query()
    .json()
}
