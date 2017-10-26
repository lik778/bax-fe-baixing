
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming, trim } from './base'

export async function getKeywords(opts) {
  const body = await fengming
    .get('/data_report/keywords')
    .query(reverseCamelcase(trim(opts)))
    .json()

  return toCamelcase(body.data)
}

export async function getPlans(opts) {
  const body = await fengming
    .get('/data_report/plans')
    .query(reverseCamelcase(trim(opts)))
    .json()

  return toCamelcase(body.data)
}

export async function getStatistics(opts) {
  const body = await fengming
    .get('/data_report/statistic')
    .query(reverseCamelcase(trim(opts)))
    .json()

  return toCamelcase(body.data)
}

export async function getReport(q = {}) {
  const body = await fengming
    .get('/data_report')
    .query(reverseCamelcase(q))
    .json()

  return toCamelcase(body.data)
}
