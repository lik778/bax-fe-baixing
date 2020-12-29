
import { observable, action, toJS } from 'mobx'

import * as oapi from 'api/order'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0,

  createdAtFrom: '',
  createdAtTo: '',
  timeRange: '',
  orderId: '',
  status: '',
  userId: ''
}

const store = observable({
  showMoreFilters: false,

  _query: { ...defaultQuery },
  _orders: [],

  _ads: [],

  get query () {
    return toJS(this._query)
  },

  get orders () {
    return toJS(this._orders)
  },

  get ads () {
    return toJS(this._ads)
  },

  switchShowMoreFilters: action(async function () {
    this.showMoreFilters = !this.showMoreFilters
  }),

  getOrders: action(async function (opts) {
    const {
      orders = [],
      query = {}
    } = await oapi.getOrders(opts)

    this._orders = orders
    this._query = {
      ...defaultQuery,
      ...query
    }
  })
})

export default store
