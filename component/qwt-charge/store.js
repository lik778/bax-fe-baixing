
import { createStore } from 'vue-duo'

import {
  getProductPackages,
  getProducts
} from './action'

const store = createStore({
  packages: [],
  products: []
})

store.subscribeActions({
  [getProductPackages]: (packages) => ({
    packages
  }),
  [getProducts]: (products) => ({
    products
  })
})

export default store
