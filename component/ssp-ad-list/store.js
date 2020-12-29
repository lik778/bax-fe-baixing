
import { observable, action, toJS } from 'mobx'

import * as mapi from 'api/material'
import * as aapi from 'api/ad'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0,

  timeRange: '', // xxx,ooo
  customerId: '',
  orderId: '',
  status: '',
  adId: ''
}

const store = observable({
  showMoreFilters: false,

  _query: { ...defaultQuery },
  _items: [],

  _materials: [],
  _ads: [],

  get query () {
    return toJS(this._query)
  },

  get items () {
    return toJS(this._items)
  },

  get materials () {
    return toJS(this._materials)
  },

  get ads () {
    return toJS(this._ads)
  },

  switchShowMoreFilters: action(function () {
    this.showMoreFilters = !this.showMoreFilters
  }),

  getMaterials: action(async function (opts) {
    const { materials = [] } = await mapi.getMaterials(opts)
    this._materials = materials
  }),

  getAdItems: action(async function (opts) {
    const { items = [], query = {} } = await aapi.getAdItems(opts)
    this._items = items
    this._query = {
      ...defaultQuery,
      ...query
    }
  }),

  getAds: action(async function () {
    const { ads = [] } = await aapi.getAds()
    this._ads = ads
  })
})

export default store
