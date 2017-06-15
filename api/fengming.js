
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming } from './base'

export async function createCampaign(data) {
  const body = await fengming
    .post('/campaign')
    .send(reverseCamelcase(data))
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
