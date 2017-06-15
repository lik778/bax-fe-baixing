
import { createAction } from 'vue-duo'

import * as fapi from 'api/fengming'

export const switchShowMoreFilters = createAction()

export const getCurrentCampaigns = createAction((opts) => {
  return fapi.getCurrentCampaigns(opts)
})

export const activeCampaigns = createAction((ids) => {
  return fapi.activeCampaigns(ids)
})

export const pauseCampaigns = createAction((ids) => {
  return fapi.pauseCampaigns(ids)
})
