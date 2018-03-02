
import { trim, toCamelcase, reverseCamelcase } from 'object-keys-mapping'
import { fengming } from './base'

import {
  TIME_UNIT_YEAR
} from 'constant/fengming-report'

const isArray = Array.isArray

export async function queryAds(opts = {}) {
  const q = {
    offset: 0,
    limit: 3,
    ...opts
  }

  if (isArray(q.adIds)) {
    q.adIds = q.adIds.join(',')
  }

  const body = await fengming
    .get('/simple/ad')
    .query(reverseCamelcase(q))
    .json()

  return {
    ads: toCamelcase(body.data),
    total: body.meta.count
  }
}

export async function createCampaign(data) {
  const body = await fengming
    .post('/simple/campaign')
    .send(reverseCamelcase(data))
    .json()

  return body
}

export async function getCampaigns(opts = {}) {
  const body = await fengming
    .get('/simple/campaign')
    .query(reverseCamelcase(trim(opts)))
    .json()

  return {
    campaigns: toCamelcase(body.data),
    total: body.meta.count
  }
}

export async function updateCampaign(id, data) {
  const body = await fengming
    .post(`/simple/campaign/${id}`)
    .send(reverseCamelcase(data))
    .json()

  return body
}

export async function getCampaignInfo(id) {
  const body = await fengming
    .get(`/simple/campaign/${id}`)
    .json()

  return toCamelcase(body.data)
}

export async function getMvpReport(opts) {
  const q = reverseCamelcase(trim({
    offset: 0,
    limit: 100,
    ...opts
  }))

  if (q.export_csv) {
    return fengming
      .get('/simple/campaign/report')
      .query(q)
      .json()
  }

  const [body1, body2, body3] = await Promise.all([
    fengming
      .get('/simple/campaign/report')
      .query(q)
      .json(),
    fengming
      .get('/simple/campaign/report')
      .query({
        ...q,
        count: true
      })
      .json(),
    fengming
      .get('/simple/campaign/report')
      .query({
        ...q,
        time_unit: TIME_UNIT_YEAR
      })
      .json()
  ])

  // 妈蛋, body3 是汇总数据, 最终归并为 1 行
  const data = body3.data.reduce((p, c) => ({
    cost: p.cost + c.cost,
    shows: p.shows + c.shows,
    clicks: p.clicks + c.clicks
  }), {
    cost: 0,
    shows: 0,
    clicks: 0
  })

  return {
    rows: toCamelcase(body1.data),
    total: body2.data,
    offset: q.offset,
    limit: q.limit,
    summary: data
  }
}
