
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

import {
  MIN_WORD_PRICE
} from 'constant/keyword'

const store = observable({
  _urlRecommends: [],
  _searchRecommends: [],

  currentBalance: 0,
  campaignsCount: 0,

  get searchRecommends () {
    return toJS(this._searchRecommends)
  },
  get urlRecommends () {
    return toJS(this._urlRecommends)
  },
  recommendByUrl: action(async function (opts = {}) {
    const words = await fapi.recommendByUrl(opts)
    this._urlRecommends = words.map(attachDisplayPrice)
  }),
  recommendByWord: action(async function (word, opts) {
    const words = await fapi.recommendByWord(word, opts)
    this._searchRecommends = words.slice(0, 10).map(attachDisplayPrice).map(attachValue)
  }),
  setCreativeWords: action(function (words) {
    // 场景: copy campaign 时, set keywords
    this._urlRecommends = words
  }),
  getCurrentBalance: action(async function (params) {
    this.currentBalance = await fapi.getCurrentBalance(params)
  }),
  getCampaignsCount: action(async function (params) {
    this.campaignsCount = fapi.getCurrentCampaignCount(params)
  }),
  clearStore: action(function () {
    this._searchRecommends = []
    this._urlRecommends = []
  }),
  getCampaignInfo (campaignId, params) {
    return fapi.getCampaignInfo(campaignId, params)
  }
})

function attachDisplayPrice (word) {
  const { price: serverPrice } = word
  let price = serverPrice * 1.2
  if (price < MIN_WORD_PRICE) {
    price = MIN_WORD_PRICE
  }
  return {
    ...word,
    serverPrice,
    price // override price, price is display value
  }
}

function attachValue (word) {
  return {
    ...word,
    value: word.word
  }
}

export default store
