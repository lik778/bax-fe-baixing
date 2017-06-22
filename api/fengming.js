
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming, trim } from './base'

const isArray = Array.isArray

export async function updateCampaignDailyBudget(opts) {
  return await fengming
    .post('/campaign/daily_budget')
    .send(reverseCamelcase(opts))
    .json()
}

export async function updateCampaignRatio(opts) {
  return await fengming
    .post('/campaign/ratio')
    .send(reverseCamelcase(opts))
    .json()
}

export async function updateCampaignTimeRange(opts) {
  return await fengming
    .post('/campaign/valid_time')
    .send(reverseCamelcase(opts))
    .json()
}

export async function createOrder(order) {
  const body = await fengming
    .post('/order')
    .send(reverseCamelcase(order))
    .json()

  return body.data
}

export async function getProducts(type = 1) {
  const body = await fengming
    .get('/product')
    .query(reverseCamelcase({
      productTypes: isArray(type) ? type.join(',') : type
    }))
    .json()

  return toCamelcase(body.data)
}

export async function getProductPackages() {
  const body = await fengming
    .get('/product/package')
    .json()

  return toCamelcase(body.data)
}

export async function updateCampaign(id, data) {
  return await fengming
    .post(`/campaign/${id}`)
    .send(reverseCamelcase(data))
    .json()
}

export async function createCampaign(data) {
  const body = await fengming
    .post('/campaign')
    .send(reverseCamelcase(data))
    .json()

  return body.data
}

export async function activeCampaigns(ids) {
  return await fengming
    .post('/campaign/pause')
    .send(reverseCamelcase({
      campaignIds: [...ids],
      pause: 0
    }))
    .json()
}

export async function pauseCampaigns(ids) {
  return await fengming
    .post('/campaign/pause')
    .send(reverseCamelcase({
      campaignIds: [...ids],
      pause: 1
    }))
    .json()
}

export async function getCurrentCampaigns(opts) {
  const query = trim({
    offset: 0,
    limit: 20,
    ...opts
  })

  const [campaigns, total] = await Promise.all([
    _getCurrentCampaigns(query),
    _getCurrentCampaignCount(query)
  ])

  return {
    query: {
      ...query,
      total
    },
    campaigns
  }
}

export async function getCurrentBalance() {
  const body = await fengming
    .get('/balance/current')
    .json()

  return body.data
}

export async function checkCreativeContent(opts) {
  const {
    content,
    title
  } = opts

  const body = await fengming
    .get('/creative/check')
    .query(reverseCamelcase({
      creativeContent: content,
      creativeTitle: title
    }))
    .json()

  return body.data
}

export async function getCreativeWords(opts) {
  const {
    content,
    title
  } = opts

  const body = await fengming
    .get('/keyword/recommand/creative')
    .query(reverseCamelcase({
      creativeContent: content,
      creativeTitle: title
    }))
    .json()

  return toCamelcase(body.data)
}

export async function getRecommendedWords(word) {
  const body = await fengming
    .post('/keyword/recommand/word')
    .send({
      word
    })
    .json()

  return toCamelcase(body.data)
}

/**
 * private
 */

async function _getCurrentCampaigns(opts) {
  const body = await fengming
    .get('/campaign/current')
    .query(opts)
    .json()

  return toCamelcase(body.data)
}

async function _getCurrentCampaignCount(opts) {
  const body = await fengming
    .get('/campaign/current/count')
    .query(opts)
    .json()

  return body.data
}
