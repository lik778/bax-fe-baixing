import { biaowangPlus, trim } from 'api/base'

export async function getAllIndustry () {
  const body = await biaowangPlus
    .get('/basic/all-industry')
    .json()
  return body
}

export async function getAllAreas () {
  const body = await biaowangPlus
    .get('/basic/all-area')
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

/**
 * 用户查看已购买的词包列表
 * @param { Object } params
 * @param { Number } params.id
 * @param { String } params.keyword
 * @param { Number[] } params.status
 * @param { Number[] } params.auditStatus
 * @param { Number } params.size
 * @param { Number } params.page
 * @returns
 */
export async function getUserPackageList (params) {
  const body = await biaowangPlus
    .get('/package/user/list')
    .query(trim(params))
    .json()

  return {
    items: body.data.content,
    total: body.data.totalElements
  }
}

/**
 * 用户查看某个词包下的计划列表
 * @param { Number } id
 * @returns
 */
export async function getUsePromoteListByPackageId (id) {
  const body = await biaowangPlus
    .get('/promote/user/list')
    .query({
      packageId: id
    })
    .json()

  return body.data
}

/**
 * 用户查看计划详情
 * @param { Number } id
 * @returns
 */
export async function getPromoteDetailById (id) {
  const body = await biaowangPlus
    .get('/promote/user/info')
    .query({
      promoteId: id
    })
    .json()
  return body.data
}

/**
 * 用户编辑计划落地页创意
 * @param { Object } params
 * @param { Number[] } params.promoteIds
 * @param { String } params.creativeTitle
 * @param { String } params.creativeContent
 * @param { String } params.landingPage
 * @param { Number } params.landingPageId
 * @param { Number } params.landingType
 * @returns
 */
export async function updatePromoteDetail (params) {
  const body = await biaowangPlus
    .post('/promote/user/info')
    .send(params)
    .json()
  return body
}

/**
 * @param { object } params
 * @param { number } params.id
 * @param { number } params.device
 * @param { number } params.scheduleType
 * @param { number } params.days
 * @param { number } params.price
 * @returns { any }
 */
export async function userChoose (params) {
  const body = await biaowangPlus
    .post('/apply/user/choose')
    .send(params)
    .json()
  return body
}

/**
 * @param { object } params
 * @param { number } params.applyId
 * @returns { any }
 */
export async function preOrder (params) {
  const body = await biaowangPlus
    .get('/apply/user/pre-order')
    .query(params)
    .json()
  return body
}

/**
 * @param { object } params
 * @param { number } params.applyId
 * @returns
 */
export async function preInfo (params) {
  const body = await biaowangPlus
    .get('/apply/user/pre-info')
    .query(params)
    .json()
  return body
}

/**
 * @param { object } params
 * @param { string[] } params.keywords
 * @returns
 */
export async function checkSoldCities (params) {
  const body = await biaowangPlus
    .post('/basic/keyword/sold-cities')
    .send(params)
    .json()
  return body
}

/**
 * @param {object} params
 * @param {number} params.applyId
 * @returns
 */
export async function getPriceList (params) {
  const body = await biaowangPlus
    .get('/apply/user/price/options')
    .query(params)
    .json()
  return body
}
