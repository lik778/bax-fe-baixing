<template>
  <div class="qwt-update-group">
    <section>
      <header>推广目标设置</header>
      <div class="content">
        <landing-comp :value="group.name"
                      @change="(name) => updateGroupData('name', name)">
          <landing-page-comp :all-areas="allAreas"
                             :landing-type="group.landingType !== LANDING_TYPE_BAIDU_JIMUYU ? LANDING_TYPE_STORE : LANDING_TYPE_BAIDU_JIMUYU"
                             :landing-page="group.landingPage"
                             :landing-page-id="group.landingPageId"
                             :disabled="landingAndCreativesDisabled"
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
                       :group-status="group.frontGroupStatus"
                       :group-status-detail="group.frontGroupStatusDetails"
                       :disabled="landingAndCreativesDisabled"
                       @add-creatives="() => group.creatives.push({ title: '', content: '' })"
                       @remove-creatives="(idx) => group.creatives.splice(idx, 1)"
                       @update-creatives="(idx, newData) => group.creatives.splice(idx, 1, newData)" />
      </div>
    </section>

    <section v-if="enableMaterialPictures">
      <header>创意配图
        <el-tooltip v-if="isCurPromotionOrGroupPaused"
                    placement="top"
                    content="当前计划已下线。重启计划后，创意配图会一并生效">
          <i class="el-icon-question"></i>
        </el-tooltip>
      </header>
      <div class="content">
        <material-pictures-comp v-model="materialPictures"
                                :initValue="materialPicturesInits"/>
      </div>
    </section>

    <section>
      <header>关键词管理（当前计划还可添加<strong>{{ keywordRemainCount }}</strong>个关键词）</header>
      <div class="content">
        <div class="keywords-container">
          <div class="pane">
            <header>添加推广关键词</header>
            <search-comp :group-id="group.id"
                         :areas="promotion.areas"
                         :landing-page="group.landingPage"
                         :landing-type="group.landingType"
                         :sources="[promotion.source]"
                         :creatives="group.creatives"
                         :all-words="keywords.concat(group.negativeWords)"
                         @track="(action, opts) => handleTrack(action, opts)"
                         @add-remove-keywords="handleAddRemoveKeywords"
                         @add-keywords="handleAddKeywords" />
          </div>
          <div class="pane">
            <header>搜索推广关键词</header>
            <el-input v-model="searchWord"
                      class="input"
                      placeholder="请输入关键词查询" />
            <span>多个关键词查询请用逗号隔开</span>
          </div>
          <p class="tip"
             style="margin-top: 20px"
             v-if="promotion.source === SEM_PLATFORM_BAIDU">
            为保证流量，单个单元内的关键词数≥<strong>20</strong>个才能选择精确匹配方式；
            单个单元最多可设置<strong>10</strong>个精确匹配。
          </p>
        </div>
        <keyword-list-comp ref="keywordListComp"
                           :platform="promotion.source"
                           :show-prop-ranking="promotion.source !== SEM_PLATFORM_SHENMA"
                           :show-match-type="promotion.source === SEM_PLATFORM_BAIDU"
                           :group-offline="isCampaignOffline"
                           :group-online="originGroup.status === CAMPAIGN_STATUS_ONLINE"
                           :keywords="keywords"
                           :group-id="groupId"
                           :origin-keywords="originKeywords"
                           :negative-words="group.negativeWords"
                           :search-word="searchWord"
                           @update-origin-keywords="(changeTag, v) => originKeywords = originKeywords.map(o => ({ ...o, [changeTag]: v }))"
                           @update-keywords="(words) => (keywords = words)"
                           @remove-keywords="(idx) => keywords.splice(idx, 1)"
                           @updateGroup="patchMoveGroup" />
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
          当网民的搜索词与精确否定关键词完全一致时，您的推广结果将不会展现。 否词个数不得超过 <strong>{{ negativeKeywordMax }}</strong>个,
          当前否定关键词数量: <strong>{{ group.negativeWords.length }}</strong>个
        </p>
        <negative-keyword-comp :negative-words="group.negativeWords"
                               :all-words="group.negativeWords.concat(keywords.filter(o => !o.isDel))"
                               :show-tip="false"
                               :userInfo="userInfo"
                               :negative-keywords-max="negativeKeywordMax"
                               @track="(action, opts) => handleTrack(action, opts)"
                               @add-negative-words="(words) => group.negativeWords = words.concat(group.negativeWords)"
                               @remove-negative-words="removeNegatives"
                               @remove-other-words="(word) => group.negativeWords.splice(word,1)"
                               />
      </div>
    </section>

    <section>
      <mobile-price-ratio-comp v-if="promotion.source === SEM_PLATFORM_BAIDU"
                               :value="group.mobilePriceRatio"
                               @change="(val) => updateGroupData('mobilePriceRatio', val)" />
      <contract-ack-comp class="contract-ack"
                         type="content-rule"
                         ref="contract" />
      <el-button class="add-group-btn"
                 type="primary"
                 :disabled="groupUpdateDisabled || isCampaignOffline"
                 :loading="lock.materialPictures || lock.group"
                 @click="updateMaterialThenGroup">更新单元</el-button>
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
  NEGATIVE_KEYWORDS_SOGOU_MAX,
  emptyGroup,
  emptyCampaign,
  KEYWORDS_MAX,
  MATERIAL_PIC_STATUS,
  GROUP_STATUS_PENDING_AUDIT,
  SEM_PLATFORM_SOGOU,
  LANDING_TYPE_GW,
  LANDING_TYPE_AD,
  LANDING_TYPE_STORE,
  LANDING_TYPE_BAIDU_JIMUYU,
  NEGATIVE_KEYWORDS_SHENMA_MAX
} from 'constant/fengming'
import clone from 'clone'
import uuid from 'uuid/v4'
import { updateValidator } from './validate'
import track from 'util/track'
import { filterExistCurrentWords } from 'util/group'
import { isSales } from 'util/role'

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
      NEGATIVE_KEYWORDS_SHENMA_MAX,
      SEM_PLATFORM_BAIDU,
      CAMPAIGN_STATUS_OFFLINE,
      CAMPAIGN_STATUS_ONLINE,
      NEGATIVE_KEYWORDS_MAX,
      LANDING_TYPE_STORE,
      LANDING_TYPE_BAIDU_JIMUYU,

      promotion: emptyCampaign,
      originGroup: emptyGroup,
      group: emptyGroup,
      originKeywords: [],
      keywords: [],

      isErrorPage: false,

      isSearchCondition: false,
      searchWord: '',

      campaignKeywordLen: 0,

      lock: {
        group: false,
        materialPictures: false
      },
      materialPictures: {},
      materialPicturesInits: {},
      materialPicturesInitsRaw: null
    }
  },
  computed: {
    keywordRemainCount () {
      return KEYWORDS_MAX - (this.campaignKeywordLen + this.newKeywords.length - this.deletedKeywords.length)
    },
    groupId () {
      return parseInt(this.$route.params.id) || this.originGroup.id
    },
    negativeKeywordMax () {
      return this.promotion.source === SEM_PLATFORM_SOGOU ? NEGATIVE_KEYWORDS_SOGOU_MAX : this.promotion.source === SEM_PLATFORM_SHENMA ? NEGATIVE_KEYWORDS_SHENMA_MAX : NEGATIVE_KEYWORDS_MAX
    },
    // TODO
    isCurPromotionOrGroupPaused () {
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
    },
    isCampaignOffline () {
      return this.originGroup.frontCampaignStatus === CAMPAIGN_STATUS_OFFLINE
    },
    isGroupAudit () {
      return this.originGroup.frontGroupStatus === GROUP_STATUS_PENDING_AUDIT
    },
    isSales () {
      return isSales(this.userInfo.roles)
    },
    landingAndCreativesDisabled () {
      const { query: { source } } = this.$route
      // TIP 审核中：神马，百度，360落地页和创意应该可以修改；搜狗无法修改
      if (this.promotion.source === SEM_PLATFORM_SOGOU) {
        return (isSales(this.userInfo.roles) && !source) || this.isCampaignOffline || this.isGroupAudit
      }
      return (isSales(this.userInfo.roles) && !source) || this.isCampaignOffline
    },
    groupUpdateDisabled () {
      const { query: { source } } = this.$route
      return isSales(this.userInfo.roles) && !source
    }
  },
  async mounted () {
    const { query: { user_id: userId } } = this.$route
    const loadingInstance = this.$loading({
      lock: true,
      target: '.qwt-update-group',
      text: '正在加载中...',
      spinner: 'el-icon-loading'
    })
    try {
      const originGroup = await getGroupDetailByGroupId(this.groupId, { userId })
      this.originGroup = originGroup
      this.promotion = clone(this.originGroup.campaign)
      this.group = clone(this.originGroup)

      this.originKeywords = await getKeywordsByGroupId(this.groupId, userId)
      // TIP: 2021-06-16 xielizhen 下线官网落地页渠道，原有的计划选择官网重新选择落地页
      if (originGroup.landingType === LANDING_TYPE_GW) {
        this.group.landingType = LANDING_TYPE_AD
        this.group.landingPage = ''
        this.group.landingPageId = ''
      }
      this.keywords = clone(this.originKeywords)

      this.campaignKeywordLen = await getCampaignKeywordsCount(this.promotion.id, userId)

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
      const { query: { user_id: userId } } = this.$route
      this.materialPicturesInits = inits || (await getMaterialPictures({
        groupId: this.groupId,
        userId
      })).data

      // eslint-disable-next-line camelcase
      const { image_type, pc = [], wap = [] } = this.materialPicturesInits
      this.materialPicturesInitsRaw = {
        image_type,
        pc: [...pc],
        wap: [...wap]
      }
    },
    updateGroupData (type, data) {
      if (typeof type === 'string') {
        this.group[type] = data
        return
      }
      Object.assign(this.group, type)
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
    handleAddRemoveKeywords (deletedWords) {
      const words = deletedWords.map(w => w.word.toLowerCase())
      this.keywords = this.keywords.map(w => {
        if (words.includes(w.word.toLowerCase())) {
          // TIP 原有关键词列表有，并且价格和匹配模式有一个不一致，表示更新啦
          const existWord = this.originKeywords.find(o => o.word.toLowerCase() === w.word.toLowerCase())
          const isEqual = (existWord.price === w.price) && (existWord.matchType === w.matchType)
          return {
            ...w,
            isDel: false,
            isUpdated: !isEqual
          }
        }
        return w
      })
    },
    async updateMaterialThenGroup () {
      const { groupId } = this.groupId
      const { id: campaignId } = this.promotion
      try {
        await this.updateMaterialPictures()
        await this.updateGroup({ groupId, campaignId, moveKeywords: false })
      } catch (e) {
        // console.log(e, 'e')
        // throw new Error(e.message)
        this.$message({
          message: e.message,
          type: 'error'
        })
      }
    },
    async validateGroup () {
      if (!this.$refs.contract.$data.isAgreement) {
        throw new Error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.isErrorPage) {
        throw new Error('当前投放页面失效，请重新选择新的投放页面')
      }

      try {
        await updateValidator.validate({
          ...this.group,
          keywords: this.keywords,
          promotion: this.promotion
        }, { first: true })
      } catch (e) {
        throw new Error(e.errors[0].message)
      }
    },
    async updateGroup ({ groupId, campaignId, moveKeywords }) {
      this.lock.group = true
      try {
        await this.validateGroup()
        await this._updateGroup(groupId, campaignId, moveKeywords)
      } finally {
        this.lock.group = false
      }
    },
    async patchMoveGroup ({ groupId, campaignId, moveKeywords, isNewSelect }, cboptions) {
      this.lock.group = true
      try {
        await this._updateGroup(groupId, campaignId, moveKeywords, isNewSelect)
        cboptions && cboptions.success()
      } catch (error) {
        cboptions && cboptions.error()
        throw new Error(error)
      } finally {
        cboptions && cboptions.finally()
        this.lock.group = false
      }
    },
    async _updateGroup (groupId = this.groupId, campaignId = this.promotion.id, moveKeywords = false, isNewSelect = []) {
      const { query: { user_id: userId } } = this.$route
      const data = {}
      const updateKeywords = isNewSelect.length > 0 ? { newKeywords: isNewSelect } : this.getUpdatedKeywordData()
      Object.assign(data, {
        ...this.getUpdatedLandingData(),
        ...this.getUpdatedNegativeWordData(),
        ...this.getUpdatedCreativeData(),
        ...updateKeywords,
        userId,
        moveKeywords
      })
      await updateGroup(groupId, data)
      if (moveKeywords) {
        this.$message.success('操作成功！')
      } else {
        this.$refs.keywordListComp.resetSelect()
        this.$message.success('单元更新成功')
      }
      this.handleTrack('leave-page: update-group')
      if (!moveKeywords) {
        this.$router.push({
          name: 'qwt-update-promotion',
          params: { id: campaignId }
        })
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
    async updateMaterialPictures () {
      if (this.enableMaterialPictures) {
        this.lock.materialPictures = true
        try {
          this.validMaterialPictures()
          await this._updateMaterialPictures()
        } finally {
          this.lock.materialPictures = false
        }
      }
    },
    async _updateMaterialPictures () {
      const { query: { user_id: userId } } = this.$route
      const isChanged = !![
        this.materialPictures.del.wap,
        this.materialPictures.del.pc,
        this.materialPictures.add.wap,
        this.materialPictures.add.pc
      ].find(x => x.length)

      if (!isChanged) {
        return
      }

      const res = await updateMaterialPictures({
        groupId: this.groupId,
        imageType: this.materialPictures.type,
        deleteImages: [
          ...this.materialPictures.del.wap,
          ...this.materialPictures.del.pc
        ],
        newImages: this.materialPictures.add,
        userId
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
      }
    },
    getUpdatedLandingData () {
      const data = {}
      const { landingPage, landingType, landingPageId, mobilePriceRatio, name } = this.group
      // TIP landingPage/landingPageId更改一个，landingType必传
      if (landingPage.split('?')[0] !== this.originGroup.landingPage.split('?')[0] ||
          landingPageId !== this.originGroup.landingPageId) {
        data.landingPage = landingPage
        data.landingType = landingType
        data.landingPageId = landingPageId
      }
      if (mobilePriceRatio !== this.originGroup.mobilePriceRatio) data.mobilePriceRatio = mobilePriceRatio
      if (name !== this.originGroup.name) data.name = name
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
      const updatedCreatives = creatives.filter(
        o => originCreatives.find(x => x.id === o.id && (x.title !== o.title || x.content !== o.content)))

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
    },
    removeNegatives (words = {}) {
      const index = this.group.negativeWords.findIndex(item => item.word === words.word && item.matchType === words.matchType)
      this.group.negativeWords.splice(index, 1)
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
