import { createStore } from 'vue-duo'

import { summaryOfProduct, setTarget, setRange } from './action'


const store = createStore({
    month: [],
    quarter: [],
    year: [],
    range: 'month',
    products: ['站内广告', '凤鸣', '大客户', '站外广告', '拼框', '标王']
})

store.subscribeActions({
  [summaryOfProduct]: profits => {
    console.log(profits)
    let result = {}, { range, products } = store.state
    const sum = products.reduce((a, b) => {
      if(!a[b]) {
        a[b] = {}
      }
      const [ yesterday, current, target ] = profits
      a[b]['yesterday'] = yesterday[b] || 0
      a[b]['current'] = current[b] || 0
      a[b]['target'] = target[b] || 0

      a['sum']['yesterday'] += yesterday[b] || 0
      a['sum']['current'] += current[b] || 0
      a['sum']['target'] += target[b] || 0

      return a
    }, {'sum': { target: 0, current: 0, yesterday: 0 }})
    console.log(sum)

    return {
      [range]: sum
    }
  },
  [setRange]: range => {
    return {
      range
    }
  }
})

export default store
