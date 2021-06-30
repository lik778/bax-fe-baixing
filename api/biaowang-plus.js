import { biaowangPlus } from 'api/base'

export async function getAllIndustry () {
  const body = await biaowangPlus
    .get('/basic/all-industry')
    .json()
  return body
}

export async function checkKeyword (params) {
  const body = await biaowangPlus
    .post('/basic/check-keyword')
    .send(params)
    .json()
  return body
}

/**
 * 获取系统报价（查价）
 * @param { Object } params
 * @param { string[] } params.cities
 * @param { string } params.coreCity
 * @param { string[] } params.word
 * @param { string } params.industry
 * @returns
 */
export async function querySystemResult (params) {
  const body = await biaowangPlus
    .post('/quota/getSystemQuotaResult')
    .send(params)
    .json()
  return body
}

/**
 * @param { Object } params
 * @param { Object } params.applyBasicAttr - 用户选择的价格 applyType=0时必传
 * @param { number } params.applyBasicAttr.priceId
 * @param { number } params.applyBasicAttr.device
 * @param { number } params.applyBasicAttr.scheduleType
 * @param { number } params.applyBasicAttr.days
 * @param { number } params.applyType - 申请类型
 * @param { number } params.priceId - 词包正常查价后返回的价格id
 * @param { number } params.targetUserId - 受益用户id
 * @param { Object } params.applyKeywordsAttr - applyType != 0时必传，为用户选择的关键词城市以及查出的热度
 * @param { string[] } params.applyKeywordsAttr.keywords
 * @param { string[] } params.applyKeywordsAttr.cities
 * @param { string } params.applyKeywordsAttr.coreCity
 * @param { string } params.applyKeywordsAttr.industry
 * @param { string } params.applyKeywordsAttr.tempPvId
 * @returns
 */
export async function commit (params) {
  const body = await biaowangPlus
    .post('/apply/user/commit')
    .send(params)
    .json()
  return body
}

/**
 * @param { Object } params
 * @param { number } params.id
 * @param { number } params.status
 * @param { number } params.size
 * @param { number } params.page
 */
export async function getInqueryList (params) {
  const body = await biaowangPlus
    .get('/apply/user/list')
    .query(params)
    .json()
  return body
}
