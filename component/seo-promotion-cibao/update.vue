<template>
  <div class="cibao-page-container">
    <section>
      <header>套餐选择</header>
      <div class="section-inline">
        <div class="header">投放时长</div>
        <el-radio-group size="medium"
                        v-model="promotion.duration">
          <el-radio-button :disabled="true"
                           v-for="item in durations"
                           :label="item"
                           :key="item">
            {{item}}天
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="section-inline">
        <div class="header">首页关键词数量</div>
        <el-radio-group size="medium"
                        :disabled="true"
                        v-model="promotion.volume">
          <el-radio-button v-for="item in volumes"
                           :label="item"
                           :key="item">
            {{item}}词
          </el-radio-button>
        </el-radio-group>
      </div>
    </section>
    <section>
      <header>推广官网</header>
      <qiqiaoban-page-selector :disabled="true"
                               :value="promotion.landingPage" />
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
      <select-keywords ref="selectKeywords"
                       :originKeywords="originKeywords" />
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
      <search-img-view @file="handleSearchFileChange"
                       :original-file-list="originalFileList" />
    </section>
    <section>
      <header>补充信息</header>
      <promotion-form ref="promotionForm"
                      :value="{
          ...promotion.baseInfo,
          url: promotion.landingPage
        }" />
    </section>
    <section>
      <header class="not-required">产品说明</header>
      <div>
        <p>推广渠道：百度</p>
        <p>推广平台：电脑端、移动端双端推广</p>
        <p>预扣款：{{charge}}元，可推广{{promotion.duration}}天，首页关键词数量{{promotion.volume}}词</p>
      </div>
      <contract-ack type="content-rule"
                    ref="contract" />
      <el-button class="submit"
                 type="primary"
                 @click="updatePromotion">
        更新推广
      </el-button>
    </section>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import promotionForm from './promotion-form'
import ContractAck from 'com/widget/contract-ack'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import SearchImgView from './search-img-view'
import SelectKeywords from './select-keywords'

import { PRO_SITE_PRODUCT_TYPE } from 'constant/site'
import {
  volumes,
  durations,
  chargeList,
  NINETY_DAYS,
  SEARCH_IMAGES_MAX
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
      SEARCH_IMAGES_MAX,

      originPromotion: null,
      canConfirmOpen: true,

      promotion: {
        id: null,
        landingPage: '',
        duration: NINETY_DAYS,
        volume: 1000,
        baseInfo: {},
        customAreas: [], // A类
        prefixWordList: [], // B类
        keywords: [], // C类
        suffixWordList: [], // D类
        images: [] // 搜索通图片列表
      }
    }
  },
  methods: {
    handleSearchFileChange(fileList) {
      this.promotion.images = fileList
    },
    async validateAndReturnPromotionData() {
      if (!this.$refs.contract.$data.isAgreement) {
        throw this.$message.error('请阅读并勾选同意服务协议，再进行下一步操作')
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
      } catch (err) {
        throw this.$message.error(err.message)
      }

      return {
        ...this.promotion,
        baseInfo
      }
    },
    async updatePromotion() {
      this.canConfirmOpen && await this.$confirm(`
        <div>
          <p>1.本次提交会更新上次提交的关键词，最新上词以提交版本为准；</p>
          <p>2.提交之后将重新进入上词优化期，预计7~30天；</p>
          <p>3.每个计划在投放期内仅有一次编辑权限，本次修改后将不能再编辑。</p>
        </div>
      `, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确认提交',
        cancelButtonText: '我再想想'
      })
      this.canConfirmOpen = false
      let data = await this.validateAndReturnPromotionData()
      
      console.log(data)

      updateCibaoPromotion(data).then(res => {
        this.$message.success('更新成功')
        this.$router.push({name: 'seo-promotion-list'})
      })
    },
    async getPromotionDataById(id) {
      const data = await getCibaoPromotionByCampaignId(id)
      this.originPromotion = pick(data, ...Object.keys(this.promotion))
      this.promotion = clone(this.originPromotion)
    }
  },
  computed: {
    charge() {
      const { duration, volume } = this.promotion
      const chargeObj = chargeList.find(
        (o) => o.volume === volume && o.duration === duration
      )
      return chargeObj ? chargeObj.charge : chargeList[0].charge
    },
    originKeywords() {
      const keys = [
        'customAreas',
        'prefixWordList',
        'keywords',
        'suffixWordList'
      ]
      return pick(this.originPromotion, keys)
    },
    originalFileList() {
      return (this.originPromotion && this.originPromotion.images) || []
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
    max-width: 1280px;
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
.mt-16 {
  margin-top: 16px;
}
.size-13 {
  font-size: 13px;
}
</style>
