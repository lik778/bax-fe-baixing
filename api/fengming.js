
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming } from './base'

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

export async function getCurrentCampaigns() {
  const body = await fengming
    .get('/campaign/current')
    .json()

  return toCamelcase(body.data)
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
