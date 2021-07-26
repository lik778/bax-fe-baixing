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
          <el-radio-button v-for="option of landingTypeOpts"
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
        <h4>投放物料设置</h4>
        <creative-editor :platforms="[SEM_PLATFORM_BAIDU]"
                         :title="form.creativeTitle"
                         :content="form.creativeContent"
                         @change="handleCreativeValueChange"
                         @error="handleCreativeError" />
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

import {
  landingTypeOpts,
  SEM_PLATFORM_BAIDU,
  LANDING_TYPE_AD,
  LANDING_TYPE_STORE
} from 'constant/fengming'
import { getPromoteDetailById, updatePromoteDetail } from 'api/biaowang-plus'
import { createValidator } from './validate'

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
      landingTypeOpts,
      selectPromoteDialogVisible: false,

      originPromote: null,
      form: {
        landingType: LANDING_TYPE_AD,
        landingPage: '',
        landingPageId: '',
        creativeTitle: '',
        creativeContent: '',
        promoteIds: []
      },
      isErrorLandingPageShow: false,
      loading: false
    }
  },
  computed: {
    isPromoteOffline () {
      return false
    },
    id () {
      return this.$route.params.id
    }
  },
  mounted () {
    this.getPromoteDetail()
  },
  methods: {
    async getPromoteDetail () {
      const data = await getPromoteDetailById(this.id)
      this.originPromote = data
      const { landingType, landingPage, landingPageId, creativeTitle, creativeContent } = data
      this.form = {
        promoteIds: [+this.id],
        creativeTitle: creativeTitle || '',
        creativeContent: creativeContent || '',
        landingType: landingType || LANDING_TYPE_AD,
        landingPage: landingPage || '',
        landingPageId: landingPageId || ''
      }
    },
    clearLandingPage () {
      this.form.landingPage = ''
      this.form.landingPageId = ''
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
    },
    handleCreativeError (msg) {
      if (msg) this.$message.error(msg)
      this.creativeError = msg
    },
    async handleUpdatePromoteIds (promoteIds) {
      this.form.promoteIds = promoteIds
      if (!promoteIds.length) {
        return this.$message.error('必须选择一个标王推广计划!')
      }
      this.loading = true
      try {
        await updatePromoteDetail(this.form)
        this.selectPromoteDialogVisible = false
        this.$router.push({ name: 'bw-plus-plan-list', params: { id: this.originPromote.packageId } })
      } finally {
        this.loading = false
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
    SelectPromoteDialog
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
    }
  }
}
</style>
