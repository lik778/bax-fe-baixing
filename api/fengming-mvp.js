
import { trim, toCamelcase, reverseCamelcase } from 'object-keys-mapping'
import qs from 'query-string'
import moment from 'moment'

import { fengming } from './base'

import {
  DIMENSION_CAMPAIGN,
  TIME_UNIT_YEAR,
  TIME_UNIT_DAY,
  DEVICE_ALL
} from 'constant/fengming-report'

import {
  fengmingApiHost
} from 'config'

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
  let campaigns = []
  let total = 0

  if (opts.id) {
    const campaign = await getCampaignInfo(opts.id)

    if (campaign && campaign.id) {
      campaigns = [campaign]
      total = 1
    }
  } else {
    const body = await fengming
      .get('/simple/campaign')
      .query(reverseCamelcase(trim(opts)))
      .json()

    campaigns = toCamelcase(body.data)
    total = body.meta.count
  }

  const ids = campaigns.map(c => c.id)

  let reports = []

  if (ids.length) {
    const result = await getMvpReport({
      dataDimension: DIMENSION_CAMPAIGN,
      campaignIds: ids,
      timeUnit: TIME_UNIT_DAY,
      device: DEVICE_ALL,

      limit: 100,
      offset: 0,
      startAt: moment().startOf('day').unix(),
      endAt: moment().unix()
    })

    reports = result.rows
  }

  return {
    campaigns: campaigns.map(c => {
      c.todayCost = 0
      for (const r of reports) {
        if (r.campaignId === c.id) {
          c.todayCost = r.cost
          break
        }
      }
      return c
    }),
    total
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
    return fengmingApiHost + '/simple/campaign/report?' + qs.stringify(q)
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
    // total: body2.data,
    total: body2.meta.count,
    offset: q.offset,
    limit: q.limit,
    summary: data
  }
}
