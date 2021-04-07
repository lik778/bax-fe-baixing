<template>
  <div class="qwt-create-group">
    <section>
      <header>推广目标设置
        <p class="target-tip">
            按点击付费，展现免费，100元一键投放百度，神马等多渠道
            <el-popover trigger="hover">
              <img src="//file.baixing.net/201809/a995bf0f1707a3e98a2c82a5dc5f8ad3.png" width="638" height="405">
              <a slot="reference" class="">查看详情</a>
            </el-popover>
          </p>
      </header>
      <div class="content">
        <landing-comp
          :value="group.name"
          @change="(val) => updateGroupData('name', val)"
        >
          <landing-page-comp
            :all-areas="allAreas"
            :landing-type="group.landingType"
            :landing-page="group.landingPage"
            :landing-page-id="group.landingPageId"
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
      <header>选取推广关键词</header>
      <div class="content">
        <keyword-comp
          :campaign-id="promotion.campaignId"
          :areas="promotion.areas"
          :sources="[promotion.source]"
          :keywords="group.keywords"
          @add-keywords="(words) => group.keywords = words.concat(group.keywords)"
          @remove-keywords="(idx) => group.keywords.splice(idx, 1)"
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
      <cpc-price-comp
        style="margin-bottom: 10px"
        :value="group.price"
        @change="(val) => updateGroupData('price', val)"
      />
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
import LandingComp from './landing-page'
import LandingPageComp from './landing-page/landing'
import CreativeComp from './creative'
import CreativeTipComp from './creative/creative-tip'
import KeywordComp from './keyword/create'
import NegativeKeywordComp from 'com/common/qwt/negative-words'
import ContractAckComp from 'com/widget/contract-ack'
import MobilePriceRatioComp from './mobile-price-ratio'
import CpcPriceComp from './cpc-price'

import { createValidator } from './validate'
import { emptyGroup } from 'constant/fengming'
import clone from 'clone'

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
        campaignId: 4012, // 计划id
        areas: []
      },
      group: clone(emptyGroup),
      isUpdating: false
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
    CpcPriceComp
  },
  mounted () {
    // TODO: 获取计划信息
  },
  methods: {
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
      if (this.isUpdating) {
        throw new Error('正在更新中, 请稍等一会儿 ~')
      }

      try {
        await createValidator.validate(this.group)
      } catch (e) {
        throw new Error(e.errors[0].message)
      }
    },
    async addGroup () {
      try {
        await this.validateGroup()
        this.isUpdating = true
        // TODO: 新建单元接口对接

        this.$router.push({ name: 'qwt-update-promotion', params: { id: this.promotion.campaignId } })
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.isUpdating = false
      }
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
      .target-tip {
        font-size: .88em;
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
  }
}
</style>
