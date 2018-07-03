
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

import {
  mergeKeywords
} from 'util/campaign'

const store = observable({
  _recommendedWords: [],
  _creativeWords: [],

  currentBalance: 0,
  campaignsCount: 0,

  get recommendedWords() {
    return toJS(this._recommendedWords)
  },
  get creativeWords() {
    return toJS(this._creativeWords)
  },

  getRecommendedWords: action(async function(word, areas) {
    const words = await fapi.getRecommendedWords(word, areas)
    this._recommendedWords = mergeKeywords(this._recommendedWords, words)
  }),
  setCreativeWords: action(function(words) {
    // 场景: copy campaign 时, set keywords
    this._creativeWords = words
  }),
  getCreativeWords: action(async function(url, areas) {
    const words = await fapi.getCreativeWords(url, areas)
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
