
import { createStore } from 'vue-duo'

import {
  getAdGroups
} from './action'

const store = createStore({
  groups: []
})

store.subscribeActions({
  [getAdGroups]: ({groups = []}) => ({
    groups
  })
})

export default store
