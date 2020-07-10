<template>
  <div class="cibao-page-container">
    <section>
      <header>套餐选择</header>
      <div class="section-inline">
        <div class="header">投放时长</div>
        <el-radio-group
          @change="handleDurationChange"
          size="medium"
          v-model="promotion.duration"
        >
          <el-radio-button
            v-for="item in durations"
            :label="item"
            :key="item"
          >
            {{item}}天
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="section-inline">
        <div class="header">首页关键词数量</div>
        <el-radio-group
          size="medium"
          v-model="promotion.volume"
        >
          <el-radio-button
            v-for="item in volumes"
            :label="item"
            :key="item"
          >
            {{item}}词
          </el-radio-button>
        </el-radio-group>
      </div>
    </section>
    <section>
      <header>推广官网</header>
      <qiqiaoban-page-selector
        :value="promotion.landingPage"
        :display-landing-page="true"
        @change-obj="v => onLandingChange(v)"
      />
      <p class="warning" v-if="showExpireWarning">
        站点{{promotion.duration}}天内将过期，
        请选择其他站点，或<router-link :to="{name: 'seo-charge'}">购买</router-link>新官网
      </p>
      <p class="warning" v-if="showExistWebsite">该站点已创建首页宝加速词包计划，请更换</p>
    </section>
    <section>
      <header>关键词录入</header>
      <div class="info">
        <div>说明：
            点击<i class="el-icon-circle-plus-outline"></i>可以添加对应词语，
            点击<i class="el-icon-edit"></i>可以编辑词语，
            点击<i class="el-icon-delete"></i>可以删除词语
        </div>
        <div class="mt-16">次数限制
          <p>A/C类词数限制不低于15词</p>
          <p>B/D类词数限制不低于10词</p>
        </div>
      </div>
      <select-keywords ref="selectKeywords" />
      <div class="mt-16 size-13">
        <div>组合逻辑：A+C、B+C、C+D、A+B+C、A+C+D、B+C+D、A+B+C+D；</div>
        <div>如：上海（A）专业的（B）空调维修（C）多少钱（D）</div>
      </div>
    </section>
    <section>
      <header>搜索展示</header>
      <div class="info">
        <p>1. 图片主要用于前端展示，请选择与实际业务相关的图片上传；</p>
        <p>2. 避免推广下线，请勿上传违规图片及带有水印图片</p>
        <p>3. 图片大小，小于1M, 格式：jpg, jpeg</p>
        <p>4. 图片不多于{{SEARCH_IMAGES_MAX}}张</p>
      </div>
      <search-img-view @file="handleSearchFileChange" />
    </section>
    <section>
      <header>补充信息</header>
      <promotion-form
        ref="promotionForm"
        :value="{
          ...baseInfo,
          url: promotion.landingPage
        }"
      />
    </section>
    <section>
      <header class="not-required">产品说明</header>
      <div>
        <p>推广渠道：百度</p>
        <p>推广平台：电脑端、移动端双端推广</p>
        <p>预扣款：{{charge}}元，可推广{{promotion.duration}}天，首页关键词数量{{promotion.volume}}词</p>
      </div>
      <contract-ack type="content-rule" ref="contract" />
      <el-button
        class="submit"
        type="primary"
        @click="createPromotion"
      >
        创建推广
      </el-button>
    </section>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import promotionForm from './promotion-form'
import ContractAck from 'com/widget/contract-ack'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import SearchImgView from './search-img-view'
import SelectKeywords from './select-keywords'
import { f2y } from 'util/kit'
import { PRO_SITE_PRODUCT_TYPE } from 'constant/site'
import {
  volumes,
  durations,
  chargeList,
  NINETY_DAYS,
  SEARCH_IMAGES_MIN,
  SEARCH_IMAGES_MAX
} from 'constant/seo'
import {
  getPromotedWebsite,
  createCibaoPromotion,
  getCibaoPromotionBaseInfo
} from '../../api/seo'

export default {
  name: 'seo-cibao-create-page',
  data() {
    return {
      volumes,
      durations,
      PRO_SITE_PRODUCT_TYPE,
      SEARCH_IMAGES_MAX,
      canConfirmOpen: true,
      
      landingInfo: null,
      showExistWebsite: false,
      showExpireWarning: false,

      baseInfo: {},
      existPromotionWebsite: [],

      promotion: {
        duration: NINETY_DAYS,
        volume: 1000,
        landingPage: '',
        keywords: [],         // C类
        customAreas: [],      // A类
        prefixWordList: [],   // B类
        suffixWordList: [],   // D类

        images: []            // 搜索通图片列表
      }
    }
  },
  methods: {
    onLandingChange(v) {
      this.landingInfo = v
      const landingPage = 'http://' + v.domain + '.mvp.baixing.com'
      this.promotion.landingPage = landingPage
      this.showExpireWarning = dayjs(v.expireAt).subtract(this.promotion.duration, 'day').isBefore(dayjs(), 'day')
      this.showExistWebsite = this.existPromotionWebsite.some(o => (o.trim() === landingPage))
    },
    handleDurationChange(duration) {
      if (!this.landingInfo) return
      this.showExpireWarning = dayjs(this.landingInfo.expireAt).subtract(duration, 'day').isBefore(dayjs(), 'day')
    },
    handleSearchFileChange(fileList) {
      this.promotion.images = fileList
    },
    async validateAndReturnPromotionData() {
      if (!this.$refs.contract.$data.isAgreement) {
        throw this.$message.error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (!this.promotion.landingPage) {
        throw this.$message.error('请选择落地页')
      }
      if (this.showExpireWarning) {
        throw this.$message.error('不可选择3个月内过期的落地页')
      }
      if (this.showExistWebsite) {
        throw this.$message.error('不可选择已创建首页宝加速词包计划的官网')
      }

      let baseInfo = {}
      try {
        baseInfo = await this.$refs.promotionForm.getValues()
      } catch(err) {
        const errorField = Object.values(err)[0] && Object.values(err)[0][0]
        throw this.$message.error(errorField ? errorField.message : '基础信息出现错误')
      }

      try {
        const selectKeywords = await this.$refs.selectKeywords.getValues()
        Object.assign(this.promotion, selectKeywords)
      } catch(err) {
        throw this.$message.error(err.message)
      }
    

      if (f2y(this.balance) < this.charge) {
        throw this.$confirm('余额不足，请前往充值', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false
        }).then(res => {
          this.$router.push({ name: 'seo-charge'})
        }).catch(()=>{})
      }
      return {
        ...this.promotion,
        baseInfo
      }
    },
    async createPromotion() {
      this.canConfirmOpen && await this.$confirm(`
        <div>
          <p>1.本产品属于SEO广告展示类产品，不支持指定词在百度首页获得展示；</p>
          <p>2.请确保服务城市及业务关键词与实际相符；</p>
          <p>3.资料提交后需要7~30天优化期，上词效果请耐心等待。</p>
        </div>
      `, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确认提交',
        cancelButtonText: '我再想想'
      })
      this.canConfirmOpen = false
      const data = await this.validateAndReturnPromotionData()
      createCibaoPromotion(data).then(res => {
        this.$message.success('创建成功')
        this.$router.push({name: 'seo-promotion-list'})
      })
    }
  },
  computed: {
    charge() {
      const { duration, volume } = this.promotion
      const chargeObj = chargeList.find(o => o.volume === volume && o.duration === duration)
      return chargeObj ? chargeObj.charge : chargeList[0].charge
    }
  },
  components: {
    ContractAck,
    promotionForm,
    QiqiaobanPageSelector,
    SearchImgView,
    SelectKeywords
  },
  async created() {
    [this.baseInfo, this.existPromotionWebsite] = await Promise.all([getCibaoPromotionBaseInfo(), getPromotedWebsite()])
  }
}
</script>

<style lang="postcss" scoped>
  .cibao-page-container {
    color: #6a778c;
    font-size: 14px;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    & > section {
      max-width: 1100px;
      padding: 20px;
    }
    & .section-inline {
      display: flex;
      align-items: center;
      & + .section-inline {
        padding-top: 20px;
      }
      & > .header {
        margin: 0;
        min-width: 120px;
      }
    }
    & header {
      position: relative;
      margin-bottom: 20px;
      font-weight: 700;
      &.not-required:after {
        display: none;
      }
      &:after {
        content: '*';
        position: absolute;
        color: red;
        font-size: 12px;
        top: -2px;
        margin-left: 4px;
      }
    }
    & .info {
      font-size: 13px;
      padding-bottom: 25px;
      & > p {
        text-indent: 1em;
      }
      & i {
        font-size: 16px;
        margin: 0 3px;
      }
    }
    & /deep/ .el-input__count {
      position: absolute;
      bottom: 3px;
      right: 12px;
    }
  }

  .warning {
    color: #ff6350;
    font-size: 14px;
    margin-top: 6px;
  }

  .submit {
    margin-top: 20px;
  }

  .keyword-pane-tag {
    margin-right: 8px;
    margin-top: 5px;
  }

  .keyword-input {
    width: 400px;
    position: relative;
    margin-right: 20px;
  }
  .mt-16 {
    margin-top: 16px;
  }
  .size-13 {
    font-size: 13px;
  }
</style>
