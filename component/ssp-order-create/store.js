
import { createStore } from 'vue-duo'
import clone from 'clone'

import {
  setCalendarOptions,
  getCalendar,

  clearStore,
  getAdPrice,
  getAds
} from './action'

const emptyCalendarOptions = {
  categories: [],
  areas: [],
  start: '',
  end: ''
}

const store = createStore({
  calendarOptions: clone(emptyCalendarOptions),
  orders: [], // 用于排期检测

  adPrice: {},
  ads: []
})

store.subscribeActions({
  [setCalendarOptions]: (opts) => ({
    calendarOptions: clone(opts)
  }),
  [getCalendar]: ({orders = []}) => ({
    orders
  }),

  [clearStore]: () => ({
    calendarOptions: clone(emptyCalendarOptions),
    adPrice: {}
  }),
  [getAdPrice]: (price) => ({
    adPrice: {...price}
  }),
  [getAds]: ({ads = []}) => ({
    ads
  })
})

export default store
