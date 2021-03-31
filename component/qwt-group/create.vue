<template>
  <div class="qwt-create-group">
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
      <header>选取推广关键词</header>
      <div class="content">
        <keyword-comp
          :group="group"
          :campaign-id="promotion.campaignId"
          :areas="promotion.areas"
          :sources="[promotion.source]"
          :keywords="group.keywords"
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
      <el-button class="add-group-btn" type="primary" @click="addGroup">新增单元</el-button>
    </section>
  </div>
</template>

<script>
import LandingPageComp from './landing-page'
import CreativeComp from './creative'
import CreativeTipComp from './creative/creative-tip'
import KeywordComp from './keyword/create'
import NegativeKeywordComp from 'com/common/qwt/negative-words'
import ContractAckComp from 'com/widget/contract-ack'
import MobilePriceRatioComp from './mobile-price-ratio'

export default {
  name: 'qwt-create-group',
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      promotion: {
        source: 0,
        campaignId: '', // 计划id
        areas: []
      },
      group: {
        landingType: 0,
        landingPage: '',
        landingPageId: '',
        name: '',
        status: '',
        auditStatus: 0,
        detailStatusText: '',
        creatives: [
          {
            title: '',
            content: ''
          }
        ],
        negativeWords: [],
        mobilePriceRatio: 1,
        keywords: []
      }
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
    updateKeywords ({ type, idx, data }) {
      const keywords = this.group.keywords
      switch (type) {
        case 'add':
          this.group.keywords = data.concat(keywords)
          return
        case 'remove':
          return keywords.splice(idx, 1)
      }
    },
    async addGroup () {
      // TODO: 新建单元数据校验
      // TODO: 新建单元接口对接
    }
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
  }
}
</style>
