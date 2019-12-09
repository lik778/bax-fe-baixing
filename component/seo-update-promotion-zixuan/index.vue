<template>
  <div class="create-promotion">

    <section class="promotion-target">
      <header class="page-header">更新首页宝推广计划：# {{$route.params.id}}</header>
      <header>选择推广站点</header>

      <qiqiaoban-page-selector :product-type="PRO_SITE_PRODUCT_TYPE"
                               :value="promotion.landingPage"
                               @change="v => promotion.landingPage = v"
                               :disabled="true" />
    </section>

    <section>
      <header>选取推广关键词</header>

      <div class="info">
        <p>推广关键词要求：</p>
        <p>1、自选词仅支持检索量在300以下的关键词，请前往ci.5118.com查询关键词检索量，具体见“PC检索量”、“移动检索量”两个指标，需满足检索量总和小于300</p>
        <p>2、关键词格式：地域+行业/服务，如“厦门纱窗安装公司”，“武汉老酒回收”，“重庆哪里有典当行”</p>
        <p>3、关键词字数需≥6</p>
      </div>

      <div>
        <input class="keyword-input"
               v-model.trim="inputKeyword"
               @keyup.enter="onEnter" />
      </div>

    </section>

    <section>
      <header>推广确认</header>
      <div>
        <p>首页宝推广渠道：百度</p>
        <p>推广平台：电脑端、移动端双端推广</p>
        <p>自选词单价：5元/每词·每天·每平台</p>
      </div>

      <div>
        <p>您已选择1个自选词，将创建1个推广计划。</p>
      </div>
      <contract-ack type="content-rule" />
      <el-button class="submit"
                 type="primary"
                 @click="onUpdateClick">更新推广</el-button>

    </section>
  </div>
</template>

<script>
import ContractAck from 'com/widget/contract-ack'
import {PRO_SITE_PRODUCT_TYPE} from 'constant/site'
import {updatePromotion, queryPromotionByIds} from 'api/seo'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'

export default {
  components: {
    QiqiaobanPageSelector,
    ContractAck
  },
  data() {
    return {
      PRO_SITE_PRODUCT_TYPE,
      inputKeyword: '',
      promotion: {}
    }
  },
  methods: {
    onEnter() {
      if (this.inputKeyword) {
        if (this.inputKeyword.length < 6) {
          return this.$message.error('关键词字数需大于等于6')
        }
      }
    },
    onUpdateClick() {
      if (!this.inputKeyword) {
        return this.$message.error('请选取关键词')
      }
      this.$confirm(`您已选择关键词【 ${this.inputKeyword}】 进行首页宝推广`, '确认更新计划')
        .then(() => {
          return updatePromotion(this.promotion.id, {newWord: this.inputKeyword})
        })
        .then(() => {
          this.$message.success('更新成功')
          this.$router.push({name: 'seo-promotion-list'})
        })
        .catch(() => {})
    }
  },
  async mounted() {
    console.log(this.$route.params.id)
    this.promotion = (await queryPromotionByIds(this.$route.params.id))[0]
    this.inputKeyword = this.promotion.words[0].word
    console.log(this.promotion)
  }
}
</script>

<style lang="postcss" scoped>
.create-promotion {
  color: #6a778c;
  font-size: 14px;

  & > section {
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);

    & > .page-header {
      font-size: 1.5em;
    }

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
.submit {
  margin-top: 20px;
}
</style>

