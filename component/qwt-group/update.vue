<template>
  <div class="qwt-update-group" v-if="group">
    <section>
      <header>推广目标设置</header>
      <div class="content">
        <landing-page-comp
          :group="group"
          :is-edit="false"
          :promotion="promotion"
          :allAreas="allAreas"
          @change-name="(name) => updateGroupData('name', name)"
          @change-landing="(args) => updateGroupData(args)"
        />
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
          @update-creatives="updateCreatives"
        />
      </div>
    </section>

    <section>
      <header>关键词管理（当前计划还可添加<strong>{{ keywordRemain }}</strong>个关键词）</header>
      <div class="content">
        <keyword-comp
          :campaign-id="promotion.campaignId"
          :areas="promotion.areas"
          :sources="[promotion.source]"
          :updated-keywords="group.updatedKeywords"
          :deleted-keywords="group.deletedKeywords"
          :new-keywords="group.newKeywords"
          @update-keywords="updateKeywords"
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
          @update-negative-words="(negativeWords) => updateGroupData('negativeWords', negativeWords)"
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
import LandingPageComp from './landing-page'
import CreativeComp from './creative'
import CreativeTipComp from './creative/creative-tip'
import KeywordComp from './keyword/update'
import NegativeKeywordComp from 'com/common/qwt/negative-words'
import ContractAckComp from 'com/widget/contract-ack'
import MobilePriceRatioComp from './mobile-price-ratio'

import clone from 'clone'

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
      promotion: {
        source: 0,
        campaignId: '',
        areas: []
      },
      originGroup: {
        landingType: 0,
        landingPage: '',
        landingPageId: '',
        name: '',
        status: '',
        auditStatus: 0,
        detailStatusText: '',
        creatives: [
          {
            id: 1,
            title: 'nihao',
            content: 'ceshi'
          }
        ],
        negativeWords: [],
        mobilePriceRatio: 1
      },
      group: null
    }
  },
  computed: {
    keywordRemain () {
      return 0
    }
  },
  mounted () {
    this.group = {
      ...clone(this.originGroup),
      updatedKeywords: [],
      deletedKeywords: [],
      newKeywords: []
    }
  },
  methods: {
    getProp () {

    },
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
    updateKeywords () {},
    updateGroup () {
      // TODO 编辑单元数据校验
      // TODO 编辑单元接口请求
    }
  },
  components: {
    LandingPageComp,
    CreativeComp,
    CreativeTipComp,
    KeywordComp,
    NegativeKeywordComp,
    ContractAckComp,
    MobilePriceRatioComp
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
}
</style>
