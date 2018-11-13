import { observable, toJS, action, computed } from 'mobx'
import { getHomePageFengmingData } from 'api/fengming'

class Store {
  @observable fengmingData = null

  @computed
  get fengmingBalance() {
    const data = this.fengmingData
    return {
      price: data ? (data.balance / 100).toFixed(2) : null,
      day: data ? data.balance / data.budget | 0 : null
    }
  }

  @computed
  get notices() {
    if (!this.fengmingData) return {}
    return {
      fengming: toJS(this.fengmingData.notices)
    }
  }

  @action
  async initPageStore() {
    const data = await getHomePageFengmingData()
    this.fengmingData = data
  }
}

export default new Store()
