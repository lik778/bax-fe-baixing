
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming, trim } from './base'

export async function createCampaign(data) {
  const body = await fengming
    .post('/campaign')
    .send(reverseCamelcase(data))
    .json()

  return body.data
}

export async function activeCampaigns(ids) {
  return await fengming
    .post('/campaign/active')
    .send(reverseCamelcase({
      campaignIds: [...ids]
    }))
    .json()
}

export async function pauseCampaigns(ids) {
  return await fengming
    .post('/campaign/pause')
    .send(reverseCamelcase({
      campaignIds: [...ids]
    }))
    .json()
}

export async function getCurrentCampaigns(opts) {
  const query = trim({
    offset: 0,
    limit: 20,
    ...opts
  })

  const [promotions, total] = await Promise.all([
    _getCurrentCampaigns(query),
    _getCurrentCampaignCount(query)
  ])

  return {
    query: {
      ...query,
      total
    },
    promotions
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

export async function getStatistics(opts) {
  const body = await fengming
    .get('/data_report/statistic')
    .query(reverseCamelcase(opts))
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
