<template>
  <div class="qwt-create-group">
    <section>
      <header>推广目标设置
        <p class="target-tip">
          按点击付费，展现免费，100元一键投放百度，神马等多渠道
          <el-popover trigger="hover">
            <img src="//file.baixing.net/201809/a995bf0f1707a3e98a2c82a5dc5f8ad3.png"
                 width="638"
                 height="405">
            <a slot="reference"
               class="">查看详情</a>
          </el-popover>
        </p>
      </header>
      <div class="content">
        <landing-comp :value="group.name"
                      @change="(val) => updateGroupData('name', val)">
          <landing-page-comp :all-areas="allAreas"
                             :landing-type="LANDING_TYPE_STORE"
                             :landing-page="group.landingPage"
                             :landing-page-id="group.landingPageId"
                             @change-landing="(args) => updateGroupData(args)" />
        </landing-comp>
      </div>
    </section>

    <section>
      <header>推广物料设置
        <creative-tip-comp />
      </header>
      <div class="content">
        <creative-comp :source="promotion.source"
                       :creatives="group.creatives"
                       @add-creatives="() => group.creatives.push({ title: '', content: '' })"
                       @remove-creatives="(idx) => group.creatives.splice(idx, 1)"
                       @update-creatives="(idx, newData) => group.creatives.splice(idx, 1, newData)" />
      </div>
    </section>

    <section>
      <header>选取推广关键词（当前计划还可添加<strong>{{keywordRemainCount}}</strong>个关键词）</header>
      <div class="content">
        <keyword-comp :keywords="group.keywords"
                       :userInfo="userInfo"
                      @remove-keywords="(idx) => group.keywords.splice(idx, 1)">
          <search-comp :areas="promotion.areas"
                       :sources="[promotion.source]"
                       :landing-type="group.landingType"
                       :landing-page="group.landingPage"
                       :creatives="group.creatives"
                       :all-words="group.keywords.concat(group.negativeWords)"
                       @track="(action, opts) => handleTrack(action, opts)"
                       @add-keywords="handleAddKeywords"
                       slot="search" />
        </keyword-comp>
      </div>
    </section>

    <section>
      <header>设置否定关键词
        <el-tooltip content="请注意，否词和关键词不能重复"
                    placement="top">
          <i class="el-icon-question" />
        </el-tooltip>
      </header>
      <div class="content">
        <p class="tip"
           style="margin-bottom: 20px">
          当网民的搜索词与精确否定关键词完全一致时，您的推广结果将不会展现。 否词个数不得超过
          <strong>{{ negativeKeywordMax }}</strong>个,
          当前否定关键词数量: <strong>{{ group.negativeWords.length }}</strong>个
        </p>
        <negative-keyword-comp :negative-words="group.negativeWords"
                               :show-tip="false"
                               :userInfo="userInfo"
                               :negative-keywords-max="negativeKeywordMax"
                               @track="(action, opts) => handleTrack(action, opts)"
                               :all-words="group.negativeWords.concat(group.keywords)"
                               @add-negative-words="(words) => group.negativeWords = words.concat(group.negativeWords)"
                               @remove-negative-words="removeNegatives"
                               @remove-other-words="(word) => group.negativeWords.splice(word,1)"
                               />
      </div>
    </section>
    <section>
      <cpc-price-comp style="margin-bottom: 10px"
                      :value="group.price"
                      @change="(val) => updateGroupData('price', val)" />
      <mobile-price-ratio-comp v-if="promotion.source === 9999"
                               :value="group.mobilePriceRatio"
                               @change="(val) => updateGroupData('mobilePriceRatio', val)" />
      <contract-ack-comp class="contract-ack"
                         type="content-rule"
                         ref="contract" />
      <el-button class="add-group-btn"
                 type="primary"
                 :disabled="createBtnDisabled"
                 @click="addGroup">新增单元</el-button>
    </section>
  </div>
</template>

<script>
import LandingComp from './landing-page'
import LandingPageComp from './landing-page/landing'
import CreativeComp from './creative'
import CreativeTipComp from './creative/creative-tip'
import KeywordComp from './keyword/create'
import NegativeKeywordComp from 'com/common/qwt/negative-words'
import ContractAckComp from 'com/widget/contract-ack'
import MobilePriceRatioComp from './mobile-price-ratio'
import CpcPriceComp from './cpc-price'
import SearchComp from './keyword/search'

import { createValidator } from './validate'
import {
  createGroup,
  getCampaignInfo,
  getCampaignKeywordsCount,
  getGroupDetailByGroupId,
  getKeywordsByGroupId
} from 'api/fengming'
import track from 'util/track'
import {
  emptyGroup,
  NEGATIVE_KEYWORDS_MAX,
  NEGATIVE_KEYWORDS_SOGOU_MAX,
  KEYWORDS_MAX,
  CAMPAIGN_STATUS_OFFLINE,
  SEM_PLATFORM_BAIDU,
  SEM_PLATFORM_SOGOU,
  LANDING_TYPE_GW,
  LANDING_TYPE_AD,
  LANDING_TYPE_STORE
} from 'constant/fengming'
import clone from 'clone'
import pick from 'lodash.pick'
import uuid from 'uuid/v4'
import { isBaixingSales } from 'util/role'
import { toFloat } from 'util/kit'

const emptyPromotion = {
  id: '',
  source: 0,
  areas: []
}

export default {
  name: 'qwt-create-group',
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      SEM_PLATFORM_BAIDU,
      LANDING_TYPE_STORE,

      promotion: emptyPromotion,
      group: clone(emptyGroup),
      actionTrackId: uuid(),

      campaignKeywordLen: 0,

      loading: {
        updateGroup: false
      }
    }
  },
  computed: {
    keywordRemainCount () {
      const newLen = this.group.keywords.length
      return KEYWORDS_MAX - (this.campaignKeywordLen + newLen)
    },
    negativeKeywordMax () {
      return this.promotion.source === SEM_PLATFORM_SOGOU ? NEGATIVE_KEYWORDS_SOGOU_MAX : NEGATIVE_KEYWORDS_MAX
    },
    campaignId () {
      return this.promotion.id || parseInt(this.$route.query.campaignId)
    },
    isSales () {
      return isBaixingSales(this.userInfo.roles)
    },
    isCampaignOffline () {
      return this.promotion.frontCampaignStatus === CAMPAIGN_STATUS_OFFLINE
    },
    createBtnDisabled () {
      const { query: { source } } = this.$route
      return (this.loading.updateGroup || this.isSales || this.isCampaignOffline) && !source
    }
  },
  async mounted () {
    this.handleTrack('enter-page: create-group')

    const loadingInstance = this.$loading({
      lock: true,
      target: '.qwt-create-group',
      text: '正在加载中...',
      spinner: 'el-icon-loading'
    })
    try {
      // 复制进入
      const { query: { cloneId, user_id: userId, campaignId } } = this.$route
      if (cloneId) {
        await this.cloneGroupById(cloneId)
      }
      const promotion = await getCampaignInfo(campaignId, { userId })
      this.promotion = pick(promotion, ['id', 'source', 'areas'])
      this.campaignKeywordLen = await getCampaignKeywordsCount(campaignId, userId)
    } catch (error) {
      console.error('error:', error)
    } finally {
      loadingInstance.close()
    }
  },
  methods: {
    async cloneGroupById (groupId) {
      const { query: { user_id: userId } } = this.$route
      const originGroup = await getGroupDetailByGroupId(groupId, { userId })
      const keywords = await getKeywordsByGroupId(groupId, userId)
      const group = pick(originGroup, ['creatives', 'landingPage', 'landingType', 'landingPageId', 'mobilePriceRatio', 'negativeWords'])

      // TIP: 2021-06-16 谢丽珍 全面下线官网落地页，如果原有是官网的，默认选中帖子
      if (group.landingType === LANDING_TYPE_GW) {
        group.landingType = LANDING_TYPE_AD
        group.landingPage = ''
        group.landingPageId = ''
      }

      this.group = {
        ...emptyGroup,
        ...group,
        keywords
      }

      this.promotion = clone(originGroup.campaign)
    },
    handleTrack (action, opts = {}) {
      const { actionTrackId, userInfo } = this
      const { query: { campaignId } } = this.$route
      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: action,
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        campaignId: campaignId,
        actionTrackId,
        ...opts
      })
    },
    updateGroupData (type, data) {
      if (typeof type === 'string') {
        this.group[type] = data
        return
      }
      Object.assign(this.group, type)
    },
    async validateGroup () {
      if (!this.$refs.contract.$data.isAgreement) {
        throw new Error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.loading.updateGroup) {
        throw new Error('正在更新中, 请稍等一会儿 ~')
      }

      try {
        console.log(this.group)
        await createValidator.validate({
          ...this.group,
          price: toFloat(this.group.price) * 100,
          promotion: this.promotion
        }, { first: true })
      } catch (e) {
        throw new Error(e.errors[0].message)
      }
    },
    async addGroup () {
      const { query: { campaignId } } = this.$route
      try {
        await this.validateGroup()
      } catch (e) {
        return this.$message.error(e.message)
      }

      try {
        this.loading.updateGroup = true
        await createGroup({
          ...this.group,
          price: toFloat(this.group.price) * 100,
          campaignId: campaignId
        })

        this.$message.success('创建单元成功')

        this.handleTrack('leave-page: create-group')

        this.$router.push({
          name: 'qwt-update-promotion',
          params: { id: campaignId }
        })
      } finally {
        this.loading.updateGroup = false
      }
    },
    handleAddKeywords (words) {
      this.group.keywords = words.concat(this.group.keywords)
    },
    removeNegatives (words = {}) {
      const index = this.group.negativeWords.findIndex(item => item.word === words.word && item.matchType === words.matchType)
      this.group.negativeWords.splice(index, 1)
    }
  },
  components: {
    LandingComp,
    LandingPageComp,
    CreativeComp,
    CreativeTipComp,
    KeywordComp,
    NegativeKeywordComp,
    ContractAckComp,
    MobilePriceRatioComp,
    CpcPriceComp,
    SearchComp
  }
}
</script>

<style lang="scss" scoped>
.qwt-create-group {
  > section {
    background: #fff;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 20px;
    font-size: 14px;
    color: #6a778c;
    > header {
      color: #6a778c;
      font-weight: 700;
      font-size: 14px;
      .target-tip {
        font-size: 0.88em;
        color: #333;
        display: inline-block;
        margin-left: 20px;
        font-weight: 400;
        a {
          margin-left: 10px;
          cursor: pointer;
          color: #15a4fa;
        }
      }
    }
    > .content {
      font-size: 14px;
      margin-top: 20px;
    }
    .contract-ack {
      margin-top: 10px;
    }
    .add-group-btn {
      margin-top: 20px;
    }
    .tip {
      font-size: 12px;
      color: #6a778c;
    }
    strong {
      color: $c-strong;
      font-size: 14px;
    }
  }
}
</style>
