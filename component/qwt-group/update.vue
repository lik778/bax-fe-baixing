<template>
  <div class="qwt-update-group" v-if="group">
    <section>
      <header>推广目标设置</header>
      <div class="content">
        <landing-comp
          :value="group.name"
          @change="(name) => updateGroupData('name', name)"
        >
          <landing-page-comp
            :all-areas="allAreas"
            :landing-type="group.landingType"
            :landing-page="group.landingPage"
            :landing-page-id="group.landingPageId"
            :disabled="false"
            @change-landing="(args) => updateGroupData(args)"
          />
        </landing-comp>
      </div>
    </section>

    <section>
      <header>推广物料设置<creative-tip-comp /></header>
      <div class="content">
        <creative-comp
          :source="promotion.source"
          :audit-status="group.auditStatus"
          :detail-status-text="group.detailStatusText"
          :creatives="group.creatives"
          @add-creatives="() => group.creatives.push({ title: '', content: '' })"
          @remove-creatives="(idx) => group.creatives.splice(idx, 1)"
          @update-creatives="(idx, newData) => group.creatives.splice(idx, 1, newData)"
        />
      </div>
    </section>

    <section>
      <header>关键词管理（当前计划还可添加<strong>{{ keywordRemain }}</strong>个关键词）</header>
      <div class="content">
        <div class="keywords-container">
          <div class="pane">
            <header>添加推广关键词</header>
            <search-comp
              :campaign-id="promotion.id"
              :areas="promotion.areas"
              :sources="[promotion.source]"
              :origin-keywords="keywords.concat(group.negativeWords)"
              @add-keywords="(words) => words.concat(keywords)"
            />
          </div>
          <div class="pane">
            <header>搜索推广关键词</header>
            <el-input v-model="searchWord" class="input" placeholder="请输入关键词查询"/>
          </div>
        </div>
        <keyword-list-comp
          :platform="promotion.source"
          :show-prop-ranking="promotion.source !== SEM_PLATFORM_SHENMA"
          :group-offline="originGroup.status === CAMPAIGN_STATUS_OFFLINE"
          :group-online="originGroup.status === CAMPAIGN_STATUS_ONLINE"
          :keywords="keywords"
          :group-id="groupId"
          :search-word="searchWord"
          @update-origin-keywords="(changeTag, v) => originKeywords.map(o => ({ ...o, [changeTag]: v }))"
          @update-keywords="(words) => (keywords = words)"
          @remove-keywords="(idx) => keywords.splice(idx, 1)"
        />
      </div>
    </section>

    <section>
      <header>设置否定关键词
        <el-tooltip content="请注意，否词和关键词不能重复" placement="top">
          <i class="el-icon-question" />
        </el-tooltip>
      </header>
      <div class="content">
        <negative-keyword-comp
          :negative-words="group.negativeWords"
          @add-negative-words="(words) => group.negativeWords = words.concat(group.negativeWords)"
          @remove-negative-words="(idx) => group.negativeWords.splice(idx, 1)"
        />
      </div>
    </section>

    <section>
      <mobile-price-ratio-comp
        :value="group.mobilePriceRatio"
        @change="(val) => updateGroupData('mobilePriceRatio', val)"
      />
      <contract-ack-comp
        class="contract-ack"
        type="content-rule"
        ref="contract"
      />
      <el-button class="add-group-btn" type="primary" @click="updateGroup">新增单元</el-button>
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

import { SEM_PLATFORM_SHENMA, SEM_PLATFORM_BAIDU, CAMPAIGN_STATUS_OFFLINE, CAMPAIGN_STATUS_ONLINE } from 'constant/fengming'
import clone from 'clone'
import pick from 'lodash.pick'
import { updateValidator } from './validate'

import { getCampaignInfo } from 'api/fengming'

export default {
  name: 'qwt-update-group',
  props: {
    allAreas: {
      type: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      SEM_PLATFORM_SHENMA,
      SEM_PLATFORM_BAIDU,
      CAMPAIGN_STATUS_OFFLINE,
      CAMPAIGN_STATUS_ONLINE,

      promotion: null,
      originGroup: null,
      group: null,
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
    const res = await getCampaignInfo(4012)
    this.originGroup = pick(res, ['landingType', 'landingPage', 'landingPageId', 'name', 'status', 'auditStatus', 'detailStatusText', 'creative', 'negativeWords', 'mobilePriceRatio'])
    this.originGroup.creatives = [res.creative]
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
      if (typeof type === 'string') {
        this.group[type] = data
        return
      }
      Object.assign(this.group, type)
    },
    updateCreatives ({ type, idx, data }) {
      const creatives = this.group.creatives
      switch (type) {
        case 'add':
          return creatives.push({ title: '', content: '' })
        case 'remove':
          return creatives.splice(idx, 1)
        case 'update':
          return creatives.splice(idx, 1, data)
      }
    },
    async validateGroup () {
      if (!this.$refs.contract.$data.isAgreement) {
        throw new Error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.isUpdating) {
        throw new Error('正在更新中, 请稍等一会儿 ~')
      }

      try {
        await updateValidator.validate(this.group)
      } catch (e) {
        throw new Error(e.errors[0].message)
      }
    },
    async updateGroup () {
      try {
        await this.validateGroup()
        this.isUpdating = true
        // TODO 获取修改单元数据
        // TODO 编辑单元接口请求
        this.$router.push({ name: 'qwt-update-promotion', params: { id: this.promotion.campaignId } })
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.isUpdating = false
      }
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
}
</style>
