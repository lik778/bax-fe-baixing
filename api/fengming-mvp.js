
import { toCamelcase, reverseCamelcase } from 'object-keys-mapping'
import { fengming } from './base'

export async function createCampaign(data) {
  const body = await fengming
    .post('/simple/campaign')
    .send(reverseCamelcase(data))
    .json()

  return body
}

export async function getCampaigns() {
  const body = await fengming
    .get('/simple/campaign')
    .json()

  return toCamelcase(body.data)
}

export async function updateCampaign(id, data) {
  const body = await fengming
    .post(`/simple/campaign/${id}`)
    .json()

  return body
}

export async function getCampaignInfo(id) {
  const body = await fengming
    .get(`/simple/campaign/${id}`)
    .json()

  return toCamelcase(body.data)
}
