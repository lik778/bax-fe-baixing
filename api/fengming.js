
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming, trim } from './base'
import moment from 'moment'

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

export async function getCampaignInfo(id) {
  const body = await fengming
    .get(`/campaign/${id}`)
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

  if (query.id) {
    // 这里的逻辑是不是怪怪的 ? 哈哈, 因为:
    // @嘟嘟噜 说: 你自己根据 `id` 调详情接口吧
    const campaigns = []
    try {
      const campaign = await getCampaignInfo(query.id)
      campaigns.push(campaign)
    } catch (err) {
      console.warn(err)
    }

    return {
      query: {
        ...query,
        total: campaigns.length
      },
      campaigns
    }
  }

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
    creativeContent,
    creativeTitle
  } = opts

  const body = await fengming
    .get('/creative/check')
    .query(reverseCamelcase({
      creativeContent: removeComma(creativeContent),
      creativeTitle: removeComma(creativeTitle)
    }))
    .json()

  return body.data
}
// TODO - rename
export async function getCreativeWords(url) {
  const body = await fengming
    .get('/keyword/recommand/url')
    .query({url})
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

export async function getLogs(opts = {}) {
  let query = {
    pageSize: 50,
    offset: 0,
    time: moment().subtract(1, 'months').unix(),
    ...opts
  }

  const { type, time, pageSize, offset } = query

  query = trim(reverseCamelcase({
    timelineType: type,
    createdAt: time,
    offset,
    limit: pageSize
  }))

  const [logs, total] = await Promise.all([
    _getLogs(query),
    _getLogCount(query)
  ])

  return {
    query: {
      ...query,
      total
    },
    logs
  }
}

export async function getSummary() {
  const [ balance, daily ] = await Promise.all([
    getCurrentBalance(),
    _getDailySummary()
  ])

  return {
    balance,
    ...daily
  }
}

export async function getHomepageSummary() {
  const [ campaignCount, balance ] = await Promise.all([
    _getCurrentCampaignCount(),
    getCurrentBalance()
  ])

  return {
    balance,
    campaignCount
  }
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

async function _getDailySummary() {
  const body = await fengming
    .get('/campaign/daily_simple_report')
    .json()

  return toCamelcase(body.data)
}

async function _getLogs(opts) {
  const body = await fengming
    .get('/timeline')
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

async function _getLogCount(opts) {
  const body = await fengming
    .get('/timeline/count')
    .query(opts)
    .json()

  return body.data
}

/**
 * private
 */

function removeComma(s) {
  // 移除 qs 中的 逗号 ~
  return s.replace(/,/g, '')
}
