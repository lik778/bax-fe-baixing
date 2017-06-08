import { createStore } from 'vue-duo'

import { summaryOfProduct } from './action'


const store = createStore({
    month: [],
    quarter: [],
    year: [],
    range: 'month'
})

store.subscribeActions({
  [summaryOfProduct]: profits => ({
    [store.state.range]: profits
  })
})

export default store
