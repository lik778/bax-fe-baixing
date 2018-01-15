
import { createStore } from 'vue-duo'

import {
  getCurrentUser,
  getCategories,
  getAreas,
  getRoles,
  toggleTuoguanVisible
} from './action'

const store = createStore({
  allCategories: [],
  allAreas: [],
  allRoles: [],

  currentUser: {},

  tuoguanVisible: false
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
  }),
  [getRoles]: (roles) => ({
    allRoles: [...roles]
  }),

  [toggleTuoguanVisible]: () => ({
    tuoguanVisible: !store.state.tuoguanVisible
  })
})

export default store
