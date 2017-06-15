
import * as fapi from 'api/fengming'

import { createAction } from 'vue-duo'

export const createCampaign = createAction((data) => {
  return fapi.createCampaign(data)
})

export const getCurrentBalance = createAction(() => {
  return fapi.getCurrentBalance()
})

export const checkCreativeContent = createAction((opts) => {
  return fapi.checkCreativeContent(opts)
})

export const getRecommendedWords = createAction((word) => {
  return fapi.getRecommendedWords(word)
})

export const getCreativeWords = createAction((opts) => {
  return fapi.getCreativeWords(opts)
})

export const clearStore = createAction()
