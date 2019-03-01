
import { biaowang, trim } from './base'

export async function queryKeywordPrice(opts = {}) {
  const body = await biaowang
    .post('/keyword/pricing/user/inquiry')
    .send(opts)
    .json()

  return body.data.content
}

export async function refreshKeywordPrice(keywords) {
  const requestBody = keywords.map(k => ({
    ...k,
    price: {
      [k.days]: k.price
    }
  }))
  const body = await biaowang
    .post('/keyword/pricing/user/inquiry/norec')
    .send({pricingList: requestBody})
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

export async function getPromotes(opts = {}) {
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

export async function getCpcRanking(promoteIds = []) {
  const body = await biaowang
    .get('/promote/user/cpc_ranking')
    .query({promoteIds})
    .json()

  return body.data
}

export async function getPromoteById(id) {
  const body = await biaowang
    .get(`/promote/user/${id}`)
    .json()

  return body.data
}

export async function getPromtesByOrders(orderIds) {
  const body = await biaowang
    .get(`/promote/user/order`)
    .query({orderIds})
    .json()

  return body.data
}

export async function updatePromote(opts = {}) {
  return biaowang
    .post('/promote/user/info')
    .send(opts)
    .json()
}

// targetUserId, salesId are baxid, not baixingid
export async function createPreOrder(items, saleWithShopOrder, targetUserId, salesId) {
  console.log(targetUserId, salesId)
  const body = await biaowang
    .post('/trade/user/order/pre')
    .send(trim({pricingList: items, saleWithShopOrder, targetUserId, salesId}))
    .json()

  return body.data
}

export async function getRecentSold() {
  const body = await biaowang
    .get(`/promote/user/global/promote`)
    .json()

  return body.data.content
}

export async function getLogs(parmas) {
  const body = await biaowang
    .get(`/promote/timeline/query`)
    .query(parmas)
    .json()

  return body.data
}

export async function getHomePageBiaowangData() {
  const body = await biaowang
    .get(`/promote/user/info`)
    .json()

  return body.data
}
