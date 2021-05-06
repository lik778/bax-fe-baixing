<template>
  <div class="qwt-update-group">
    <section>
      <header>推广目标设置</header>
      <div class="content">
        <landing-comp :value="group.name"
                      @change="(name) => updateGroupData('name', name)">
          <landing-page-comp :all-areas="allAreas"
                             :landing-type="group.landingType"
                             :landing-page="group.landingPage"
                             :landing-page-id="group.landingPageId"
                             :disabled="false"
                             @valid="(isValid) => { isErrorPage = !isValid }"
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
      <header>关键词管理（当前计划还可添加<strong>{{ keywordRemainCount }}</strong>个关键词）</header>
      <div class="content">
        <div class="keywords-container">
          <div class="pane">
            <header>添加推广关键词</header>
            <search-comp :campaign-id="promotion.id"
                         :group-id="groupId"
                         :areas="promotion.areas"
                         :landing-page="group.landingPage"
                         :landing-type="group.landingType"
                         :sources="[promotion.source]"
                         :creatives="group.creatives"
                         :all-words="keywords.concat(group.negativeWords)"
                         @track="(action, opts) => handleTrack(action, opts)"
                         @track-recommend="(arr) => getRecommendData"
                         @add-keywords="handleAddKeywords" />
          </div>
          <div class="pane">
            <header>搜索推广关键词</header>
            <el-input v-model="searchWord"
                      class="input"
                      placeholder="请输入关键词查询" />
          </div>
          <p class="tip"
             style="margin-top: 20px"
             v-if="promotion.source === SEM_PLATFORM_BAIDU">
            为保证流量，单计划内的关键词数≥<strong>30</strong>个才能选择精确匹配方式；
            单个计划最多可设置<strong>10</strong>个精确匹配。
          </p>
        </div>
        <keyword-list-comp ref="keywordListComp"
                           :platform="promotion.source"
                           :show-prop-ranking="promotion.source !== SEM_PLATFORM_SHENMA"
                           :show-match-type="promotion.source === SEM_PLATFORM_BAIDU"
                           :group-offline="originGroup.status === CAMPAIGN_STATUS_OFFLINE"
                           :group-online="originGroup.status === CAMPAIGN_STATUS_ONLINE"
                           :keywords="keywords"
                           :group-id="groupId"
                           :origin-keywords="originKeywords"
                           :search-word="searchWord"
                           @update-origin-keywords="(changeTag, v) => originKeywords = originKeywords.map(o => ({ ...o, [changeTag]: v }))"
                           @update-keywords="(words) => (keywords = words)"
                           @remove-keywords="(idx) => keywords.splice(idx, 1)" />
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
                               :all-words="group.negativeWords.concat(keywords)"
                               :show-tip="false"
                               @track="(action, opts) => handleTrack(action, opts)"
                               @add-negative-words="(words) => group.negativeWords = words.concat(group.negativeWords)"
                               @remove-negative-words="(idx) => group.negativeWords.splice(idx, 1)" />
      </div>
    </section>

    <section>
      <mobile-price-ratio-comp :value="group.mobilePriceRatio"
                               @change="(val) => updateGroupData('mobilePriceRatio', val)" />
      <contract-ack-comp class="contract-ack"
                         type="content-rule"
                         ref="contract" />
      <el-button class="add-group-btn"
                 type="primary"
                 @click="updateGroup">更新单元</el-button>
    </section>

  </div>
</template>

<script>
import LandingComp from './landing-page'
import LandingPageComp from './landing-page/landing'
import CreativeComp from './creative'
import CreativeTipComp from './creative/creative-tip'
import SearchComp from './keyword/search'
import NegativeKeywordComp from 'com/common/qwt/negative-words'
import ContractAckComp from 'com/widget/contract-ack'
import MobilePriceRatioComp from './mobile-price-ratio'
import KeywordListComp from './keyword/keyword-list'
import MaterialPicturesComp from 'com/common/material-pictures-dialog'

import {
  SEM_PLATFORM_SHENMA,
  SEM_PLATFORM_BAIDU,
  CAMPAIGN_STATUS_OFFLINE,
  CAMPAIGN_STATUS_ONLINE,
  NEGATIVE_KEYWORDS_MAX,
  emptyGroup,
  emptyCampaign,
  KEYWORDS_MAX,
  FHYF_USERD,
  FHYF_UN_USE,
  MATERIAL_PIC_STATUS
} from 'constant/fengming'
import clone from 'clone'
import uuid from 'uuid/v4'
import { updateValidator } from './validate'
import { isArrHasSameValue } from 'util'
import track, { trackRecommendService } from 'util/track'
import { filterExistCurrentWords } from 'util/group'

import {
  getCampaignKeywordsCount,
  getKeywordsByGroupId,
  getGroupDetailByGroupId,
  updateGroup,
  getMaterialPictures,
  updateMaterialPictures
} from 'api/fengming'

export default {
  name: 'qwt-update-group',
  props: {
    allAreas: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      actionTrackId: uuid(),

      SEM_PLATFORM_SHENMA,
      SEM_PLATFORM_BAIDU,
      CAMPAIGN_STATUS_OFFLINE,
      CAMPAIGN_STATUS_ONLINE,
      NEGATIVE_KEYWORDS_MAX,

      promotion: emptyCampaign,
      originGroup: emptyGroup,
      group: emptyGroup,
      originKeywords: [],
      keywords: [],

      isUpdating: false,
      isErrorPage: false,

      isSearchCondition: false,
      searchWord: '',

      campaignKeywordLen: 0,
      recommendList: null,

      loading: {
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
    keywordRemainCount () {
      return KEYWORDS_MAX - (this.campaignKeywordLen + this.newKeywords.length - this.deletedKeywords.length)
    },
    groupId () {
      return this.$route.params.id
    },
    // TODO
    isCurPromotionOrGroupPaused () {
      console.log(this.promotion, this.group)
      return this.promotion.pause === 1 || this.group.pause === 1
    },
    enableMaterialPictures () {
      /* 渠道非百度或复制单元时不能展示创意配图 */
      const isBaidu = this.promotion.source === SEM_PLATFORM_BAIDU
      const hasCloneID = !!this.$route.query.cloneId
      return isBaidu && !hasCloneID
    },
    newKeywords () {
      return this.keywords.filter(o => o.isNew)
    },
    deletedKeywords () {
      return this.keywords.filter(o => o.isDel)
    },
    updatedKeywords () {
      return this.keywords.filter(o => o.isUpdated)
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
    const loadingInstance = this.$loading({
      lock: true,
      target: '.qwt-update-group',
      text: '正在加载中...',
      spinner: 'el-icon-loading'
    })
    try {
      const originGroup = await getGroupDetailByGroupId(this.groupId)
      this.originGroup = originGroup
      this.promotion = clone(this.originGroup.campaign)
      this.group = clone(this.originGroup)

      this.originKeywords = await getKeywordsByGroupId(this.groupId)
      this.keywords = clone(this.originKeywords)

      this.campaignKeywordLen = await getCampaignKeywordsCount(this.promotion.id)

      if (this.enableMaterialPictures) {
        this.initMaterialPictures()
      }
    } finally {
      loadingInstance.close()
    }

    this.handleTrack('enter-page: update-group')
  },
  methods: {
    async initMaterialPictures (inits) {
      this.isMaterialChanged = false
      this.isMaterialChangeLock = true
      this.materialPicturesInits = inits || (await getMaterialPictures({
        groupId: this.groupId
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
    updateGroupData (type, data) {
      if (typeof type === 'string') {
        this.group[type] = data
        return
      }
      Object.assign(this.group, type)
    },
    getRecommendData (arr) {
      this.recommendList = (this.recommendList || []).concat(arr)
    },
    trackPromotionKeywords () {
      // TODO: 确认一下是否要打点
      const recommendKeywords = [...new Set(this.recommendKeywords || [])]

      trackRecommendService({
        action: 'record-promotion-keywords',

        id: this.id,
        areas: this.promotion.areas,
        landingPage: this.group.landingPage,
        creativeTitle: this.group.creatives[0].title,
        creativeContent: this.group.creatives[0].content,
        source: this.promotion.source,
        dailyBudget: this.promotion.dailyBudget,
        landingType: this.group.landingType,
        useRecommendKeywords: Array.isArray(this._recommendKeywords) ? FHYF_USERD : FHYF_UN_USE, // 是否使用一键拓词功能

        recommendKeywords: recommendKeywords.map(({ word, recommandSource = 'user_selected', price }) => `${word}=${recommandSource}=${price}`).join(','),
        newKeywords: this.newKeywords.map(({ word, recommandSource = 'user_selected', price }) => `${word}=${recommandSource}=${price}`).join(','),
        deletedKeywords: this.deletedKeywords.map(({ word, price }) => `${word}=${price}`).join(','),
        updatedKeywords: this.updatedKeywords.map(({ word, price }) => `${word}=${price}`).join(',')
      })
    },

    handleTrack (action, opts = {}) {
      const { userInfo, actionTrackId } = this
      track({
        action,
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId,
        campaignId: this.promotion.id,
        ...opts
      })
    },
    handleAddKeywords (words) {
      this.keywords = words.concat(this.keywords)
      this.$refs.keywordListComp.$data.offset = 0
    },
    async validateGroup () {
      if (!this.$refs.contract.$data.isAgreement) {
        throw new Error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.isErrorPage) {
        throw new Error('当前投放页面失效，请重新选择新的投放页面')
      }
      if (this.isUpdating) {
        throw new Error('正在更新中, 请稍等一会儿 ~')
      }

      try {
        await updateValidator.validate({ ...this.group, keywords: this.keywords }, { first: true })
      } catch (e) {
        throw new Error(e.errors[0].message)
      }
    },
    async updateGroup () {
      try {
        await this.validateGroup()
        this.isUpdating = true

        if (this.enableMaterialPictures) {
          this.loading.materialPictures = true
          await this._updateMaterialPictures()
        }
        await this._updateGroup()

        await trackRecommendService()
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.isUpdating = false
        this.loading.materialPictures = false
      }
    },
    async _updateGroup () {
      const data = {}
      Object.assign(data, {
        ...this.getUpdatedLandingData(),
        ...this.getUpdatedNegativeWordData(),
        ...this.getUpdatedCreativeData(),
        ...this.getUpdatedKeywordData()
      })

      await updateGroup(this.groupId, data)

      this.handleTrack('leave-page: update-group')

      this.$router.push({
        name: 'qwt-update-promotion',
        params: { id: this.promotion.id }
      })
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
        groupId: this.groupId,
        imageType: this.materialPictures.type,
        deleteImages: [
          ...this.materialPictures.del.wap,
          ...this.materialPictures.del.pc
        ],
        newImages: this.materialPictures.add
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
    getUpdatedLandingData () {
      const data = {}
      const { landingPage, landingType, landingPageId, mobilePriceRatio } = this
      if (landingType !== this.originGroup.landingType) data.landingType = landingType
      if (landingPage !== this.originGroup.landingPage) data.landingPage = landingPage
      if (landingPageId !== this.originGroup.landingPageId) data.landingPageId = landingPageId
      if (mobilePriceRatio !== this.originGroup.mobilePriceRatio) data.mobilePriceRatio = mobilePriceRatio
      return data
    },
    getUpdatedNegativeWordData () {
      const data = {}
      const { negativeWords } = this.group
      const originNegativeWords = this.originGroup.negativeWords
      const newNegativeKeywords = filterExistCurrentWords(originNegativeWords, negativeWords)
      const deletedNegativeKeywords = (filterExistCurrentWords(negativeWords, originNegativeWords) || []).map(o => o.id)
      if (newNegativeKeywords.length) data.newNegativeKeywords = newNegativeKeywords
      if (deletedNegativeKeywords.length) data.deletedNegativeKeywords = deletedNegativeKeywords
      return data
    },
    getUpdatedCreativeData () {
      const data = {}
      const { creatives } = this.group
      const originCreatives = this.originGroup.creatives
      const newCreatives = creatives.filter(o => !o.id)
      const deletedCreatives = originCreatives.filter(o => !creatives.find(x => x.id === o.id)).map(o => o.id)
      const updatedCreatives = originCreatives.filter(
        o => creatives.find(x => x.id === o.id && (x.title !== o.title || x.content !== o.content)))

      if (newCreatives.length) data.newCreatives = newCreatives
      if (deletedCreatives.length) data.deletedCreatives = deletedCreatives
      if (updatedCreatives.length) data.updatedCreatives = updatedCreatives
      return data
    },
    getUpdatedKeywordData () {
      const data = {}
      if (this.newKeywords.length) data.newKeywords = this.newKeywords
      if (this.deletedKeywords.length) data.deletedKeywords = this.deletedKeywords.map(o => o.id)
      if (this.updatedKeywords.length) data.updatedKeywords = this.updatedKeywords
      return data
    }
  },
  components: {
    LandingComp,
    LandingPageComp,
    CreativeComp,
    CreativeTipComp,
    SearchComp,
    NegativeKeywordComp,
    ContractAckComp,
    MobilePriceRatioComp,
    KeywordListComp,
    MaterialPicturesComp
  }
}
</script>

<style lang="scss" scoped>
.qwt-update-group {
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
    strong {
      color: $c-strong;
    }
  }

  .keywords-container {
    .pane {
      display: flex;
      align-items: center;
      &:not(:first-child) {
        margin-top: 10px;
      }
      > header {
        flex: 0 0 120px;
      }
      .input {
        width: 240px;
        margin-right: 6px;
      }
    }
    .tabs {
      margin-top: 20px;
    }
  }

  .tip {
    font-size: 12px;
    color: #6a778c;
  }
  strong {
    color: $c-strong;
    font-size: 14px;
  }

  .update-material-button {
    margin-left: 90px;
  }
}
</style>
