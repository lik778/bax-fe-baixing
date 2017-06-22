
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming } from './base'

export async function getKeywords({channel}) {
  const body = await fengming
    .get('/data_report/keywords')
    .query({channel})
    .json()

  return toCamelcase(body.data)
}

export async function getPlans({channel}) {
  const body = await fengming
    .get('/data_report/plans')
    .query({channel})
    .json()

  return toCamelcase(body.data)
}

export async function getStatistics(opts) {
  const body = await fengming
    .get('/data_report/statistic')
    .query(reverseCamelcase(opts))
    .json()

  return toCamelcase(body.data)
}
