
import { createStore } from 'vue-duo'

import {
  setCalendarOptions,
  getCalendar,
  clearStore,
  getAds
} from './action'

const store = createStore({
  calendarOptions: {
    categories: [],
    areas: [],
    start: '',
    end: ''
  },
  orders: [],
  ads: []
})

store.subscribeActions({
  [setCalendarOptions]: (options) => ({
    calendarOptions: {
      ...options
    }
  }),
  [getCalendar]: ({orders = []}) => ({
    orders
  }),
  [clearStore]: () => ({
    calendarOptions: {
      categories: [],
      areas: [],
      start: '',
      end: ''
    },
    orders: []
  }),
  [getAds]: ({ads = []}) => ({
    ads
  })
})

export default store
