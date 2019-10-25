
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

import {
  MIN_WORD_PRICE
} from 'constant/keyword'

const store = observable({
  _urlRecommends: [],
  _searchRecommends: [],

  currentBalance: 0,
  usableBalance: 0,
  campaignsCount: 0,

  get searchRecommends() {
    return toJS(this._searchRecommends)
  },
  get urlRecommends() {
    return toJS(this._urlRecommends)
  },
  getUsableBalance: action(async function() {
    this.usableBalance = await fapi.getUsableBalance()
  }),
  recommendByUrl: action(async function(url, areas) {
    const words = await fapi.recommendByUrl(url, areas)
    this._urlRecommends = words.map(attachDisplayPrice)
  }),
  recommendByWord: action(async function(word, opts) {
    const words = await fapi.recommendByWord(word, opts)
    this._searchRecommends = words.slice(0, 10).map(attachDisplayPrice).map(attachValue)
  }),
  recommendKeywordsList: action(async function(word, opts) {
    const words = await fapi.recommendByWordList(word, opts)
    let bannedList,normalList;
    if(words && Array.isArray(words.bannedList)){
      bannedList = words.bannedList.map(attachDisplayValues)
    }
    if(words && Array.isArray(words.normalList)){
      normalList = words.normalList.map(attachDisplayValues)
    }
    return {
      bannedList,
      normalList
    }
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
  }),
  getCampaignInfo(campaignId) {
    return fapi.getCampaignInfo(campaignId)
  }
})

function attachDisplayPrice(word) {
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

function attachValue(word) {
  return {
    ...word,
    value: word.word
  }
}

function attachDisplayValues(word) {
  const { price : serverPrice } = word
  let price = serverPrice
  if(serverPrice < MIN_WORD_PRICE){
    serverPrice = MIN_WORD_PRICE
  }
  return {
    ...word,
    serverPrice,
    price,
    value: word.word
  }
}

export default store
