<template>
  <div class="qwt-create-group">
    <section>
      <header>推广目标设置
        <p class="target-tip">
          按点击付费，展现免费，100元一键投放百度，神马等多渠道
          <el-popover trigger="hover">
            <img src="//file.baixing.net/201809/a995bf0f1707a3e98a2c82a5dc5f8ad3.png"
                 width="638"
                 height="405">
            <a slot="reference"
               class="">查看详情</a>
          </el-popover>
        </p>
      </header>
      <div class="content">
        <landing-comp :value="group.name"
                      @change="(val) => updateGroupData('name', val)">
          <landing-page-comp :all-areas="allAreas"
                             :landing-type="group.landingType"
                             :landing-page="group.landingPage"
                             :landing-page-id="group.landingPageId"
                             @change-landing="(args) => updateGroupData(args)" />
        </landing-comp>
      </div>
    </section>

    <section>
      <header>推广物料设置
        <creative-tip-comp />
      </header>
      <div class="content">
        <creative-comp :source="promotion.source"
                       :creatives="group.creatives"
                       @add-creatives="() => group.creatives.push({ title: '', content: '' })"
                       @remove-creatives="(idx) => group.creatives.splice(idx, 1)"
                       @update-creatives="(idx, newData) => group.creatives.splice(idx, 1, newData)" />
      </div>
    </section>

    <section v-if="enableMaterialPictures">
      <header>创意配图
        <el-tooltip
          v-if="isCurPromotionOrGroupPaused"
          placement="top"
          content="当前计划已下线。重启计划后，创意配图会一并生效">
            <i class="el-icon-question"></i>
        </el-tooltip>
      </header>
      <div class="content">
        <material-pictures-comp
          v-model="materialPictures"
          :initValue="materialPicturesInits"
        />
        <el-button
          v-if="isMaterialChanged"
          class="update-material-button"
          type="primary"
          size="small"
          :loading="loading.materialPictures"
          @click="_updateMaterialPictures"
        >更新创意配图</el-button>
      </div>
    </section>

    <section>
      <header>选取推广关键词（当前计划还可添加<strong>{{keywordRemainCount}}</strong>个关键词）</header>
      <div class="content">
        <keyword-comp :campaign-id="promotion.id"
                      :areas="promotion.areas"
                      :sources="[promotion.source]"
                      :origin-keywords="group.keywords"
                      :all-words="group.keywords.concat(group.negativeWords)"
                      @track="(action, opts) => handleTrack(action, opts)"
                      @add-keywords="(words) => group.keywords = words.concat(group.keywords)"
                      @remove-keywords="(idx) => group.keywords.splice(idx, 1)" />
      </div>
    </section>

    <section>
      <header>设置否定关键词
        <el-tooltip content="请注意，否词和关键词不能重复"
                    placement="top">
          <i class="el-icon-question" />
        </el-tooltip>
      </header>
      <div class="content">
        <p class="tip"
           style="margin-bottom: 20px">
          当网民的搜索词与精确否定关键词完全一致时，您的推广结果将不会展现。 否词个数不得超过 <strong>{{ NEGATIVE_KEYWORDS_MAX }}</strong>个,
          当前否定关键词数量: <strong>{{ group.negativeWords.length }}</strong>个
        </p>
        <negative-keyword-comp :negative-words="group.negativeWords"
                               :show-tip="false"
                               @track="(action, opts) => handleTrack(action, opts)"
                               :all-words="group.negativeWords.concat(group.keywords)"
                               @add-negative-words="(words) => group.negativeWords = words.concat(group.negativeWords)"
                               @remove-negative-words="(idx) => group.negativeWords.splice(idx, 1)" />
      </div>
    </section>
    <section>
      <cpc-price-comp style="margin-bottom: 10px"
                      :value="group.price"
                      @change="(val) => updateGroupData('price', val)" />
      <mobile-price-ratio-comp :value="group.mobilePriceRatio"
                               @change="(val) => updateGroupData('mobilePriceRatio', val)" />
      <contract-ack-comp class="contract-ack"
                         type="content-rule"
                         ref="contract" />
      <el-button class="add-group-btn"
                 type="primary"
                 @click="addGroup">新增单元</el-button>
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
import MaterialPicturesComp from 'com/common/material-pictures-dialog'

import { createValidator } from './validate'
import {
  createGroup,
  getCampaignInfo,
  getCampaignKeywordsCount,
  getGroupDetailByGroupId,
  getKeywordsByGroupId,
  getMaterialPictures,
  updateMaterialPictures
} from 'api/fengming'
import {
  emptyGroup,
  NEGATIVE_KEYWORDS_MAX,
  KEYWORDS_MAX,
  // SEM_PLATFORM_BAIDU,
  MATERIAL_PIC_STATUS
} from 'constant/fengming'
import clone from 'clone'
import pick from 'lodash.pick'
import track from 'util/track'
import { toFloat, isArrHasSameValue } from 'util'
import uuid from 'uuid/v4'

const emptyPromotion = {
  id: 0,
  source: 0,
  areas: []
}

export default {
  name: 'qwt-create-group',
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      NEGATIVE_KEYWORDS_MAX,
      promotion: emptyPromotion,
      group: clone(emptyGroup),
      actionTrackId: uuid(),
      campaignKeywordLen: 0,
      loading: {
        updateGroup: false,
        materialPictures: false
      },
      materialPictures: {},
      materialPicturesInits: {},
      materialPicturesInitsRaw: null,
      isMaterialChanged: false,
      isMaterialChangeLock: false
    }
  },
  computed: {
    isCurPromotionOrGroupPaused () {
      // return this.promotion.pause === 1 || this.group.pause === 1
      return true
    },
    enableMaterialPictures () {
      // return this.promotion.source === SEM_PLATFORM_BAIDU
      return true
    },
    keywordRemainCount () {
      const newLen = this.group.keywords.length
      return KEYWORDS_MAX - (this.campaignKeywordLen + newLen)
    },
    campaignId () {
      return this.promotion.id || this.$route.query.campaignId
    }
  },
  watch: {
    // 记录创意配图内容是否修改
    materialPictures (n) {
      if (!this.isMaterialChangeLock) {
        const hasChange = (a, b) => {
          return !isArrHasSameValue(a, b, (x, y) => {
            /* eslint-disable */
            return x.url === y.url &&
              x.id == y.id &&
              x.desc == y.desc
            /* eslint-enable */
          })
        }
        const { pc, wap } = n._raw || {}
        const { pc: pcRaw, wap: wapRaw } = this.materialPicturesInitsRaw

        const isChanged = hasChange(pcRaw, pc) || hasChange(wapRaw, wap)
        this.isMaterialChanged = isChanged
      }
    }
  },
  async mounted () {
    this.handleTrack('enter-page: create-group')

    // TODO 复制过来的创意配图怎么处理？
    // 复制进入
    const cloneId = this.$route.query.cloneId
    if (cloneId) {
      await this.cloneGroupById(cloneId)
    } else {
      const promotion = await getCampaignInfo(this.campaignId)
      this.promotion = pick(promotion, ['id', 'source', 'areas'])
    }
    this.campaignKeywordLen = await getCampaignKeywordsCount(this.campaignId)

    if (this.enableMaterialPictures) {
      this.initMaterialPictures()
    }
  },
  methods: {
    async cloneGroupById (groupId) {
      const originGroup = await getGroupDetailByGroupId(groupId)
      const originKeywords = await getKeywordsByGroupId(groupId)
      this.promotion = this.group.campaign

      const price = this.recommendKwPrice()

      const keywords = originKeywords.map(o => ({ ...o, price }))
      this.group = {
        ...originGroup,
        price,
        keywords
      }
    },
    async initMaterialPictures (inits) {
      this.isMaterialChanged = false
      this.isMaterialChangeLock = true
      this.materialPicturesInits = inits || (await getMaterialPictures({
        campaignId: this.id
      })).data

      // eslint-disable-next-line camelcase
      const { image_type, pc = [], wap = [] } = this.materialPicturesInits
      this.materialPicturesInitsRaw = {
        image_type,
        pc: [...pc],
        wap: [...wap]
      }
      this.$nextTick(() => {
        this.isMaterialChangeLock = false
      })
    },
    recommendKwPrice () {
      const keywords = this.promotion.keywords
      // 复制推荐词价格取平均值
      if (this.$route.query.cloneId) {
        const sum = keywords.reduce((total, kw) => total + kw.price, 0)
        return Math.min(Math.max(200, toFloat(sum / keywords.length)), 99900)
      }
      const max = Math.max.apply(null, keywords.map(kw => kw.price))
      return Math.min(Math.max(200, toFloat(max, 0)), 99900)
    },
    handleTrack (action, opts = {}) {
      const { actionTrackId, userInfo } = this
      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: action,
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        campaignId: this.promotion.id,
        actionTrackId,
        ...opts
      })
    },
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
      if (this.loading.updateGroup) {
        throw new Error('正在更新中, 请稍等一会儿 ~')
      }

      try {
        await createValidator.validate(this.group, { first: true })
      } catch (e) {
        throw new Error(e.errors[0].message)
      }
    },
    validMaterialPictures () {
      if (!this.materialPictures.isValid) {
        throw new Error('请按要求上传创意配图')
      } else {
        const isValidPC = this.materialPictures.isValidPC
        const isValidWAP = this.materialPictures.isValidWAP
        const isSaveBoth = isValidPC && isValidWAP

        if (!isSaveBoth) {
          const { pc = [], wap = [] } = this.materialPictures._raw
          const hasPCContents = pc.length
          const hasWAPContents = wap.length

          if (isValidPC && hasWAPContents) {
            throw new Error('手机端图片审核失败或数量不满足系统要求，请检查后重新提交')
          }
          if (isValidWAP && hasPCContents) {
            throw new Error('电脑端图片审核失败或数量不满足系统要求，请检查后重新提交')
          }
        }
      }
    },
    async _updateMaterialPictures () {
      this.validMaterialPictures()

      const res = await updateMaterialPictures({
        group_id: this.group.id,
        image_type: this.materialPictures.type,
        delete_images: []
          .concat(this.materialPictures.del.wap)
          .concat(this.materialPictures.del.pc),
        new_images: this.materialPictures.add
      })
      const errors = res?.data || []

      if (errors.length) {
        const { pc = [], wap = [] } = this.materialPictures._raw
        let lastErrorReason = null
        ;[...pc, ...wap].forEach(img => {
          const findFirstError = errors.find(x => x.url === img.url)
          if (findFirstError) {
            this.$set(img, 'status', MATERIAL_PIC_STATUS.STATUS_CHIBI_REJECT)
            lastErrorReason = findFirstError.reject_message
          }
        })
        throw new Error(lastErrorReason || '部分图片审核失败，请检查并重新上传')
      } else {
        await this.initMaterialPictures()
        this.$message.success('更新创意配图成功')
      }
      this.isMaterialChanged = false
    },
    async addGroup () {
      try {
        await this.validateGroup()
        this.loading.updateGroup = true

        if (this.enableMaterialPictures) {
          this.loading.materialPictures = true
          await this._updateMaterialPictures()
        }

        await createGroup({
          ...this.group,
          campaignId: this.promotion.id
        })

        this.handleTrack('leave-page: create-group')

        this.$router.push({
          name: 'qwt-update-promotion',
          params: { id: this.promotion.id }
        })
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.loading.updateGroup = false
        this.loading.materialPictures = false
      }
    }
    // TODO: 凤凰于飞打点
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
    CpcPriceComp,
    MaterialPicturesComp
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
        font-size: 0.88em;
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
    .tip {
      font-size: 12px;
      color: #6a778c;
    }
    strong {
      color: $c-strong;
      font-size: 14px;
    }
  }
  .update-material-button {
    margin-left: 90px;
  }
}
</style>
