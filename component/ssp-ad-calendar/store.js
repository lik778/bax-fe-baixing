
import { observable, action, toJS } from 'mobx'
import clone from 'clone'

import * as oapi from 'api/order'
import * as aapi from 'api/ad'

const store = observable({
  _calendarOptions: {
    categories: [],
    areas: [],
    start: '',
    end: ''
  },
  _orders: [],
  _ads: [],

  get calendarOptions () {
    return toJS(this._calendarOptions)
  },

  get orders () {
    return toJS(this._orders)
  },

  get ads () {
    return toJS(this._ads)
  },

  setCalendarOptions: action(function (opts) {
    this._calendarOptions = clone(opts)
  }),

  getCalendar: action(async function (opts) {
    const { orders = [] } = await oapi.getCalendar(opts)
    this._orders = orders
  }),

  clearStore: action(function () {
    this._calendarOptions = {
      categories: [],
      areas: [],
      start: '',
      end: ''
    }
    this._orders = []
  }),

  getAds: action(async function () {
    const { ads = [] } = await aapi.getAds()
    this._ads = ads
  })
})

export default store
