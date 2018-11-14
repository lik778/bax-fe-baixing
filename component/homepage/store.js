import { observable, toJS, action, computed } from 'mobx'
import { getHomePageFengmingData } from 'api/fengming'
import { baxUserLogin, kaSimpleReport } from 'api/ka'
import { getCampaignRadar } from 'api/fengming-campaign'

class Store {
  @observable fengmingData = null
  @observable kaSiteData = null
  @observable campaignRadar = null

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
    return {
      fengming: this.fengmingData && toJS(this.fengmingData.notices),
      kaSite: this.kaSiteData && toJS(this.kaSiteData.messages)
    }
  }

  @action
  async initPageStore() {
    const [fengmingData, campaignRadar] = await Promise.all([getHomePageFengmingData(), getCampaignRadar(), baxUserLogin()])
    const kaSiteData = await kaSimpleReport()
    this.fengmingData = fengmingData
    this.kaSiteData = kaSiteData
    this.campaignRadar = campaignRadar
  }
}

export default new Store()
