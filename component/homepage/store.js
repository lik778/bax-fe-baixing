import { getHomePageFengmingData, checkAuthorize } from 'api/fengming'
import { getHomePageBiaowangData, getPromotes, getUserRanking } from 'api/biaowang'
import { observable, toJS, action, computed } from 'mobx'
import dayjs from 'dayjs'

class Store {
  @observable fengmingData = null
  @observable biaowangData = null
  @observable biaowangPromotes = null
  @observable fengmingOptimizer = null

  @computed get fengmingBalance () {
    const data = this.fengmingData
    return {
      price: data ? (data.balance / 100).toFixed(2) : null,
      day: data ? data.balance / data.budget | 0 : null,
      freezeBalance: data ? (data.freezeBalance / 100).toFixed(2) : null
    }
  }

  @computed get biaowangBalance () {
    const data = this.biaowangData
    return {
      price: data ? (data.biaowangBalance / 100).toFixed(2) : null
    }
  }

  @computed get notices () {
    return {
      fengming: this.fengmingData && toJS(this.fengmingData.notices)
    }
  }

  @action async loadBaxData (params) {
    try {
      const fengmingData = await getHomePageFengmingData(params)
      this.fengmingData = fengmingData
    } catch (err) {
      console.error(err)
    }
  }

  @action async loadBiaowangData (userId) {
    try {
      const [biaowangData, { items: biaowangPromotes }] = await Promise.all([getHomePageBiaowangData({ userId }), getPromotes({ size: 5, page: 0, userId: userId })])
      const yesterday = dayjs().subtract(1, 'day').startOf('day').unix()
      const rankings = await getUserRanking({
        startTime: yesterday,
        endTime: yesterday,
        promoteList: biaowangPromotes.map(i => i.id),
        userId
      })
      this.biaowangPromotes = biaowangPromotes
      if (rankings.length) {
        this.biaowangPromotes = biaowangPromotes.map(p => {
          const one = rankings.find(r => r.promoteId === p.id)
          if (one && one.rankList.length) {
            return Object.assign(p, { cpcRanking: parseFloat(one.rankList[0]).toFixed(2) })
          }
          return p
        })
      }
      this.biaowangData = biaowangData
    } catch (err) {
      console.error(err)
    }
  }

  @action async getFengmingOptimizer (params) {
    const { data } = await checkAuthorize(params)
    if (data && data.length > 0) { this.fengmingOptimizer = data }
  }

  @action initPageStore (userId) {
    this.loadBaxData({ userId })
    this.loadBiaowangData(userId)
  }
}

export default new Store()
