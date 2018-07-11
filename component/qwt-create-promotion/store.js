
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

import {
  MIN_WORD_PRICE
} from 'constant/keyword'

import {
  mergeKeywords
} from 'util/campaign'

const store = observable({
  _urlRecommends: [],
  _searchRecommends: [],

  currentBalance: 0,
  campaignsCount: 0,

  get searchRecommends() {
    return toJS(this._searchRecommends)
  },
  get urlRecommends() {
    return toJS(this._urlRecommends)
  },
  recommendByUrl: action(async function(url, areas) {
    const words = await fapi.recommendByUrl(url, areas)
    this._urlRecommends = words.map(attachDisplayPrice)
  }),
  recommendByWord: action(async function(word, areas) {
    const words = await fapi.recommendByWord(word, areas)
    this._searchRecommends = mergeKeywords(this._searchRecommends, words.map(attachDisplayPrice))
  }),
  setCreativeWords: action(function(words) {
    // 场景: copy campaign 时, set keywords
    this._urlRecommends = words
  }),
  getCurrentBalance: action(async function() {
    this.currentBalance = await fapi.getCurrentBalance()
  }),
  getCampaignsCount: action(async function() {
    this.campaignsCount = fapi.getCurrentCampaignCount()
  }),
  clearStore: action(function() {
    this._searchRecommends = []
    this._urlRecommends = []
  })
})

function attachDisplayPrice(word) {
  const { price: serverPrice } = word
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
    ...word,
    serverPrice,
    price // override price, price is display value
  }
}


export default store
