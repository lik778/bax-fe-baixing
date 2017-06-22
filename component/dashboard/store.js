import { createStore } from 'vue-duo'

import { summaryOfProduct, setTarget, setRange, getTrend } from './action'


const store = createStore({
    month: {},
    quarter: {},
    year: {},
    range: 'month',
    products: ['站内广告', '凤鸣', '站外广告', 'APP广告', '拼框', '大客户'],
    trend: {}
})

store.subscribeActions({
  [summaryOfProduct]: profits => {
    let result = {}, { range, products } = store.state
    const sum = products.reduce((a, b) => {
      if(!a[b]) {
        a[b] = {}
      }
      const [ yesterday, current, target ] = profits
      a[b]['yesterday'] = yesterday[b] || 0
      a[b]['current'] = current[b] || 0
      a[b]['target'] = target[b] || 0
      return a
    }, {})
    return {
      [range]: sum
    }
  },
  [setRange]: range => ({ range }),
  [getTrend]: trend => ({ trend }),
  [setTarget]: raw => {
    let range = store.state[raw.range]
    range[raw.product]['target'] = raw.value
    console.log(range)
    return {
      [raw.range]: range
    }
  }
})

export default store
