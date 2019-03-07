import { baxUserLogin, kaSimpleReport } from 'api/ka'
import { getHomePageFengmingData } from 'api/fengming'
import { getHomePageBiaowangData, getPromotes, getCpcRanking } from 'api/biaowang'
import { getCampaignRadar } from 'api/fengming-campaign'
import { observable, toJS, action, computed } from 'mobx'

class Store {
  @observable fengmingData = null
  @observable kaSiteData = null
  @observable campaignRadar = null
  @observable biaowangData = null
  @observable biaowangPromotes = null

  @computed get fengmingBalance() {
    const data = this.fengmingData
    return {
      price: data ? (data.balance / 100).toFixed(2) : null,
      day: data ? data.balance / data.budget | 0 : null
    }
  }

  @computed get notices() {
    return {
      fengming: this.fengmingData && toJS(this.fengmingData.notices),
      kaSite: this.kaSiteData && toJS(this.kaSiteData.messages)
    }
  }
  @action async loadBaxData() {
    try {
      const [fengmingData, campaignRadar] = await Promise.all([getHomePageFengmingData(), getCampaignRadar()])
      this.fengmingData = fengmingData
      this.campaignRadar = campaignRadar
    } catch (err) {
      console.error(err)
    }
  }
  @action async loadKaData() {
    try {
      await baxUserLogin()
      const kaSiteData = await kaSimpleReport()
      this.kaSiteData = kaSiteData
    } catch (err) {
      console.error(err)
    }
  }
  @action async loadBiaowangData() {
    try {
      const [biaowangData, {items: biaowangPromotes}] = await Promise.all([getHomePageBiaowangData(), getPromotes({size: 5, page: 0})])
      console.log(biaowangPromotes)
      const promoteIds = biaowangPromotes.map(p => p.id)
      const cpcRanks = await getCpcRanking(promoteIds)
      this.biaowangData = biaowangData
      this.biaowangPromotes = biaowangPromotes.map((values, key) => ({cpcRank: cpcRanks[key] ? cpcRanks[key]['cpcRanking'] : '', ...values}))
    } catch (err) {
      console.error(err)
    }
  }
  @action initPageStore() {
    this.loadKaData()
    this.loadBaxData()
    this.loadBiaowangData()
  }
}

export default new Store()
