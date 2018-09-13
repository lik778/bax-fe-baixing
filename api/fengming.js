
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming, trim } from './base'
import qs from 'query-string'
import moment from 'moment'

const isArray = Array.isArray

export async function updateCampaignDailyBudget(opts) {
  const body = await fengming
    .post('/campaign/daily_budget')
    .send(reverseCamelcase(opts))
    .json()

  return body
}

export async function updateCampaignRatio(opts) {
  const body = await fengming
    .post('/campaign/ratio')
    .send(reverseCamelcase(opts))
    .json()

  return body
}

export async function updateCampaignTimeRange(opts) {
  const body = await fengming
    .post('/campaign/valid_time')
    .send(reverseCamelcase(opts))
    .json()

  return body
}

export async function addUserLead(opts) {
  const body = await fengming
    .post('/new_user_leads')
    .send(reverseCamelcase(opts))
    .json()

  return body
}

export async function createOrder(order) {
  const body = await fengming
    .post('/order')
    .send(reverseCamelcase(order))
    .json()

  return body.data
}

export async function getProducts(type = 3) {
  const body = await fengming
    .get('/product')
    .query(reverseCamelcase({
      productTypes: isArray(type) ? type.join(',') : type
    }))
    .json()

  return toCamelcase(body.data)
}

export async function getProductPackages(type = 0) {
  const body = await fengming
    .get('/product/package')
    .query({
      package_type: type
    })
    .json()

  return toCamelcase(body.data)
}

export async function getCampaignInfo(id) {
  const body = await fengming
    .get(`/campaign/${id}`)
    .json()

  const campaign = toCamelcase(body.data)

  if (!campaign.landingPageId) {
    // why ? 不想多说什么了, 呵呵
    if (campaign.landingPage && campaign.landingPage.includes('vad_id')) {
      const search = (new URL(campaign.landingPage)).search
      const o = qs.parse(search)
      if (o.vad_id) {
        campaign.landingPageId = o.vad_id
      }
    }
  }
  return campaign
}

export async function updateCampaign(id, data) {
  const body = await fengming
    .post(`/campaign/${id}`)
    .send(reverseCamelcase(data))
    .json()

  return body
}

export async function createCampaign(data) {
  const body = await fengming
    .post('/campaign/create')
    .send(reverseCamelcase(data))
    .json()

  return body.data
}

export async function activeCampaigns(ids) {
  const body = await fengming
    .post('/campaign/pause')
    .send(reverseCamelcase({
      campaignIds: [...ids],
      pause: 0
    }))
    .json()

  return body
}

export async function pauseCampaigns(ids) {
  const body = await fengming
    .post('/campaign/pause')
    .send(reverseCamelcase({
      campaignIds: [...ids],
      pause: 1
    }))
    .json()

  return body
}

export async function getCurrentCampaigns(opts) {
  const query = reverseCamelcase(trim({
    offset: 0,
    limit: 20,
    ...opts
  }))

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
    getCurrentCampaignCount(query)
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

export async function getUsableBalance() {
  const body = await fengming
    .get('/balance/usable')
    .json()

  return body.data
}

export async function checkCreativeContent(opts) {
  const body = await fengming
    .post('/creative/validate')
    .send(reverseCamelcase(opts))
    .json()

  return body.data
}

export async function getQiqiaobanPageList() {
  const body = await fengming
    .get('/creative/url/qiqiaoban')
    .json()

  return toCamelcase(body.data)
}

export async function recommendByUrl(url, areas = []) {
  const body = await fengming
    .post('/keyword/recommand/vad')
    .send({
      url,
      areas
    })
    .json()

  return fmtWords(toCamelcase(body.data))
}

export async function recommendByWord(word, areas = []) {
  const body = await fengming
    .post('/keyword/recommand/word')
    .send({
      word,
      areas
    })
    .json()

  const words = fmtWords(toCamelcase(body.data))
  if (isArray(words)) {
    const first = words.find(w => w.word === word)
    if (first) {
      return [first, ...words.filter(w => w.word !== word)]
    }
  }

  return words
}

export async function getChangeLogs(opts) {
  const body = await fengming
    .get('/balance/changelog')
    .query(reverseCamelcase(opts))
    .json()

  return {
    total: body.meta.count,
    logs: toCamelcase(body.data)
  }
}

export async function getChargeLogs(opts) {
  const body = await fengming
    .get('/balance/chargelog')
    .query(reverseCamelcase(opts))
    .json()

  return {
    total: body.meta.count,
    logs: toCamelcase(body.data)
  }
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
    limit: pageSize,
    offset
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
  const [ campaignCount, balance, daily ] = await Promise.all([
    getCurrentCampaignCount(),
    getCurrentBalance(),
    _getDailySummary()
  ])

  return {
    balance,
    campaignCount,
    ...daily
  }
}

export async function getCurrentCampaignCount(opts) {
  const body = await fengming
    .get('/campaign/current/count')
    .query(opts)
    .json()

  return body.data
}

export async function sendQuestion(content) {
  const body = await fengming
    .post('/qa')
    .send({content})
    .json()

  return body.data
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

function fmtWords(words) {
  if (!isArray(words)) {
    return words
  }

  return words.map(w => ({
    id: w.word,
    ...w
  }))
}
