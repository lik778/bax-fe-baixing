<template>
  <div class="cibao-page-container">
    <section>
      <header>选择推广站点</header>
      <qiqiaoban-page-selector
        :product-type="PRO_SITE_PRODUCT_TYPE"
        :value="promotion.landingPage"
        @change-obj="v => onLandingChange(v)"
      />
    </section>
    <section>
      <div class="section-inline">
        <header>选择投放时长</header>
        <el-radio-group
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
        <p>1. 请输入您主要提供服务或产品的城市及区域，地域类关键词数量建议不低于15个</p>
        <p>2. 为保证上词数量级效果，服务内容及产品关键词建议不低于5个，关键词举例：【100千瓦柴油发电机】、【公司搬迁】、【家具打包】</p>
        <p>3. 服务内容及产品关键词仅作为首页宝加速词包拓词使用，并不代表会作为推广词展示在流量平台首页</p>
        <p>4. 同一计划中的城市及服务内容产品关键词可增加，暂不支持修改、删除</p>
      </div>
      <div class="section-inline">
        <header>服务城市</header>
        <area-selector
          :visible.sync="areaSelectorVisible"
          v-model="promotion.areas"
        />
        <div class="areas">
          <tmeplate v-if="promotion.areas.length">
            <el-tag
              class="tag"
              size="small"
              :key="area.toString()"
              type="primary"
              v-for="area in promotion.areas"
            >
              {{area[area.length - 1]}}
            </el-tag>
          </tmeplate>
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
        <header>服务产品/内容</header>
        <el-input
          size="small"
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
      <div class="section-inline">
        <header>已选核心词</header>
        <p v-if="!promotion.keywords.length">暂未选取关键词</p>
        <div v-else>
          <el-tag
            closable
            :key="create"
            size="small"
            type="primary"
            class="keyword-pane-tag"
            @close="handleTagClose(item,create)"
            v-for="(item, index) in promotion.keywords"
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
          v-model="promotion.info"
          placeholder="如您对于自身服务内容及产品有额外补充内容，请填写（字数限制0～100）"
        />
      </div>
    </section>
    <section>
      <header>基础信息</header>
      <promotion-form
        ref="promotionForm"
        :value="{
          url: promotion.landingPage
        }"
      />
    </section>
    <section>
      <header class="not-required">推广确认</header>
      <div>
        <p>推广渠道：百度</p>
        <p>推广平台：电脑端、移动端双端推广</p>
        <!-- <p>预扣款：{{charge}}元（原价{{charge * 2}}元），可推广{{promotion.duration}}天，首页关键词数量{{promotion.volume}}词</p> -->
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
import promotionForm from './promotion-form'
import areaSelector from 'com/common/area-selector'
import ContractAck from 'com/widget/contract-ack'
import { PRO_SITE_PRODUCT_TYPE } from 'constant/site'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import { KEYWORD_TYPE_USER, durations, volumes, NINETY_DAYS, ONE_THROUND_KEYWORD, chargeList} from 'constant/seo'


export default {
  name: 'seo-cibao-create-page',
  data() {
    return {
      volumes,
      durations,
      PRO_SITE_PRODUCT_TYPE,

      search: '',

      areaSelectorVisible: false,

      promotion: {
        areas: [],
        info: '',
        landingPage: '',
        keywords: [],
        duration: NINETY_DAYS,
        volume: 1000
      }
    }
  },
  methods: {
    onLandingChange(v) {
      const landingPage = 'http://' + v.domain + '.mvp.baixing.com'
      this.promotion.landingPage = landingPage
      // this.showExpireWarning = dayjs(v.expireAt).subtract(3, 'month').isBefore(dayjs(), 'day')
      // this.showExistWebsite = this.existPromotionWebsite.some(o => (o.trim() === landingPage))
    },
    handleTagClose(tag, index) {
      this.promotion.keywords.splice(create, 1)
    },
    addKeyword() {
      let words = this.search.split(',')
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
    createPromotion() {
      const promotionFormInfo = typeof this.$refs.promotionForm.getValues === 'function' ? this.$refs.promotionForm.getValues() : null
      // console.log(promotionFormInfo)
    }
  },
  components: {
    ContractAck,
    areaSelector,
    promotionForm,
    QiqiaobanPageSelector
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
        width: 160px;
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

  .submit {
    margin-top: 20px;
  }

  .keyword-pane-tag {
    margin-left: 8px;
    margin-top: 5px;
  }

  .keyword-input {
    width: 400px;
    position: relative;
    margin-right: 20px;
  }
</style>
