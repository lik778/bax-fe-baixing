<template>
  <div class="create-promotion">
    <section class="promotion-target">
      <header>选择推广站点</header>

      <qiqiaoban-page-selector
        :value="promotion.landingPage"
        @change-obj="v => onLandingChange(v)"
      />
      <p class="warning" v-if="showExpireWarning">站点6个月内将过期，请选择其他站点，或<router-link :to="{name: 'seo-charge'}">购买</router-link>新官网</p>
    </section>

    <section>
      <header>选取推广关键词</header>

      <div class="info">
        <p>推广关键词要求：</p>
        <p>1、自选词仅支持检索量在300以下的关键词，请前往ci.5118.com查询关键词检索量，具体见“PC检索量”、“移动检索量”两个指标，需满足检索量总和小于300</p>
        <p>2、关键词格式：地域+行业/服务，如“上海搬家公司”，“北京家政服务公司”</p>
        <p>3、关键词字数需在 6 - 15 之间</p>
      </div>

      <div>
        <el-tag class="kw-tag" v-for="(kw, index) in promotion.keywords" :key="index"
          closable @close="() => {promotion.keywords.splice(index, 1)}"
        >{{kw.word}}</el-tag>

        <input class="keyword-input" v-model.trim="inputKeyword" @keyup.enter="onEnter" />
        <el-button size="small" @click="onEnter">确定</el-button>
      </div>

    </section>

    <section>
      <header>推广确认</header>
      <div>
        <p>首页宝推广渠道：百度</p>
        <p>推广平台：电脑端、移动端双端推广</p>
        <p>自选词单价：<span class="warning">5元/每词·每天·每平台</span></p>
      </div>

      <div>
        <p>您已选择<span class="warning">{{promotion.keywords.length}}</span>个自选词，将创建<span class="warning">{{promotion.keywords.length}}</span>个推广计划。</p>
        <p>根据您所选择的关键词个数，预扣款<span class="warning">{{promotion.keywords.length * 600}}</span>元，预计可推广<span class="warning">2个月</span>（60天），到期将自动续费，为保证您的站点持续展现，请保持首页宝排名资金充足。</p>
      </div>
      <contract-ack type="content-rule" />
      <el-button class="submit" type="primary" @click="onCreateClick">创建推广</el-button>

    </section>
  </div>
</template>

<script>
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import ContractAck from 'com/widget/contract-ack'
import {createPromotion} from 'api/seo'
import {KEYWORD_TYPE_USER} from 'constant/seo'
import dayjs from 'dayjs'

export default {
  components: {
    QiqiaobanPageSelector,
    ContractAck
  },
  data() {
    return {
      inputKeyword: '',
      promotion: {
        landingPage: '',
        keywords: []
      },
      showExpireWarning: false
    }
  },
  methods: {
    onLandingChange(v) {
      this.promotion.landingPage = 'http://' + v.domain + '.mvp.baixing.com'
      this.showExpireWarning = dayjs(v.expireAt).subtract(6, 'month').isBefore(dayjs(), 'day')
    },
    onEnter() {
      if (this.inputKeyword) {
        if (this.inputKeyword.length < 6 || this.inputKeyword.length > 15) {
          return this.$message.error('关键词字数需在 6 - 15 之间')
        }
        if (this.promotion.keywords.find(k => k.word === this.inputKeyword)) {
          return this.$message.error(`请勿重复添加关键词`)
        }
        this.promotion.keywords.push({ source: KEYWORD_TYPE_USER, word: this.inputKeyword })
        this.inputKeyword = ''
      }
    },
    onCreateClick() {
      if (!this.promotion.landingPage) {
        return this.$message.error('请选择落地页')
      }
      if (this.showExpireWarning) {
        return this.$message.error('不可选择6个月内过期的落地页')
      }
      if (!this.promotion.keywords.length) {
        return this.$message.error('请选取关键词')
      }
      this.$confirm(`您已选择关键词 【${this.promotion.keywords.map(k => k.word).join(', ')}】进行首页宝推广`, '关键词确认')
        .then(() => {
          return createPromotion(this.promotion)
        })
        .then(() => {
          this.$message.success('创建成功')
          this.$router.push({name: 'seo-promotion-list'})
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="postcss" scoped>
.create-promotion {
  color: #6a778c;
  font-size: 14px;
  border-radius: 4px;

  & > section {
    padding: 20px;
    background-color: #fff;

    & > header {
      font-weight: bold;
      margin-bottom: 20px;
    }

    & > .info {
      font-size: 13px;
    }

    & > div:not(:last-of-type) {
      margin-bottom: 20px;
    }

    & .keyword-input {
      border: 1px solid #ff6350;
      padding: 5px;
      border-radius: 4px;
      width: 200px;
    }

    & .kw-tag {
      margin-right: 5px;
    }
  }
}
.warning {
  color: #FF6350;
  margin: 0 10px;
}
.submit {
  margin-top: 20px;
}
</style>

