
import { reverseCamelcase } from 'object-keys-mapping'
import { stringify } from 'query-string'
import { createAction } from 'vue-duo'

import * as fapi from 'api/fengming-report'

import {
  fengmingApiHost
} from 'config'

export const getCsvDownloadUrl = createAction((opts) => {
  return fengmingApiHost + '/data_report/statistic?' + stringify({
    ...reverseCamelcase(opts),
    export_csv: 1
  })
})

export const getStatistics = createAction((opts) => {
  return fapi.getStatistics(opts)
})
