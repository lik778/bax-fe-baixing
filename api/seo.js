
import { seo, trim } from './base'

export async function getBalance () {
  const body = await seo
    .get('/balance')
    .json()

  return body.data
}

export async function queryPromotion (opts = {}) {
  const body = await seo
    .get('/campaigns/landing')
    .query(opts)
    .json()

  return body.data
}

export async function queryPromotionByIds (campaignIds) {
  const body = await seo
    .get('/campaigns')
    .query({ campaignIds })
    .json()

  return body.data
}

export async function createPromotion (data) {
  const body = await seo
    .post('/campaigns')
    .send(data)
    .json()

  return body.data
}

export async function stop (campaignIds) {
  const body = await seo
    .post('/campaigns/stop')
    .send(campaignIds)
    .json()

  return body.data
}

export async function start (campaignIds) {
  const body = await seo
    .post('/campaigns/start')
    .send(campaignIds)
    .json()

  return body.data
}

export async function restart (id) {
  const body = await seo
    .post(`/campaigns/${id}/restart`)
    .json()

  return body.data
}

export async function updatePromotion (campaignId, data) {
  const body = await seo
    .post(`/campaigns/${campaignId}`)
    .send(data)
    .json()

  return body.data
}

// targetUserId, salesId are baxid, not baixingid
export async function createPreOrder (balanceAmount, saleWithShopOrder, shopOrderAmount, websiteSkuId, targetUserId, salesId) {
  const body = await seo
    .post('/trade/pre')
    .send(trim({ balanceAmount, saleWithShopOrder, websiteSkuId, targetUserId, salesId, shopOrderAmount }))
    .json()

  return body.data
}

export async function getBusinessLicense () {
  const body = await seo
    .get('/acc/campaign/business-license')
    .json()

  return body.data
}

export async function getPromotedWebsite () {
  const body = await seo
    .get('/acc/campaign/promoted-website')
    .json()

  return body.data
}

export async function getCibaoPromotionBaseInfo () {
  const body = await seo
    .get('/acc/campaign/base-info')
    .json()
  return body.data || {}
}

export async function createCibaoPromotion (opts = {}) {
  const body = await seo
    .post('/acc/campaign/create')
    .send(opts)
    .json()

  return body.data
}

export async function updateCibaoPromotion (opts = {}) {
  const body = await seo
    .post('/acc/campaign/update')
    .send(opts)
    .json()

  return body.data
}

export async function stopCibaoPromotion (id) {
  const body = await seo
    .get(`/acc/campaign/stop/${id}`)
    .json()
  return body.data
}

export async function restartCibaoPromotion (id) {
  const body = await seo
    .get(`/acc/campaign/restart/${id}`)
    .json()
  return body.data
}

export async function getCibaoPromotionByCampaignId (id) {
  const body = await seo
    .get(`/acc/campaign/${id}`)
    .json()

  return body.data
}

export async function getCiBaoPromotionList ({ size = 10, page = 1 }) {
  const body = await seo
    .post('/acc/campaign/user/list')
    .send({
      size,
      page
    })
    .json()
  return body.data
}

export async function renewCibaoPromotion ({ id, duration }) {
  const body = await seo
    .post('/acc/campaign/renew')
    .send({
      id,
      duration
    })
    .json()
  return body.data
}

export async function exportCibaoPromotion ({ date, id }) {
  const body = await seo
    .post('/acc/campaign/export')
    .send({
      date,
      id
    })
    .json()

  return body.data
}
