<template>
  <div class="bw-plus-edit-plan">
    <el-breadcrumb separator="/"
                   class="breadcrumb">
      <el-breadcrumb-item>管理推广</el-breadcrumb-item>
      <el-breadcrumb-item>推广计划</el-breadcrumb-item>
      <el-breadcrumb-item>编辑创意</el-breadcrumb-item>
    </el-breadcrumb>
    <main>
      <div class="panel">
        <h4>投放页面设置</h4>
        <el-radio-group v-model="form.landingType"
                        style="margin: 14px 0 10px 0"
                        @change="clearLandingPage">
          <el-radio-button v-for="option of bwlandingTypeOpts"
                           :key="option.value"
                           :label="option.value">{{option.label}}</el-radio-button>
        </el-radio-group>
        <div>
          <user-ad-selector v-if="form.landingType === LANDING_TYPE_AD"
                            :all-areas="allAreas"
                            style="margin-top: 14px"
                            :limit-mvp="false"
                            :selected-id="form.landingPageId"
                            @valid-change="isValid => setLandingPageValidity(LANDING_TYPE_AD, isValid)"
                            @select-ad="onSelectAd" />
          <mvip-selector v-if="form.landingType === LANDING_TYPE_STORE"
                         :init-value="form.landingPageId"
                         @change="onSelectStore"
                         @valid-change="isValid => setLandingPageValidity(LANDING_TYPE_STORE, isValid)" />
        </div>
      </div>
      <div class="panel">
        <h4 class="title">投放物料设置</h4><el-button type="text" class="btn-text" @click="showRecommend">智能推荐</el-button>
        <Recommend v-if="recommendVisible" @close="recommendVisible=false"></Recommend>
        <div class="creative">
          <creative-editor :platforms="[SEM_PLATFORM_BAIDU]"
                         :title="form.creativeTitle"
                         :content="form.creativeContent"
                         @change="handleCreativeValueChange"
                         @error="handleCreativeError" />
        <!-- <fm-tip class="tip" position="creative" img-url="//file.baixing.net/201903/d6f4502a0e8a659b78a33fbb3713e6b9.png">创意怎么才能飘红</fm-tip> -->
        </div>
      </div>
      <el-button :disabled="isPromoteOffline"
                 type="primary"
                 @click="onSubmit">更新标王2.0计划</el-button>
    </main>
    <select-promote-dialog :visible="selectPromoteDialogVisible"
                           :package-id="originPromote.packageId"
                           @close="selectPromoteDialogVisible = false"
                           @update-promote-ids="handleUpdatePromoteIds"
                           :promote-ids="form.promoteIds"
                           :loading="loading"
                           v-if="originPromote" />
  </div>
</template>

<script>
import MvipSelector from 'com/common/mvip-selector'
import UserAdSelector from 'com/common/ad-selector'
import CreativeEditor from 'com/widget/creative-editor'
import SelectPromoteDialog from '../components/select-promote-dialog.vue'
// import FmTip from 'com/widget/fm-tip'
import { Recommend } from '../components'

import {
  bwlandingTypeOpts,
  SEM_PLATFORM_BAIDU,
  LANDING_TYPE_AD,
  LANDING_TYPE_STORE
} from 'constant/fengming'
import { PROMOTE_STATUS_OFFLINE } from 'constant/bw-plus'
import { getPromoteDetailById, updatePromoteDetail } from 'api/biaowang-plus'
import { createValidator } from './validate'
import { bwPlusTrack, time, getStart } from '../utils/track'

export default {
  name: 'bw-plus-edit-plan',
  props: {
    allAreas: {
      type: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      LANDING_TYPE_AD,
      LANDING_TYPE_STORE,
      SEM_PLATFORM_BAIDU,
      bwlandingTypeOpts,
      selectPromoteDialogVisible: false,

      originPromote: null,
      form: {
        landingType: LANDING_TYPE_STORE,
        landingPage: '',
        landingPageId: '',
        creativeTitle: '',
        creativeContent: '',
        promoteIds: []
      },
      isErrorLandingPageShow: false,
      loading: false,
      trackData: {},
      startTime: 0,
      recommendVisible: false
    }
  },
  computed: {
    isPromoteOffline () {
      const { status } = this.form
      return [PROMOTE_STATUS_OFFLINE].includes(status)
    },
    id () {
      return this.$route.params.id
    }
  },
  mounted () {
    this.getPromoteDetail()
    getStart('create')
  },
  methods: {
    async getPromoteDetail () {
      const data = await getPromoteDetailById(this.id)
      this.originPromote = data
      const { landingType, landingPage, landingPageId, creativeTitle, creativeContent, status } = data
      this.form = {
        promoteIds: [+this.id],
        creativeTitle: creativeTitle || '',
        creativeContent: creativeContent || '',
        landingType: landingType || LANDING_TYPE_STORE,
        landingPage: landingPage || '',
        landingPageId: landingPageId || '',
        status
      }
    },
    clearLandingPage () {
      this.form.landingPage = ''
      this.form.landingPageId = ''
    },
    showRecommend () {
      this.recommendVisible = true
    },
    setLandingPageValidity (type, isValid) {
      this.isErrorLandingPageShow = !isValid
    },
    onSelectAd (ad) {
      this.form.landingType = LANDING_TYPE_AD
      this.form.landingPageId = ad.adId
      this.form.landingPage = ad.url

      this.form.creativeTitle = ad.title && ad.title.slice(0, 24)
      this.form.creativeContent = ad.content && ad.content.slice(0, 39)
    },
    onSelectStore (url, id) {
      this.form.landingType = LANDING_TYPE_STORE
      this.form.landingPageId = id
      this.form.landingPage = url
    },
    handleCreativeValueChange ({ title, content }) {
      this.form.creativeTitle = title
      this.form.creativeContent = content
      getStart()
      this.trackData.editeCreativeTime = time('action')
    },
    handleCreativeError (msg) {
      if (msg) this.$message.error(msg)
      this.creativeError = msg
    },
    async handleUpdatePromoteIds (promoteIds) {
      this.form.promoteIds = promoteIds
      const { creativeError } = this
      if (!promoteIds.length) {
        return this.$message.error('必须选择一个标王推广计划!')
      }
      if (creativeError) {
        return this.$message.error(creativeError)
      }
      this.loading = true
      try {
        await updatePromoteDetail(this.form)
        this.selectPromoteDialogVisible = false
        this.$router.push({ name: 'bw-plus-plan-list', params: { id: this.originPromote.packageId } })
      } finally {
        this.loading = false
        this.trackData.createPromoteTime = time('create')
        const { trackData, id } = this
        bwPlusTrack('bwplus: edite plan', { ...trackData, promoteId: id })
      }
    },
    async onSubmit () {
      if (this.isErrorLandingPageShow) {
        return this.$message.error('当前投放页面失效，请重新选择新的投放页面')
      }
      if (this.creativeError) {
        return this.$message.error(this.creativeError)
      }
      try {
        await createValidator.validate(this.form, { first: true })
      } catch (e) {
        return this.$message.error(e.errors[0].message)
      }
      this.selectPromoteDialogVisible = true
    }
  },
  components: {
    MvipSelector,
    UserAdSelector,
    CreativeEditor,
    SelectPromoteDialog,
    // FmTip,
    Recommend
  }
}
</script>

<style lang='scss' scoped>
.bw-plus-edit-plan {
  margin: 10px;
  padding: 0 0 20px;
  background: #fff;
  > .breadcrumb {
    color: #666;
    border-bottom: 1px solid #e6e6e6;
    padding: 14px;
    font-size: 13px;
  }
  > main {
    padding: 0 60px;
    > .panel {
      margin-top: 30px;
      > .title{
        display: inline-block;
      }
      > .btn-text{
        color: #409EFF;
        text-decoration-line: underline;
        text-decoration-color: currentColor;
        margin-left: 20px;
      }
       > .creative{
        position: relative;
        > .tip {
          position: absolute;
          left: 700px;
          top: 50px;
        }
      }
    }
  }
}
</style>
