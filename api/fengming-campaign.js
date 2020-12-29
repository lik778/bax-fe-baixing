import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming, trim } from './base'

import { TIME_UNIT_YEAR, DIMENSION_NONE } from 'constant/fengming-report'

export async function getCampaignKeywords (campaignId, opts = {}) {
  const q = {
    offset: 0,
    limit: 20,
    ...opts
  }

  const [body1, body2] = await Promise.all([
    fengming.get(`/campaign/${campaignId}/keyword`).query(q).json(),
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
export async function getCampaigns (opts = {}) {
  const body = await fengming
    .get('/campaign/simple')
    .query(
      reverseCamelcase({
        offset: 0,
        limit: 20,
        ...opts
      })
    )
    .json()

  return toCamelcase(body.data)
}

export async function getPreparedDownloads () {
  const body = await fengming.get('/data_report/prepared').json()

  return toCamelcase(body.data)
}

export async function getReport (opts = {}) {
  const q = reverseCamelcase(
    trim({
      offset: 0,
      limit: 100,
      ...opts
    })
  )

  const [body1, body2, body3] = await Promise.all([
    fengming.get('/data_report').query(q).json(),
    fengming
      .get('/data_report')
      .query({
        ...q,
        count: true
      })
      .json(),
    fengming
      .get('/data_report')
      .query({
        ...q,
        data_dimension: DIMENSION_NONE, // 汇总
        time_unit: TIME_UNIT_YEAR
      })
      .json()
  ])

  // 妈蛋, body3 是汇总数据, 最终归并为 1 行
  const data = body3.data.reduce(
    (p, c) => ({
      cost: p.cost + c.cost,
      shows: p.shows + c.shows,
      clicks: p.clicks + c.clicks
    }),
    {
      cost: 0,
      shows: 0,
      clicks: 0
    }
  )

  return {
    rows: toCamelcase(body1.data),
    total: body2.data,
    offset: q.offset,
    limit: q.limit,
    summary: data
  }
}

export async function getDataReportByQueryWord (opts = {}) {
  const q = reverseCamelcase(
    trim({
      offset: 0,
      limit: 10,
      ...opts
    })
  )
  const body = await fengming
    .get('/data_report/query_word')
    .query({
      ...q
    })
    .json()

  return {
    rows: toCamelcase(body.data.data),
    total: body.data.totalElements,
    offset: q.offset,
    limit: q.limit
  }
}

export async function getCampaignRadar () {
  const body = await fengming.get('/campaign/radar').json()

  return toCamelcase(body.data)
}

export async function getCampaignLanding (query) {
  const body = await fengming
    .get('/campaign/current_landing')
    .query(reverseCamelcase(query))
    .json()
  return {
    ...body.data,
    total: body.meta.count
  }
}

export async function getCurrentCampaigns (query) {
  const body = await fengming
    .get('/campaign/current')
    .query(reverseCamelcase(query))
    .json()

  return toCamelcase(body.data)
}

export async function getValidateCampaigns (userId) {
  const body = await fengming
    .get('/data_report/visitor/valid_plan')
    .query(
      reverseCamelcase({
        userId
      })
    )
    .json()

  return toCamelcase(body.data)
}

export async function getDeductStatistic (campaignId) {
  const body = await fengming
    .get('/data_report/visitor/deduct_statistic')
    .query(
      reverseCamelcase({
        campaignId
      })
    )
    .json()

  return toCamelcase(body.data)
}

export async function getDeductDetail (opts) {
  const body = await fengming
    .get('/data_report/visitor/deduct_detail')
    .query(
      reverseCamelcase({
        ...opts
      })
    )
    .json()

  return {
    rows: toCamelcase(body.data.data),
    total: body.data.totalElements,
    offset: opts.offset,
    limit: opts.limit
  }
}
