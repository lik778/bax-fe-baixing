
import { createStore } from 'vue-duo'
import clone from 'clone'

import {
  landingTypeOpts
} from 'constant/fengming'

import {
  mergeKeywords
} from 'util/campaign'

import {
  toHumanTime
} from 'utils'

import {
  getRecommendedWords,
  getCurrentBalance,
  getCampaignInfo,
  setTimeType,
  clearStore
} from './action'

const emptyPromotion = {
  creativeContent: '',
  creativeTitle: '',
  dailyBudget: 0,
  landingPage: '',
  landingType: 0,
  validTime: [],
  keywords: [],
  areas: [],
  source: 0
}

const store = createStore({
  originPromotion: clone(emptyPromotion),
  timeType: 'long', // long, custom

  recommendedWords: [],
  currentBalance: 0,

  landingTypeOpts
})

store.subscribeActions({
  [getRecommendedWords]: (words) => ({
    recommendedWords: mergeKeywords(store.state.recommendedWords, words)
  }),
  [getCurrentBalance]: (balance) => ({
    currentBalance: balance
  }),
  [getCampaignInfo]: (info) => {
    let timeType = ''

    info.dailyBudget = info.dailyBudget / 100 | 0

    if (info.timeRange && info.timeRange.length &&
      (info.timeRange[0] !== null) &&
      (info.timeRange[1] !== null)) {
      info.validTime = [
        toHumanTime(info.timeRange[0], 'YYYY-MM-DD'),
        toHumanTime(info.timeRange[1], 'YYYY-MM-DD')
      ]

      timeType = 'custom'
    } else {
      info.validTime = []
      timeType = 'long'
    }

    if (info.creative) {
      info.landingType = info.creative.landingType
      info.landingPage = info.creative.landingPage
      info.creativeContent = info.creative.content
      info.creativeTitle = info.creative.title
      info.refuseReason = (info.creative.extra && info.creative.extra.refuseReason) || ''
      info.creative = undefined
    }

    return {
      originPromotion: {
        ...store.state.promotion,
        ...info
      },
      timeType
    }
  },
  [setTimeType]: (timeType) => ({
    timeType
  }),
  [clearStore]: () => ({
    originPromotion: clone(emptyPromotion),
    recommendedWords: [],
    timeType: ''
  })
})

export default store
