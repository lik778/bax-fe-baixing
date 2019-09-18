
import { seo, trim } from './base'

export async function getBalance() {
  const body = await seo
    .get('/balance')
    .json()

  return body.data
}

export async function queryPromotion(opts = {}) {
  const body = await seo
    .get('/campaigns/landing')
    .query(opts)
    .json()

  return body.data
}

export async function queryPromotionByIds(campaignIds) {
  const body = await seo
    .get('/campaigns')
    .query({campaignIds})
    .json()

  return body.data
}

export async function createPromotion(data) {
  const body = await seo
    .post('/campaigns')
    .send(data)
    .json()

  return body.data
}

export async function stop(campaignIds) {
  const body = await seo
    .post('/campaigns/stop')
    .send(campaignIds)
    .json()

  return body.data
}

export async function start(campaignIds) {
  const body = await seo
    .post('/campaigns/start')
    .send(campaignIds)
    .json()

  return body.data
}

export async function restart(id) {
  const body = await seo
    .post(`/campaigns/${id}/restart`)
    .json()

  return body.data
}

export async function updatePromotion(campaignId, data) {
  const body = await seo
    .post(`/campaigns/${campaignId}`)
    .send(data)
    .json()

  return body.data
}

// targetUserId, salesId are baxid, not baixingid
export async function createPreOrder(balanceAmount, saleWithShopOrder, shopOrderAmount, targetUserId, salesId) {
  const body = await seo
    .post('/trade/pre')
    .send(trim({balanceAmount, saleWithShopOrder, targetUserId, salesId, shopOrderAmount}))
    .json()

  return body.data
}