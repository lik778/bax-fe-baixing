import {
  getCampaignLanding,
  getHomepageSummary,
  getCurrentCampaigns
} from 'api/fengming-campaign'
import { observable, action } from 'mobx'

const formatlandingPageList = res => {
  return Object.entries(res).reduce((list, [k, v]) => {
    return list.concat({
      ...v,
      id: k
    })
  }, [])
}

class Store {
  @observable campaignMap = {}
  @observable landingPageLoading = false
  @observable landingPageList = null
  @observable summary = null

  @action
  async fetchPromotionList (id, campaignIds, isForceUpdate) {
    // 判断是否已经存在
    const campaignMap = this.campaignMap
    const campaignMapKeys = Object.keys(campaignMap)
    if (isForceUpdate || !campaignMapKeys.includes(id)) {
      const campaigns = await getCurrentCampaigns({ ...this.queryParams, campaignIds })
      this.campaignMap = Object.freeze({
        ...campaignMap,
        [id]: campaigns
      })
    }
  }

  @action
  async fetchlandingPageList (queryParams) {
    this.landingPageLoading = true
    try {
      const result = await getCampaignLanding(queryParams)
      this.landingPageList = formatlandingPageList(result)
    } catch (err) {
      console.error(err)
    } finally {
      this.landingPageLoading = false
    }
  }

  @action
  async fetchSummary () {
    this.summary = await getHomepageSummary()
  }
}

export default new Store()
