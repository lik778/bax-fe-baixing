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
