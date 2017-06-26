
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

export const getCreativeWords = createAction((url) => {
  return fapi.getCreativeWords(url)
})

export const clearStore = createAction()
