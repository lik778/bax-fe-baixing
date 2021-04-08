<template>
  <div class="qwt-update-group"
       v-if="group">
    <section>
      <header>推广目标设置</header>
      <div class="content">
        <landing-comp :value="group.name"
                      @change="(name) => updateGroupData('name', name)">
          <landing-page-comp :all-areas="allAreas"
                             :landing-type="group.landingType"
                             :landing-page="group.landingPage"
                             :landing-page-id="group.landingPageId"
                             :disabled="false"
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
      <header>关键词管理（当前计划还可添加<strong>{{ keywordRemain }}</strong>个关键词）</header>
      <div class="content">
        <div class="keywords-container">
          <div class="pane">
            <header>添加推广关键词</header>
            <search-comp :campaign-id="promotion.id"
                         :areas="promotion.areas"
                         :landing-page="promotion.landingPage"
                         :landing-type="promotion.landingType"
                         :sources="[promotion.source]"
                         :all-words="keywords.concat(group.negativeWords)"
                         @track="handleTrackByAction"
                         @add-keywords="handleAddKeywords" />
          </div>
          <div class="pane">
            <header>搜索推广关键词</header>
            <el-input v-model="searchWord"
                      class="input"
                      placeholder="请输入关键词查询" />
          </div>
          <p class="tip" style="margin-top: 20px" v-if="promotion.source === SEM_PLATFORM_BAIDU">
            为保证流量，单计划内的关键词数≥<strong>30</strong>个才能选择精确匹配方式；
            单个计划最多可设置<strong>10</strong>个精确匹配。
          </p>
        </div>
        <keyword-list-comp ref="keywordListComp"
                           :platform="promotion.source"
                           :show-prop-ranking="promotion.source !== SEM_PLATFORM_SHENMA"
                           :group-offline="originGroup.status === CAMPAIGN_STATUS_OFFLINE"
                           :group-online="originGroup.status === CAMPAIGN_STATUS_ONLINE"
                           :keywords="keywords"
                           :group-id="groupId"
                           :origin-keywords="originKeywords"
                           :search-word="searchWord"
                           @update-origin-keywords="(changeTag, v) => originKeywords.map(o => ({ ...o, [changeTag]: v }))"
                           @update-keywords="(words) => (keywords = words)"
                           @remove-keywords="(idx) => keywords.splice(idx, 1)" />
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
        <p class="tip" style="margin-bottom: 20px">
          当网民的搜索词与精确否定关键词完全一致时，您的推广结果将不会展现。 否词个数不得超过 <strong>{{ NEGATIVE_KEYWORDS_MAX }}</strong>个,
          当前否定关键词数量: <strong>{{ group.negativeWords.length }}</strong>个
        </p>
        <negative-keyword-comp :negative-words="group.negativeWords"
                               :all-words="group.negativeWords.concat(keywords)"
                               :show-tip="false"
                               @add-negative-words="(words) => group.negativeWords = words.concat(group.negativeWords)"
                               @remove-negative-words="(idx) => group.negativeWords.splice(idx, 1)" />
      </div>
    </section>

    <section>
      <mobile-price-ratio-comp :value="group.mobilePriceRatio"
                               @change="(val) => updateGroupData('mobilePriceRatio', val)" />
      <contract-ack-comp class="contract-ack"
                         type="content-rule"
                         ref="contract" />
      <el-button class="add-group-btn"
                 type="primary"
                 @click="updateGroup">新增单元</el-button>
    </section>

  </div>
</template>

<script>
import LandingComp from './landing-page'
import LandingPageComp from './landing-page/landing'
import CreativeComp from './creative'
import CreativeTipComp from './creative/creative-tip'
import SearchComp from './keyword/search'
import NegativeKeywordComp from 'com/common/qwt/negative-words'
import ContractAckComp from 'com/widget/contract-ack'
import MobilePriceRatioComp from './mobile-price-ratio'
import KeywordListComp from './keyword/keyword-list'

import {
  SEM_PLATFORM_SHENMA,
  SEM_PLATFORM_BAIDU,
  CAMPAIGN_STATUS_OFFLINE,
  CAMPAIGN_STATUS_ONLINE,
  NEGATIVE_KEYWORDS_MAX,
  emptyGroup
} from 'constant/fengming'
import clone from 'clone'
import pick from 'lodash.pick'
import uuid from 'uuid/v4'
import { updateValidator } from './validate'
import track from 'util/track'
import { filterExistCurrentWords } from 'util/group'

import { getCampaignInfo } from 'api/fengming'

const emptyPromotion = {
  id: 0,
  source: 0,
  areas: []
}

export default {
  name: 'qwt-update-group',
  props: {
    allAreas: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      actionTrackId: uuid(),

      SEM_PLATFORM_SHENMA,
      SEM_PLATFORM_BAIDU,
      CAMPAIGN_STATUS_OFFLINE,
      CAMPAIGN_STATUS_ONLINE,
      NEGATIVE_KEYWORDS_MAX,

      promotion: emptyPromotion,
      originGroup: emptyGroup,
      group: emptyGroup,
      originKeywords: [],
      keywords: [],
      isUpdating: false,

      isSearchCondition: false,
      searchWord: ''
    }
  },
  computed: {
    keywordRemain () {
      return 0
    },
    groupId () {
      // TODO 放开注释，删除mock 4012
      // return this.$route.params.id
      return 4012
    }
  },
  async mounted () {
    // TODO mock 信息开始，后期删除
    const res = await getCampaignInfo(this.groupId)
    this.originGroup = pick(res, ['landingType', 'landingPage', 'landingPageId', 'name', 'status', 'auditStatus', 'detailStatusText', 'creative', 'negativeWords', 'mobilePriceRatio'])
    this.originGroup.creatives = [res.creative]
    this.originGroup.name = 'cesh'
    this.originKeywords = res.keywords
    // TODO: 接口获取promotion信息
    // TODO: 接口获取group信息
    // TODO: 接口获取keywords信息
    this.promotion = pick(res, ['source', 'areas', 'id'])
    this.group = clone(this.originGroup)
    this.keywords = clone(this.originKeywords)
    // TODO mock信息结束，后期删除
  },
  methods: {
    updateGroupData (type, data) {
      console.log(type)
      console.log(data)
      if (typeof type === 'string') {
        this.group[type] = data
        return
      }
      Object.assign(this.group, type)
    },
    handleTrackByAction (action) {
      const { userInfo, actionTrackId } = this
      track({
        action,
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId,
        campaignId: this.promotion.id
      })
    },
    handleAddKeywords (words) {
      this.keywords = words.concat(this.keywords)
      this.$refs.keywordListComp.$data.offset = 0
    },
    async validateGroup () {
      if (!this.$refs.contract.$data.isAgreement) {
        throw new Error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.isUpdating) {
        throw new Error('正在更新中, 请稍等一会儿 ~')
      }

      try {
        await updateValidator.validate({ ...this.group, keywords: this.keywords }, { first: true })
      } catch (e) {
        throw new Error(e.errors[0].message)
      }
    },
    async updateGroup () {
      try {
        await this.validateGroup()
        this.isUpdating = true
        this._updateGroup()
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.isUpdating = false
      }
    },
    _updateGroup () {
      const data = {}
      Object.assign(data, {
        ...this.getUpdatedLandingData(),
        ...this.getUpdatedNegativeWordData(),
        ...this.getUpdatedCreativeData(),
        ...this.getUpdatedKeywordData()
      })

      // TODO 编辑单元接口请求
      // TODO: 是否要做打点
      this.$router.push({ name: 'qwt-update-promotion', params: { id: this.promotion.id } })
    },
    getUpdatedLandingData () {
      const data = {}
      const { landingPage, landingType, landingPageId } = this
      if (landingType !== this.originGroup.landingType) data.landingType = landingType
      if (landingPage !== this.originGroup.landingPage) data.landingPage = landingPage
      if (landingPageId !== this.originGroup.landingPageId) data.landingPageId = landingPageId
      return data
    },
    getUpdatedNegativeWordData () {
      const data = {}
      const { negativeWords } = this.group
      const originNegativeWords = this.originGroup.negativeWords
      const newNegativeKeywords = filterExistCurrentWords(originNegativeWords, negativeWords)
      const deletedNegativeKeywords = filterExistCurrentWords(negativeWords, originNegativeWords)
      if (newNegativeKeywords.length) data.newNegativeKeywords = newNegativeKeywords
      if (deletedNegativeKeywords.length) data.deletedNegativeKeywords = deletedNegativeKeywords
      return data
    },
    getUpdatedCreativeData () {
      const data = {}
      const { creatives } = this.group
      const originCreatives = this.originGroup.creatives
      const newCreatives = creatives.filter(o => !o.id)
      const deletedCreatives = originCreatives.filter(o => !creatives.find(x => x.id === o.id))
      const updatedCreatives = originCreatives.filter(
        o => creatives.find(x => x.id === o.id && (x.title !== o.title || x.content !== o.content)))

      if (newCreatives.length) data.newCreatives = newCreatives
      if (deletedCreatives.length) data.deletedCreatives = deletedCreatives
      if (updatedCreatives.length) data.updatedCreatives = updatedCreatives
      return data
    },
    getUpdatedKeywordData () {
      const data = {}
      const newKeywords = this.keywords.filter(o => o.isNew)
      const deletedKeywords = this.keywords.filter(o => o.isDel)
      const updatedKeywords = this.keywords.filter(o => o.isUpdated)
      if (newKeywords.length) data.newKeywords = newKeywords
      if (deletedKeywords.length) data.deletedKeywords = deletedKeywords
      if (updatedKeywords.length) data.updatedKeywords = updatedKeywords
      return data
    }
  },
  components: {
    LandingComp,
    LandingPageComp,
    CreativeComp,
    CreativeTipComp,
    SearchComp,
    NegativeKeywordComp,
    ContractAckComp,
    MobilePriceRatioComp,
    KeywordListComp
  }
}
</script>

<style lang="scss" scoped>
.qwt-update-group {
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
    strong {
      color: $c-strong;
    }
  }

  .keywords-container {
    .pane {
      display: flex;
      align-items: center;
      &:not(:first-child) {
        margin-top: 10px;
      }
      > header {
        flex: 0 0 120px;
      }
      .input {
        width: 240px;
        margin-right: 6px;
      }
    }
    .tabs {
      margin-top: 20px;
    }
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
</style>
