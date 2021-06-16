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
