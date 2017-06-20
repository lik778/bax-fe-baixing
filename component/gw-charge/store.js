
import { createStore } from 'vue-duo'

import {
  getProducts
} from './action'

const store = createStore({
  products: []
})

store.subscribeActions({
  [getProducts]: (products) => ({
    products
  })
})

export default store
