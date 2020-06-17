<template>
  <div class="cibao-page-container">
    <section>
      <header>选择推广站点</header>
      <qiqiaoban-page-selector
        :disabled="true"
        :value="promotion.landingPage"
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
            :disabled="true"
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
          :disabled="true"
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
      <header class="not-required">推广说明</header>
      <div class="info">
        <div>说明:</div>
        <p>1.本产品通过A+B+C+D的方式完成拼词，拼词逻辑：A+C、B+C、C+D、A+B+C、A+C+D、B+C+D、A+B+C+D；</p>
        <p>如：上海（A）专业（B）空调维修（C）多少钱（D）</p>
        <p>2.A类词是”服务城市“和”自填地域词“，词数限制：A类词不低于15个；</p>
        <p>3.C类词是业务关键词，词数限制：C类词不低于10个；</p>
        <p>4.B/D类词根据您填写的C类词后台算法自动生成，暂不支持自定义。</p>
      </div>
      <div class="section-inline" v-if="promotion.areas">
        <header>服务城市</header>
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
        <header>服务产品/内容</header>
        <el-input
          size="small"
          v-model="search"
          class="keyword-input"
          @blur="keywordHint = false"
          @focus="keywordHint = true"
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
        <header class="not-required">已选业务关键词</header>
        <div>
          <template v-if="promotion.keywords && promotion.keywords.length > 0">
            <el-tag
              closable
              :key="item"
              size="mini"
              type="primary"
              class="keyword-pane-tag"
              @close="removeKeywords(item)"
              v-for="item in promotion.keywords"
            >
              {{item}}
            </el-tag>
          </template>
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
          ...promotion.baseInfo,
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
        disabled
        class="submit"
        type="primary"
        @click="updatePromotion"
      >
        更新推广
      </el-button>
    </section>
    <area-selector
      :visible.sync="areaSelectorVisible"
      v-model="promotion.areas"
    />
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import isEqual from 'lodash.isequal'
  import promotionForm from './promotion-form'
  import ContractAck from 'com/widget/contract-ack'
  import areaSelector from 'com/common/seo-area-selector'
  import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'

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
    updateCibaoPromotion,
    getCibaoPromotionByCampaignId
  } from '../../api/seo'
  import clone from 'clone'

  export default {
    name: 'seo-cibao-update-page',
    data() {
      return {
        volumes,
        durations,
        PRO_SITE_PRODUCT_TYPE,

        search: '',
        areaInput: '',
        keywordHint: false,

        areaSelectorVisible: false,
        originPromotion: null,

        promotion: {
          id: null,
          customAreas: [],
          areas: [],
          additionalInfo: '',
          landingPage: '',
          keywords: [],
          duration: NINETY_DAYS,
          volume: 1000,
          baseInfo: {}
        }
      }
    },
    methods: {
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

        const allKeywords = [].concat(this.originPromotion.keywords, this.promotion.keywords)
        const newKeywords = words.filter(word => allKeywords.every(item => item !== word))

        this.promotion.keywords = this.promotion.keywords.concat(newKeywords)
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
        if (!this.promotion.keywords.length) {
          throw this.$message.error('请选取关键词')
        }
        if (this.promotion.keywords.length < 10) {
          throw this.$message.error('计划核心关键词不能少于10个')
        }

        if (this.promotion.areas.length + this.promotion.customAreas.length < 15) {
          throw this.$message.error('服务城市不能少于15个')
        }

        try {
          const {
            url,
            ...baseInfo
          } = await this.$refs.promotionForm.getValues()
          return {
            ...this.promotion,
            baseInfo
          }
        } catch(err) {
          const errorField = Object.values(err)[0] && Object.values(err)[0][0]
          this.$message.error(errorField ? errorField.message : '基础信息出现错误')
        }
      },
      async updatePromotion() {
        return void 0
        let data = await this.validateAndReturnPromotionData()
        const originalData = this.originPromotion

        // 一个key变化就全量字段更新
        const isPromotionChanged = Object.keys(data)
          .some(key => !isEqual(data[key], originalData[key]))

        if (isPromotionChanged) {
          data = {
            ...originalData,
            ...data,
            areas: data.areas.map(area => area.join('-'))
          }
          await updateCibaoPromotion(data)
        }
        this.$message.success('更新成功')
        this.$router.push({name: 'seo-promotion-list'})

      },
      async getPromotionDataById(id) {
        const data = await getCibaoPromotionByCampaignId(id)
        // 兼容下一期加速词包计划数据
        if (!data.areas) {
          data.areas = []
          data.baseInfo = {}
        }

        data.areas = data.areas.map(area => area.split('-'))
        this.originPromotion = pick(data, ...Object.keys(this.promotion))
        this.originPromotion.areas = this.originPromotion.areas || []
        this.originPromotion.customAreas = this.originPromotion.customAreas || []

        this.promotion = clone(this.originPromotion)
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
      this.promotion.id = this.$route.params.id
      await this.getPromotionDataById(this.$route.params.id)
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
