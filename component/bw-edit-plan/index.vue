<template>
  <div class="bg">
    <div class="white-bg">
      <header>我的标王推广计划</header>
      <main>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="推广关键词" prop="promoteIds">
            <el-checkbox-group v-model="form.promoteIds">
              <el-checkbox v-for="(promote, index) in promotes" :key="index" :label="promote.id" :disabled="!!$route.query.promoteId">{{promote.word}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="投放页面" prop="landingPage">
            <div v-if="!isErrorLandingPageShow">
              <div class="landing-type">
                <el-radio-group v-model="landingTypeDisplay" size="small">
                  <el-radio-button v-for="option of landingTypeOpts" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
                </el-radio-group>
                <a v-if="isSpecialLandingpage" href="javascript:;" class="qiqiaoban-warning" @click="goChargeKaSite">升级新精品官网，搜索通替你付一半</a>
              </div>
              <div class="landing-page">
                <user-ad-selector
                  :type="adSelectorType"
                  v-if="landingTypeDisplay === 0"
                  :all-areas="allAreas"
                  :limit-mvp="false"
                  :selected-id="form.landingPageId"
                  @select-ad="onSelectAd"
                />
                <qiqiaoban-page-selector
                  v-if="landingTypeDisplay === 1 || landingTypeDisplay === 2"
                  :value="form.landingPage"
                  :is-special-landingpage="isSpecialLandingpage"
                  @change="onQiqiaobanChange"
                />
                <mvip-selector
                  v-if="landingTypeDisplay === LANDING_TYPE_STORE"
                  :initValue="form.landingPageId"
                  @change="onSelectStore"
                />
              </div>
            </div>
            <div class="error-page-placeholder" v-else>
              所选推广页面失效，请 <a href="javascript:;" @click="reselectLandingpage">重新选择</a>
            </div>
          </el-form-item>
          <h3>投放物料设置</h3>
          <p class="reject-reason" v-if="isPromoteRejected">{{rejectReason}}</p>
          <creative-editor
            :platforms="[SEM_PLATFORM_BAIDU]"
            :title="form.creativeTitle"
            :content="form.creativeContent"
            @change="handleCreativeValueChange"
            @error="handleCreativeError"
          />
          <el-form-item>
            <el-button :disabled="isPromoteOffline" :loading="isLoading" @click="onSubmit" type="primary">{{buttonText}}</el-button>
          </el-form-item>
        </el-form>
      </main>
    </div>
  </div>
</template>

<script>
import { isQiqiaobanSite, isWeishopSite, getLandingpageByPageProtocol } from 'util/kit'
import { getPromoteById, getPromtesByOrders, updatePromote, getQiqiaobanCoupon } from 'api/biaowang'
import { landingTypeOpts, SEM_PLATFORM_BAIDU, LANDING_TYPE_AD, LANDING_TYPE_STORE } from 'constant/fengming'
import {
  AUDIT_STATUS_REJECT,
  PROMOTE_STATUS_OFFLINE,
  PROMOTE_STATUS_PENDING_EDIT
} from 'constant/biaowang'
import { Message } from 'element-ui'
import UserAdSelector from 'com/common/user-ad-selector'
import CreativeEditor from 'com/widget/creative-editor'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import MvipSelector from 'com/common/mvip-selector'
import { queryAds } from 'api/fengming'

export default {
  name: 'bw-edit-plan',
  props: {
    allAreas: Array
  },
  components: {
    UserAdSelector,
    CreativeEditor,
    QiqiaobanPageSelector,
    MvipSelector
  },
  data () {
    return {
      SEM_PLATFORM_BAIDU,
      LANDING_TYPE_AD,
      LANDING_TYPE_STORE,
      promotes: [],
      landingTypeDisplay: 0,
      isErrorLandingPageShow: false,
      isSpecialLandingpage: false,
      form: {
        promoteIds: [],
        landingType: 0,
        landingPageId: '',
        landingPage: '',
        creativeTitle: '',
        creativeContent: ''
      },
      rules: {
        promoteIds: [{ required: true, message: '请勾选关键词' }],
        landingPage: [{ required: true, message: '请选择投放页面' }]
      },
      buttonText: '创建标王计划',

      landingTypeOpts,
      creativeError: '',
      isLoading: false,
      showNotice: false,
      adSelectorType: 'reselect'
    }
  },
  computed: {
    isPromoteRejected () {
      return this.promotes.some(p => AUDIT_STATUS_REJECT.includes(p.auditStatus))
    },
    rejectReason () {
      return this.promotes.map(p => p.auditRejectReason).join(',')
    },
    isPromoteOffline () {
      return this.promotes.some(p => PROMOTE_STATUS_OFFLINE.includes(p.status))
    }
  },
  async mounted () {
    const { promoteId, orderIds: orderIdsString, notice } = this.$route.query
    if (promoteId) {
      const onePromote = await getPromoteById(promoteId)
      this.promotes = [onePromote]
      const { landingType, landingPage, landingPageId, creativeTitle, creativeContent } = onePromote
      this.form = {
        promoteIds: [+promoteId],
        landingType: landingType || 0,
        landingPage,
        creativeTitle: creativeTitle || '',
        creativeContent: creativeContent || '',
        landingPageId: landingPageId || ''
      }
      this.landingTypeDisplay = landingType || 0
      this.buttonText = '更新标王计划'
    }
    if (orderIdsString) {
      const orderIds = orderIdsString.split(',')
      this.promotes = await getPromtesByOrders(orderIds)
      this.form.promoteIds = this.promotes.map(p => p.id)
      this.buttonText = '创建标王计划'
    }
    if (notice === 'true' || notice === '1') {
      this.showNotice = true
    }
    this.adSelectorType = this.promotes.every(p => PROMOTE_STATUS_PENDING_EDIT.includes(p.status)) ? '' : 'reselect'
    this.verifyLandingpageIsError()
  },
  methods: {
    reselectLandingpage () {
      this.isErrorLandingPageShow = false
      this.adSelectorType = ''
    },
    async verifyLandingpageIsError () {
      const { landingPage, landingType, landingPageId } = this.form
      if (landingType === 1 || landingType === 2) {
        const script = document.createElement('script')
        script.src = getLandingpageByPageProtocol(landingPage)
        document.body.appendChild(script)
        script.addEventListener('error', e => {
          document.body.removeChild(script)
          this.isErrorLandingPageShow = true
          this.form.landingPage = ''
        })
        this.isSpecialLandingpage = this.specialLandingpage(this.form.landingPage)
      }

      // 验证百姓帖子已经归档
      if (landingType === LANDING_TYPE_AD && landingPageId) {
        const result = await queryAds({
          limitMvp: false,
          adId: landingPageId,
          limit: 1
        })
        const ad = result.ads && result.ads[0]
        if (ad && String(ad.adId) === String(landingPageId)) return
        this.isErrorLandingPageShow = true
        this.form.landingPage = ''
      }
    },
    onSelectAd (ad) {
      this.form.landingType = 0
      this.form.landingPageId = ad.adId
      this.form.landingPage = ad.url

      this.form.creativeTitle = ad.title && ad.title.slice(0, 24)
      this.form.creativeContent = ad.content && ad.content.slice(0, 39)
    },
    async goChargeKaSite () {
      await getQiqiaobanCoupon(this.$route.query.promoteId)
      setTimeout(() => {
        this.$router.push('/main/qwt/charge?select_gw=1')
      }, 300)
    },
    onQiqiaobanChange (v) {
      this.form.landingType = 1
      this.form.landingPage = v
      this.form.landingPageId = ''

      this.form.creativeTitle = ''
      this.form.creativeContent = ''
    },
    onSelectStore (url, id) {
      this.form.landingType = LANDING_TYPE_STORE
      this.form.landingPageId = id
      this.form.landingPage = url
    },
    handleCreativeError (message) {
      if (message) Message.error(message)
      this.creativeError = message
    },
    handleCreativeValueChange ({ title, content }) {
      this.form.creativeTitle = title
      this.form.creativeContent = content
    },
    onSubmit () {
      try {
        this.banLandPageSelected()
      } catch (e) {
        return
      }
      this.$refs.form.validate(async isValid => {
        if (isValid && !this.creativeError) {
          this.isLoading = true
          try {
            await updatePromote(this.form)
            Message.success('更新推广成功')
            this.$router.push({ name: 'bw-plan-list' })
          } finally {
            this.isLoading = false
          }
        } else if (isValid && this.creativeError) {
          Message.error(this.creativeError)
        }
      })
    },
    specialLandingpage (siteUrl) {
      return isQiqiaobanSite(siteUrl) || isWeishopSite(siteUrl)
    },
    banLandPageSelected () {
      // 落地页404，需要更改落地页投放
      if (this.isErrorLandingPageShow && !this.form.landingPage) {
        this.adSelectorType = ''
        const pageErrorPlaceholder = document.querySelector('.error-page-placeholder')
        pageErrorPlaceholder.style.borderColor = '#FF6350'
        throw this.$message.error('当前投放页面失效，请重新选择新的投放页面')
      }
      // 已经下线计划且当前落地页为老官网或微站 不允许修改投放计划
      if (this.isSpecialLandingpage && this.isPromoteOffline) {
        throw this.$message.error('当前计划已下线，不能更新推广计划')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  color: #666;
  border-bottom: 1px solid #e6e6e6;
  padding: 15px;
  font-size: 16px;
}
.reject-reason {
  color: #f44336;
}
div.bg {
  padding: 10px 10px 30px 10px;
  background-color: #f4f4f4;

  & > .white-bg {
    background-color: #fff;

    & > main {
      box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, 0.1);
      min-height: 700px;
      padding: 45px 60px;
    }
  }
}
.landing-page {
  margin: 20px auto;
}
.error-page-placeholder {
  border: 1px solid #eee;
  border-radius: 4px;
  height: 161px;
  width: 540px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #999;
  & > a {
    color: #ff4401;
    margin-left: 5px;
  }
}
.qiqiaoban-warning {
  margin-left: 20px;
  font-size: 13px;
  color: #ff4401;
}
</style>
