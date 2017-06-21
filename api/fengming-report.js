
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { fengming } from './base'

export async function getKeywords() {

}

export async function getStatistics(opts) {
  const body = await fengming
    .get('/data_report/statistic')
    .query(reverseCamelcase(opts))
    .json()

  return toCamelcase(body.data)
}
