
import { createStore } from 'vue-duo'

import {
  getPageList
} from './action'

const store = createStore({
  pageList: []
})

store.subscribeActions({
  [getPageList]: (list) => ({
   pageList: list
  })
})

export default store
