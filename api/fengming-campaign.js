
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming, trim } from './base'

export async function getCampaignKeywords(campaignId, opts = {}) {
  const q = {
    offset: 0,
    limit: 20,
    ...opts
  }

  const [body1, body2] = await Promise.all([
    fengming
      .get(`/campaign/${campaignId}/keyword`)
      .query(q)
      .json(),
    fengming
      .get(`/campaign/${campaignId}/keyword`)
      .query({
        ...opts,
        count: true
      })
      .json()
  ])

  return {
    keywords: toCamelcase(body1.data) || [],
    total: body2.data,
    limit: q.limit,
    offset: q.offset
  }
}

/**
 * 注: 此 API 用于报表查询时, 选择 campaign
 *     simple -> 列表字段较少
 */
export async function getCampaigns(opts = {}) {
  const body = await fengming
    .get('/campaign/simple')
    .query(reverseCamelcase({
      offset: 0,
      limit: 20,
      ...opts
    }))
    .json()

  return toCamelcase(body.data)
}

export async function getReport(opts = {}) {
  const q = reverseCamelcase(trim({
    offset: 0,
    limit: 20,
    ...opts
  }))

  const [body1, body2] = await Promise.all([
    fengming
      .get('/data_report')
      .query(q)
      .json(),
    fengming
      .get('/data_report')
      .query({
        ...q,
        count: true
      })
      .json()
  ])

  return {
    rows: toCamelcase(body1.data),
    total: body2.total,
    offset: q.offset,
    limit: q.limit
  }
}
