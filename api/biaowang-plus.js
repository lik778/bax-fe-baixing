import { biaowangPlus } from 'api/base'

export async function getAllIndustry () {
  const body = await biaowangPlus
    .get('/phoenixs-plus/basic/all-industry')
    .json()
  return body
}

export async function checkKeyword (params) {
  const body = await biaowangPlus
    .post('/phoenixs-plus/basic/check-keyword')
    .send(params)
    .json()
  return body
}

/**
 * @param {cities: string[], coreCity: string, words: string[], industry: string} params
 * @returns
 */
export async function queryPrice (params) {
  const body = await biaowangPlus
    .post('/phoenixs-plus/quota/getManualQuotaResult')
    .send(params)
    .json()
  return body
}
