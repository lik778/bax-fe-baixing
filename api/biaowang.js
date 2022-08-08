
import { biaowang, trim } from './base'
import { getCurrentBalanceBreif } from './account'
import { SPUCODES } from 'constant/product'

const { BIAO_WANG_SPU_CODE } = SPUCODES

export async function queryKeywordPrice (opts = {}) {
  const body = await biaowang
    .post('/keyword/pricing/user/inquiry')
    .send(opts)
    .json()

  return body.data.content
}
export async function refreshKeywordPrice (keywords) {
  const requestBody = keywords.map(k => ({
    ...k,
    price: {
      [k.days]: k.price
    }
  }))
  const body = await biaowang
    .post('/keyword/pricing/user/inquiry/norec')
    .send({ pricingList: requestBody })
    .json()

  const parsedBody = body.data.content.map(i => {
    const days = keywords.find(k => k.word === i.word).days
    return {
      ...i,
      price: i.soldPriceMap[days],
      days: days
    }
  })
  return parsedBody
}

export async function getPromotes (opts = {}) {
  const q = {
    size: 20,
    page: 0,
    ...opts
  }
  const body = await biaowang
    .get('/promote/user')
    .query(trim(q))
    .json()

  return {
    items: body.data.content,
    total: body.data.totalElements
  }
}

export async function getCpcRanking (promoteIds = []) {
  const body = await biaowang
    .get('/promote/user/cpc_ranking')
    .query({ promoteIds })
    .json()

  return body.data
}

export async function getPromoteById (id, params) {
  const body = await biaowang
    .get(`/promote/user/${id}`)
    .query(params)
    .json()

  return body.data
}

export async function getPromtesByOrders (orderIds) {
  const body = await biaowang
    .get('/promote/user/order')
    .query({ orderIds })
    .json()

  return body.data
}

export async function updatePromote (opts = {}) {
  return biaowang
    .post('/promote/user/info')
    .send(opts)
    .json()
}

// targetUserId, salesId are baxid, not baixingid
export async function createPreOrder (items, targetUserId, salesId, saleWithShopOrder, shopOrderAmount, shopType) {
  const body = await biaowang
    .post('/trade/user/order/pre')
    .send(trim({ pricingList: items, targetUserId, salesId, saleWithShopOrder, shopOrderAmount, shopType }))
    .json()

  return body.data
}

export async function getRecentSold () {
  const body = await biaowang
    .get('/promote/user/global/promote')
    .json()

  return body.data.content
}

export async function getLogs (parmas) {
  const body = await biaowang
    .get('/promote/timeline/query')
    .query(parmas)
    .json()

  return body.data
}

export async function getHomePageBiaowangData (parmas) {
  const { userId } = parmas
  const [biaowangBalanceBrief] = await Promise.all([
    getCurrentBalanceBreif(BIAO_WANG_SPU_CODE, userId)
  ])

  return {
    biaowangBalance: biaowangBalanceBrief.currentBalance
  }
}

export async function getQiqiaobanCoupon (promoteId) {
  const body = await biaowang
    .post('/promote/coupon/qiqiaoban')
    .query({ promoteId })
    .json()

  return body.data
}

export async function cancelOrder (orderId) {
  const body = await biaowang
    .post('/trade/user/order/cancel')
    .send({ orderId })
    .json()

  return body.data
}

export async function queryOrder (query) {
  const { data } = await biaowang
    .get('/trade/user/order')
    .query(query)
    .json()
  return {
    data: data.content,
    total: data.totalElements
  }
}

export async function queryKeywordPriceNew (opts) {
  const body = await biaowang
    .post('/keyword/v2/pricing/user/inquiry')
    .send(opts)
    .json()

  return body.data
}

export async function getRenewDetail (opts) {
  const body = await biaowang
    .get('/promote/user/special/renew/detail')
    .query(opts)
    .json()
  return body
}

export async function specialRenew (opts) {
  console.log('opts', opts)
  const body = await biaowang
    .post('/promote/user/special/renew')
    .send(opts)
    .json()
  return body
}

export async function queryKeywordPackagePrice (opts) {
  const body = await biaowang
    .post('/keyword/v2/pricing/user/package/inquiry')
    .send(opts)
    .json()
  return body.data
}

// 把查价信息打给数据组
export async function sendSelectedIndustryToBW (query) {
  return await biaowang
    .post('/keyword/v2/pricing/user/keywordIndustry')
    .send(query)
    .json()
}

// 获取标王查价时需选择的行业信息
export async function queryBWIndustry () {
  return (await biaowang
    .get('/keyword/v2/pricing/user/inquiryAllIndustry')
    .query()
    .json())
    .data
}

export async function refreshKeywordPriceNew (keywords, opt) {
  const requestBody = keywords.map(k => ({
    ...k,
    price: {
      [k.days]: k.price
    }
  }))
  const body = await biaowang
    .post('/keyword/v2/pricing/user/inquiry/norec')
    .send({
      ...opt,
      pricingList: requestBody
    })
    .json()

  const parsedBody = body.data.content.map(i => {
    const keyword = keywords.find(k => k.word === i.word && k.device === i.device)
    const days = keyword.days
    const coreCities = keyword.coreCities
    return {
      ...i,
      price: i.soldPriceMap[days],
      days: days,
      coreCities
    }
  })
  return parsedBody
}

export async function getUserRanking (opts = {}) {
  const body = await biaowang
    .post('/promote/user/ranking')
    .send(opts)
    .json()

  return body.data.rankList
}

export async function getUserLive (opts = {}) {
  const body = await biaowang
    .get('/promote/user/live')
    .query(opts)
    .json()
  return body.data
}

export async function getUserShow (opts = {}) {
  const body = await biaowang
    .post('/promote/user/show')
    .send(opts)
    .json()

  return body.data.showList
}

export async function getPromotionUserCollection (opts = {}) {
  const body = await biaowang
    .post('/promote/user/collect')
    .send({
      promoteList: [],
      ...opts
    })
    .json()
  return body.data
}

export async function sendUserManualApply (opts = {}) {
  const body = await biaowang
    .post('/keyword/v2/pricing/user/manual/apply')
    .send({
      ...opts
    })
    .json()

  return body.data
}

export async function getUserManualList (opts = {}) {
  const q = {
    size: 20,
    page: 0,
    ...opts
  }

  const { data } = await biaowang
    .get('/keyword/v2/pricing/user/manual/history')
    .query(q)
    .json()

  return {
    data: data.content,
    total: data.totalElements
  }
}
