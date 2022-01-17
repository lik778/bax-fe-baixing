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
        <h4>投放物料设置</h4>
        <div class="recommend-box">
          <div class="icon-box"><img src="../../../asset/bw-plus-bw-edit-plan2.png" alt=""></div>
          <div class="text-box">
            <div class="text">
              <div class="title">智能创意推荐
                <span class="color" @click="showCreative" v-if="recommendVisible==false">点击查看</span>
                <span class="color" @click="recommendVisible=false" v-if="recommendVisible==true">点击收回</span></div>
                <div class="content">基于您的关键词所属行业， 已为您推荐以下创意。您可根据需要调整推广标题与内容</div>
            </div>
            <div class="icon"><img src="../../../asset/bw-plus-bw-edit-plan.png" alt=""></div>
          </div>
        </div>
        <Recommend v-if="recommendVisible==true" @getIndex="getIndex" :templateList="template" :keyword="keyword" :id="id"></Recommend>
        <div class="creative">
          <creative-editor :platforms="[SEM_PLATFORM_BAIDU]"
                         :title="form.creativeTitle"
                         :content="form.creativeContent"
                         @change="handleCreativeValueChange"
                         @error="handleCreativeError" />
        <fm-tip class="tip" position="creative" img-url="//file.baixing.net/201903/d6f4502a0e8a659b78a33fbb3713e6b9.png">创意怎么才能飘红</fm-tip>
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
import FmTip from 'com/widget/fm-tip'
import { Recommend } from '../components'

import {
  bwlandingTypeOpts,
  SEM_PLATFORM_BAIDU,
  LANDING_TYPE_AD,
  LANDING_TYPE_STORE
} from 'constant/fengming'
import { PROMOTE_STATUS_OFFLINE } from 'constant/bw-plus'
import { getPromoteDetailById, updatePromoteDetail, recommendList } from 'api/biaowang-plus'
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
      recommendVisible: false,
      templateList: [],
      template: [],
      keyword: null
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
      this.keyword = this.originPromote.keyword
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
    getIndex (val) {
      this.index = val
      this.form.creativeTitle = this.templateList[val].title
      this.form.creativeContent = this.templateList[val].content
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
      const reg = /[`~#^&*_\\[\]·~#￥&*]|[x]{3,}/
      if (reg.test(this.form.creativeTitle) || reg.test(this.form.creativeContent)) {
        return this.$message.error('推广标题和推广内容不能有特殊字符')
      } else {
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
    async showCreative () {
      this.recommendVisible = true
      const { data: { creativeTemplateList } } = await recommendList(this.id)
      this.templateList = creativeTemplateList
      this.extractTemplate()
      const { keyword } = this.originPromote
      bwPlusTrack('bwplus: intelligent recommendation', { keyword, promoteId: this.id })
    },
    extractTemplate () {
      this.template = []
      const reg = /\((.+)\)/g
      this.templateList.forEach(item => {
        const obj = {}
        obj.displayTitle = item.displayTitle.replace(reg, "<span style='color:#FF6350;'>$1</span>")
        obj.displayContent = item.displayContent.replace(reg, "<span style='color:#FF6350;'>$1</span>")
        this.template.push(obj)
      })
    }
  },
  components: {
    MvipSelector,
    UserAdSelector,
    CreativeEditor,
    SelectPromoteDialog,
    FmTip,
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
      >.recommend-box{
        margin: 10px 0;
        padding: 0px 30px;
        width: 620px;
        height: 100px;
        background: #FFF8F7;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        img{
          width: 100%;
          height: 100%;
        }
        .icon-box{
          width: 32px;
          height: 42px;
        }
        .text-box{
          flex: 1;
          height: 42px;
          padding-left: 10px;
          display: flex;
          flex-direction: row;
          .icon{
            width: 42px;
            height: 42px;
          }
          .text{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            .title{
              font-family: PingFangSC-Medium;
              font-weight: bold;
              font-size: 14px;
              color: #000000;
              letter-spacing: 0;
              .color{
                margin-left: 15px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #FF6350;
                letter-spacing: 0;
                cursor: pointer;
              }
            }
            .content{
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #999999;
              letter-spacing: 0;
            }
          }
        }
      }
      > .btn-text{
        color: #409EFF;
        text-decoration-line: underline;
        text-decoration-color: currentColor;
        margin-left: 20px;
      }
       > .creative{
         margin-top: 30px;
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
