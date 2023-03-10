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

export async function getReport (opts = {}, campaignFields) {
  const q = reverseCamelcase(
    trim({
      offset: 0,
      limit: 100,
      ...opts
    })
  )

  const [body1, body2, body3] = await Promise.all([
    fengming.get('/data_report')
      .query(q)
      .json(),
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
        time_unit: TIME_UNIT_YEAR,
        // 获取数据总量接口只能传计划相关字段
        fields: campaignFields
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

// 获取用户下的所有计划的以及消耗信息
export async function getAllCampaignsWithConsume (params) {
  const body = await fengming
    .get('/data_report/campaign_keyword')
    .query(reverseCamelcase(params))
    .json()

  return toCamelcase(body.data)
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
    .query(trim({
      ...q
    }))
    .json()

  return {
    rows: toCamelcase(body.data.data),
    total: body.data.totalElements,
    offset: q.offset,
    limit: q.limit
  }
}

export async function getCampaignList (params) {
  const body = await fengming
    .post('/campaign/info')
    .query(reverseCamelcase(params))
    .json()
  return toCamelcase(body.data)
}

export async function getCampaignIds (params) {
  const body = await fengming
    .get('/campaign/ids')
    .query(reverseCamelcase(params))
    .json()
  const data = [{ value: 0, label: '全部' }]
  body.data.map(id => {
    data.push({
      value: id,
      label: `计划${id}`
    })
    return true
  })
  return data
}

/**
 * @param {object} params
 * @param {number} params.user_id
 * @param {number} params.campaign_id
 */
export async function getGroupIds (params) {
  const body = await fengming
    .get('/group/ids')
    .query(reverseCamelcase(trim(params)))
    .json()
  const data = [{ value: 0, label: '全部' }]
  body.data.map(id => {
    data.push({
      value: id,
      label: `单元${id}`
    })
    return true
  })
  return data
}

export async function getGroupList (params) {
  const body = await fengming
    .post('/group/info')
    .query(reverseCamelcase(params))
    .json()
  return toCamelcase(body.data)
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

export async function getDeductStatistic (campaignId, userId) {
  const body = await fengming
    .get('/data_report/visitor/deduct_statistic')
    .query(
      reverseCamelcase({
        campaignId,
        userId
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
