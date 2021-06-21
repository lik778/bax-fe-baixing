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
                 :loading="loading"
                 type="primary"
                 @click="onSubmit">更新标王2.0计划</el-button>
    </main>
  </div>
</template>

<script>
import { landingTypeOpts, SEM_PLATFORM_BAIDU, LANDING_TYPE_AD, LANDING_TYPE_STORE } from 'constant/fengming'
import MvipSelector from 'com/common/mvip-selector'
import UserAdSelector from 'com/common/ad-selector'
import CreativeEditor from 'com/widget/creative-editor'

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

      form: {
        landingType: LANDING_TYPE_AD,
        landingPage: '',
        landingPageId: '',
        creativeTitle: '',
        creativeContent: ''
      },
      isErrorLandingPageShow: false,
      loading: false
    }
  },
  computed: {
    isPromoteOffline () {
      return false
    }
  },
  methods: {
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
    onSubmit () {
    }
  },
  components: {
    MvipSelector,
    UserAdSelector,
    CreativeEditor
  }
}
</script>

<style lang='scss' scoped>
.bw-plus-edit-plan {
  margin: 10px;
  background: #fff;
  padding: 0;
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
