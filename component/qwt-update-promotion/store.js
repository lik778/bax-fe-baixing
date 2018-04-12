
import { observable, action, toJS } from 'mobx'
import clone from 'clone'

import * as fapi from 'api/fengming'

import {
  mergeKeywords
} from 'util/campaign'

import {
  toHumanTime
} from 'utils'

const emptyPromotion = {
  creativeContent: '',
  creativeTitle: '',
  dailyBudget: 0,
  landingPageId: '',
  landingPage: '',
  landingType: 0,
  validTime: [],
  keywords: [],
  extra: {},
  areas: [],
  source: 0
}

const store = observable({
  _originPromotion: clone(emptyPromotion),
  timeType: 'long', // long, custom

  _recommendedWords: [],
  currentBalance: 0,

  get originPromotion() {
    return toJS(this._originPromotion)
  },
  get recommendedWords() {
    return toJS(this._recommendedWords)
  },

  getRecommendedWords: action(async function(word) {
    const words = await fapi.getRecommendedWords(word)
    this._recommendedWords = mergeKeywords(this._recommendedWords, words)
  }),
  getCurrentBalance: action(async function() {
    this.currentBalance = await fapi.getCurrentBalance()
  }),
  getCampaignInfo: action(async function(id) {
    const info = await fapi.getCampaignInfo(id)

    let timeType = ''

    info.dailyBudget = info.dailyBudget / 100 | 0

    if (info.landingPageId) {
      info.landingPageId = String(info.landingPageId)
    } else {
      // landingPageId === 0, 保存为 ''
      delete info.landingPageId
    }

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
      info.creativeContent = info.creative.content
      info.creativeTitle = info.creative.title
      info.creativeStatus = info.creative.status
      info.creativeChibiStatus = info.creative.chibiStatus
      info.refuseReason = (info.creative.extra && info.creative.extra.refuseReason) || ''
      info.creative = undefined
    }

    this._originPromotion = {
      ...this._originPromotion,
      ...info
    }
    this.timeType = timeType
  }),
  setTimeType: action(function(timeType) {
    this.timeType = timeType
  }),
  clearStore: action(function() {
    this._originPromotion = clone(emptyPromotion)
    this._recommendedWords = []
    this.timeType = ''
  })
})

export default store
