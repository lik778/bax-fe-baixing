
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming, trim } from './base'
import moment from 'moment'

import {
  CREATIVE_CHIBI_REJECT
} from 'constant/fengming'

const isArray = Array.isArray
const assign = Object.assign

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

  const campaign = toCamelcase(body.data)

  if (campaign.creative && campaign.creative.chibiStatus === CREATIVE_CHIBI_REJECT) {
    const { content, title } = campaign.creative
    const { source } = campaign
    // 针对赤壁拒绝创意审核, 获取 refuse reason
    const result = await checkCreativeContent({
      creativeContent: content,
      creativeTitle: title,
      platform: source
    })

    campaign.creative.extra = assign({}, campaign.creative.extra, {
      refuseReason: result.hint || ''
    })
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
    .post('/campaign')
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

export async function checkCreativeContent(opts) {
  const body = await fengming
    .post('/creative/check')
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
  const [ campaignCount, balance ] = await Promise.all([
    getCurrentCampaignCount(),
    getCurrentBalance()
  ])

  return {
    balance,
    campaignCount
  }
}

export async function getTuoguanStatus() {
  const body = await fengming
    .get('/trusteeship/status')
    .json()
  return toCamelcase(body.data)
}

export function createTuoguan(opts) {
  return fengming
    .post('/trusteeship')
    .send(reverseCamelcase(opts))
    .json()
}

export function stopTuoguan() {
  return fengming
    .post('/trusteeship/cancel')
    .json()
}

export function extendTuoguan(opts) {
  const query = {
    days: 30,
    ...opts
  }
  return fengming
    .post('/trusteeship/extend')
    .send(reverseCamelcase(query))
    .json()
}

export function verifyTuoguan(opts) {
  return fengming
    .get('/trusteeship/verify_create')
    .query(reverseCamelcase(opts))
    .json()
}

export async function tuoguanCode(code) {
  const body = await fengming
    .get('/trusteeship/code/' + code)
    .json()

  return toCamelcase(body.data)
}

export async function getCurrentCampaignCount(opts) {
  const body = await fengming
    .get('/campaign/current/count')
    .query(opts)
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
