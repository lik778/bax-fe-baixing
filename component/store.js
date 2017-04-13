
import { createStore } from 'vue-duo'

import {
  getCurrentUser,
  getCategories,
  getAreas
} from './action'

const store = createStore({
  allCategories: [],
  allAreas: [],

  currentUser: {}
})

store.subscribeActions({
  [getCurrentUser]: (user) => ({
    currentUser: {...user}
  }),
  [getCategories]: (categories) => ({
    allCategories: [...categories]
  }),
  [getAreas]: (areas) => ({
    allAreas: [...areas]
  })
})

export default store
