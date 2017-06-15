
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming } from './base'

export async function createCampaign(data) {
  return await fengming
    .post('/campaign')
    .send(reverseCamelcase(data))
    .json()
}
