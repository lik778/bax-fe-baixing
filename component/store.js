
import { createStore } from 'vue-duo'

import {
  toggleAddUserLeadVisible,
  toggleTuoguanVisible,
  getCurrentUser,
  getCategories,
  getAreas,
  getRoles
} from './action'

const store = createStore({
  allCategories: [],
  allAreas: [],
  allRoles: [],

  currentUser: {},

  addUserLeadVisible: false,
  tuoguanVisible: false
})

store.subscribeActions({
  [toggleAddUserLeadVisible]: () => ({
    addUserLeadVisible: !store.state.addUserLeadVisible
  }),
  [toggleTuoguanVisible]: () => ({
    tuoguanVisible: !store.state.tuoguanVisible
  }),
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
  })
})

export default store
