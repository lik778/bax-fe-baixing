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
          @update-group="updateGroupData"
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
          :keywords="group.keywords"
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
          @update-promotion="updateGroupData"
        />
      </div>
    </section>
    <section>
      <div class="mobile-ratio">
        移动端出价比例
        <el-tooltip>
          <div slot="content">
            <div>移动端最高出价 = 电脑端CPC最高出价 * 移动端出价比例</div>
            <div>示例：若某关键词电脑端出价设为1.00元，移动出价比例为2，则该关键词在移动设备上的出价为2.00元</div>
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
        <el-input class="input" size="small" v-model="group.mobilePriceRatio" placeholder="默认为1" />
        <span class="tip">（请输入0.1-9.9之间的数字）</span>
      </div>
      <contract-ack-comp
        class="contract-ack"
        type="content-rule"
        ref="contract"
      />
      <el-button class="add-group-btn" type="primary">新增单元</el-button>
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

export default {
  name: 'qwt-update-group',
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      promotion: {
        source: 0
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
        mobilePriceRatio: 1
      }
    }
  },
  components: {
    LandingPageComp,
    CreativeComp,
    CreativeTipComp,
    KeywordComp,
    NegativeKeywordComp,
    ContractAckComp
  },
  methods: {
    updateGroupData (type, data) {
      if (typeof type === 'string') {
        this.group[type] = data
        return
      }
      Object.assign(this.group, type)
    },
    updateCreatives (type, idx, data) {
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
    validateGroup (type, isValid) {

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
    > .mobile-ratio {
      > .input {
        width: 240px;
        margin: 0 10px;
      }
      > .tip {
        font-size: 12px;
      }
    }
  }
}
</style>
