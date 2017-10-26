
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming } from './base'

export async function getCampaignKeywords(campaignId) {
  const body = await fengming
    .get(`/campaign/${campaignId}/keyword`)
    .json()

  return toCamelcase(body.data)
}

/**
 * 注: 此 API 用于报表查询时, 选择 campaign
 *     simple -> 列表字段较少
 */
export async function getCampaigns(userId) {
  const body = await fengming
    .get('/campaign/simple')
    .query(reverseCamelcase({
      userId
    }))
    .json()

  return toCamelcase(body.data)
}
