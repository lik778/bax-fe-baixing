
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

import {
  MIN_WORD_PRICE
} from 'constant/keyword'

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

  recommendByWord: action(async function(word, areas) {
    const words = await fapi.recommendByWord(word, areas)
    this._recommendedWords = mergeKeywords(this._recommendedWords, words)
    this._recommendedWords = this._recommendedWords.map(w => {
      const { price: serverPrice } = w
      let price = serverPrice
      if (serverPrice <= 300) {
        price *= 3
      } else if (serverPrice <= 500) {
        price *= 2.5
      } else if (serverPrice <= 1000) {
        price *= 2
      } else {
        price *= 1.5
      }
      if (price < MIN_WORD_PRICE) {
        price = MIN_WORD_PRICE
      }
      return {
        ...w,
        serverPrice,
        price // override price, price is display value
      }
    })
  }),
  setCreativeWords: action(function(words) {
    // 场景: copy campaign 时, set keywords
    this._creativeWords = words
  }),
  recommendByUrl: action(async function(url, areas) {
    const words = await fapi.recommendByUrl(url, areas)
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
