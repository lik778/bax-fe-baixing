
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

  const parsedBody = body.data.content.map(i => ({
    ...i,
    price: i.price[i.days]
  }))
  return parsedBody
}

export async function getPromotes(opts = {}) {
  const q = {
    size: 20,
    page: 0,
    ...opts
  }
  console.log(trim(q))
  const body = await biaowang
    .get('/promote/user')
    .query(trim(q))
    .json()

  return {
    items: body.data.content,
    total: body.data.totalElements
  }
}

export async function getPromoteById(id) {
  const body = await biaowang
    .get(`/promote/user/${id}`)
    .json()

  return body.data
}

export async function getPromtesByOrders(orderIds) {
  const body = await biaowang
    .post(`/promote/user/order`)
    .send({orderIds})
    .json()

  return body.data.content
}

export async function updatePromote(opts = {}) {
  return biaowang
    .post('/promote/user/info')
    .send(opts)
    .json()
}

export async function createPreOrder(items, saleWithShopOrder) {
  const body = await biaowang
    .post('/trade/user/order/pre')
    .send({pricingList: items, saleWithShopOrder})
    .json()

  return body.data
}
