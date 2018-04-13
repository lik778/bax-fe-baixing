
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

import {
  mergeKeywords
} from 'util/campaign'

const store = observable({
  _recommendedWords: [],
  _creativeWords: [],

  recommendedWordsOffset: 0,
  currentBalance: 0,
  campaignsCount: 0,

  get recommendedWords() {
    return toJS(this._recommendedWords)
  },
  get creativeWords() {
    return toJS(this._creativeWords)
  },

  setRecommendedWordsOffset(offset) {
    this.recommendedWordsOffset = offset
  },
  getRecommendedWords: action(async function(word) {
    const words = await fapi.getRecommendedWords(word)
    this.recommendedWordsOffset = this.recommendedWords.length
    this._recommendedWords = mergeKeywords(this._recommendedWords, words)
  }),
  getCreativeWords: action(async function(url) {
    const words = await fapi.getCreativeWords(url)
    this._creativeWords = words
  }),
  getCurrentBalance: action(async function() {
    this.currentBalance = await fapi.getCurrentBalance()
  }),
  getCampaignsCount: action(async function() {
    this.campaignsCount = fapi.getCurrentCampaignCount()
  }),
  clearStore: action(function() {
    this._recommendedWords = []
    this._creativeWords = []
  })
})

export default store
