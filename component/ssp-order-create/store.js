
import { observable, action, toJS } from 'mobx'
import clone from 'clone'

import * as oapi from 'api/order'
import * as aapi from 'api/ad'

const emptyCalendarOptions = {
  categories: [],
  areas: [],
  start: '',
  end: ''
}

const store = observable({
  _calendarOptions: clone(emptyCalendarOptions),
  _orders: [], // 用于排期检测

  _adPrice: {},
  _ads: [],

  get calendarOptions() {
    return toJS(this._calendarOptions)
  },

  get orders() {
    return toJS(this._orders)
  },

  get adPrice() {
    return toJS(this._adPrice)
  },

  get ads() {
    return toJS(this._ads)
  },

  setCalendarOptions: action(function(opts) {
    this._calendarOptions = clone(opts)
  }),

  getCalendar: action(async function(opts) {
    const { orders = [] } = await oapi.getCalendar(opts)
    this._orders = orders
  }),

  clearStore: action(function() {
    this._calendarOptions = clone(emptyCalendarOptions)
    this._adPrice = {}
  }),

  getAdPrice: action(async function(aid, opts) {
    this._adPrice = await aapi.getAdPrice(aid, opts)
  }),

  getAds: action(async function() {
    const { ads = [] } = await aapi.getAds()
    this._ads = ads
  })
})

export default store
