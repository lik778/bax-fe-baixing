<template>
  <div class="cibao-page-container">
    <section>
      <header>选择推广站点</header>
      <qiqiaoban-page-selector
        :value="promotion.landingPage"
        @change-obj="v => onLandingChange(v)"
        :product-type="PRO_SITE_PRODUCT_TYPE"
      />
      <p class="warning" v-if="showExpireWarning">
        站点{{promotion.duration}}天内将过期，
        请选择其他站点，或<router-link :to="{name: 'seo-charge'}">购买</router-link>新官网
      </p>
      <p class="warning" v-if="showExistWebsite">该站点已创建首页宝加速词包计划，请更换</p>
    </section>
    <section>
      <div class="section-inline">
        <header>选择投放时长</header>
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
        <header>选择首页关键词数量</header>
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
      <header class="not-required">输入服务内容/产品关键词</header>
      <div class="info">
        <div>说明:</div>
        <p>1. 请输入您主要提供服务或产品的城市及自填区域，地域类关键词数量不低于15个</p>
        <p>2. 为保证上词数量级效果，服务内容及产品关键词建议不低于10个，关键词举例：100千瓦柴油发电机，公司搬迁，家具打包等</p>
        <p>3. 服务内容及产品关键词仅作为首页宝加速词包拓词使用，并不代表会作为推广词展示在流量平台首页</p>
        <p>4. 同一计划中的城市及服务内容产品关键词可增加，修改</p>
      </div>
      <div class="section-inline">
        <header>服务城市</header>
        <area-selector
          :visible.sync="areaSelectorVisible"
          v-model="promotion.areas"
        />
        <div class="areas">
          <template v-if="promotion.areas.length">
            <el-tag
              class="tag"
              size="small"
              :key="area.toString()"
              type="primary"
              v-for="area in promotion.areas"
            >
              {{area[area.length - 1]}}
            </el-tag>
          </template>
          <span v-else>暂未选取服务城市</span>
          <el-button
            size="mini"
            type="primary"
            @click="areaSelectorVisible = true"
          >
            {{promotion.areas.length ? '更新' : '新增'}}
          </el-button>
        </div>
      </div>
      <div class="section-inline">
        <header>自填地域词</header>
        <template v-if="promotion.customAreas.length">
          <el-tag
            closable
            class="tag"
            size="small"
            :key="area.toString()"
            type="primary"
            @close="removeCustomArea(area)"
            v-for="area in promotion.customAreas"
          >
            {{area}}
          </el-tag>
        </template>
        <span v-else>暂未填写地域词</span>
      </div>
      <div class="section-inline">
        <header class="not-required">自填地域</header>
        <el-input
          size="small"
          v-model="areaInput"
          class="keyword-input"
          placeholder="请输入自填地域（单个地域词不超过8字）"
        />
        <el-button
          size="small"
          type="primary"
          @click="addCustomAreas"
        >
          批量添加
        </el-button>
      </div>

      <div class="section-inline">
        <header class="not-required">增加业务关键词</header>
        <el-input
          size="small"
          @focus="keywordHint = true"
          @blur="keywordHint = false"
          v-model="search"
          class="keyword-input"
          placeholder="请输入服务内容或产品关键词"
        />
        <el-button
          size="small"
          type="primary"
          @click="addKeyword"
        >
          批量添加
        </el-button>
      </div>
      <div class="info" v-if="keywordHint">
        <div>提示：</div>
        <p>1. 它是您提供的所有服务，或者所有产品（包括产品型号）；</p>
        <p>2. 业务关键词不包含地域、价格、联系方式等；</p>
        <p>3. 多个关键词可用中英文逗号隔开；</p>
        <p>4. 如：空调维修行业可添加：空调维修，空调移机，中央空调清洗，中央空调安装等；</p>
      </div>
      <div class="section-inline">
        <header>已选业务关键词</header>
        <p v-if="!promotion.keywords.length">暂未选取关键词</p>
        <div v-else>
          <el-tag
            closable
            :key="item"
            size="small"
            type="primary"
            class="keyword-pane-tag"
            @close="removeKeywords(item)"
            v-for="item in promotion.keywords"
          >
            {{item}}
          </el-tag>
        </div>
      </div>
      <div class="section-inline">
        <header class="not-required">补充信息</header>
        <el-input
          :rows="3"
          maxlength="100"
          type="textarea"
          show-word-limit
          class="keyword-input"
          v-model="promotion.additionalInfo"
          placeholder="如您对于自身服务内容及产品有额外补充内容，请填写（字数限制0～100）"
        />
      </div>
    </section>
    <section>
      <header>基础信息</header>
      <promotion-form
        ref="promotionForm"
        :value="{
          ...baseInfo,
          url: promotion.landingPage
        }"
      />
    </section>
    <section>
      <header class="not-required">推广确认</header>
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
import areaSelector from 'com/common/seo-area-selector'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import {
  f2y
} from 'util/kit'

import {
  PRO_SITE_PRODUCT_TYPE
} from 'constant/site'

import {
  volumes,
  durations,
  chargeList,
  NINETY_DAYS
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
      keywordHint: false,

      landingInfo: null,
      showExistWebsite: false,
      showExpireWarning: false,

      search: '',
      areaInput: '',

      areaSelectorVisible: false,

      baseInfo: {},
      existPromotionWebsite: [],

      promotion: {
        areas: [],
        customAreas: [],
        additionalInfo: '',
        landingPage: '',
        keywords: [],
        duration: NINETY_DAYS,
        volume: 1000
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
    removeCustomArea(tag) {
      this.promotion.customAreas = this.promotion.customAreas.filter(item => tag !== item)
    },
    removeKeywords(tag) {
      this.promotion.keywords = this.promotion.keywords.filter(item => tag !== item)
    },
    addKeyword() {
      if (!this.search) return false
      let words = this.search.split(/[，,]/)
      const rawWordLen = words.length

      words = words
        .map(word => word.trim())
        .filter(word => word && (word.length >= 2 || word.length <= 99))

      if (words.length !== rawWordLen) {
        this.$message.error('已过滤字数不满足2-99个的关键词')
      }
      if (words.length > 1000) {
        this.$message.error('每次最多支持上传1000个关键词')
        words = words.slice(0, 1001)
      }

      this.promotion.keywords = Array.from(new Set(this.promotion.keywords.concat(words)))
      this.search = ''
    },
    addCustomAreas() {
      if (!this.areaInput) return false
      let areas = this.areaInput.split(/[，,]/)
      const rawWordLen = areas.length

      areas = areas
        .map(area => area.trim())
        .filter(area => area && (area.length >= 2 || area.length <= 8))
      

      if (areas.length !== rawWordLen) {
        this.$message.error('已过滤字数不满足2-99个的关键词')
      }
      this.promotion.customAreas = [...new Set(this.promotion.customAreas.concat(areas))]
      this.areaInput = ''
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
      if (!this.promotion.keywords.length) {
        throw this.$message.error('请选取关键词')
      }
      if (this.promotion.keywords.length < 10) {
        throw this.$message.error('计划核心关键词不能少于10个')
      }

      if (this.promotion.areas.length + this.promotion.customAreas.length < 15) {
        throw this.$message.error('服务城市不能少于15个')
      }

      let baseInfo = {}
      try {
        baseInfo = await this.$refs.promotionForm.getValues()
      } catch(err) {
        const errorField = Object.values(err)[0] && Object.values(err)[0][0]
        this.$message.error(errorField ? errorField.message : '基础信息出现错误')
        return
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
        baseInfo,
        areas: this.promotion.areas.map(area => area.join('-'))
      }
    },
    async createPromotion() {
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
    areaSelector,
    promotionForm,
    QiqiaobanPageSelector
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
      max-width: 1000px;
      padding: 20px;
    }
    & .section-inline {
      display: flex;
      align-items: center;
      & + .section-inline {
        padding-top: 20px;
      }
      & > header {
        margin: 0;
        min-width: 160px;
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
</style>
