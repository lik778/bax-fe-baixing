
import { reverseCamelcase } from 'object-keys-mapping'
import { stringify } from 'query-string'
import { createAction } from 'vue-duo'

import * as api from 'api/fengming-campaign'

import {
  fengmingApiHost
} from 'config'

export const getCsvDownloadUrl = createAction(opts => {
  return fengmingApiHost + '/data_report?' + stringify({
    ...reverseCamelcase(opts),
    export_csv: 1
  })
})

export const getReport = createAction(api.getReport)

export const clearStatistics = createAction()
