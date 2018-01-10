
import { createAction } from 'vue-duo'

import * as api from 'api/fengming-campaign'
import * as fapi from 'api/fengming'

export const downloadCsv = createAction(opts => {
  return api.getReport({
    ...opts,
    exportCsv: 1
  })
})

export const getPreparedDownloads = createAction(api.getPreparedDownloads)

export const getCampaignInfo = createAction(fapi.getCampaignInfo)

export const getReport = createAction(api.getReport)

export const clearStatistics = createAction()
