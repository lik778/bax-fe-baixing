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
            <div class="landing-type">
              <el-radio-group v-model="form.landingType" @change="clearLandingPage" size="small">
                <el-radio-button v-for="option of landingTypeOpts" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="landing-page">
              <user-ad-selector
                v-if="form.landingType === LANDING_TYPE_AD"
                :all-areas="allAreas"
                :limit-mvp="false"
                :selected-id="form.landingPageId"
                @select-ad="onSelectAd"
                @valid-change="isValid => setLandingPageValidity(LANDING_TYPE_AD, isValid)"
              />
              <mvip-selector
                v-if="form.landingType === LANDING_TYPE_STORE"
                :initValue="form.landingPageId"
                @change="onSelectStore"
                @valid-change="isValid => setLandingPageValidity(LANDING_TYPE_STORE, isValid)"
              />
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
import { getPromoteById, getPromtesByOrders, updatePromote } from 'api/biaowang'
import { landingTypeOpts, SEM_PLATFORM_BAIDU, LANDING_TYPE_AD, LANDING_TYPE_STORE, LANDING_TYPE_GW, LANDING_TYPE_WESHOP } from 'constant/fengming'
import {
  AUDIT_STATUS_REJECT,
  PROMOTE_STATUS_OFFLINE
} from 'constant/biaowang'
import { Message } from 'element-ui'
import UserAdSelector from 'com/common/ad-selector'
import CreativeEditor from 'com/widget/creative-editor'
import MvipSelector from 'com/common/mvip-selector'

export default {
  name: 'bw-edit-plan',
  props: {
    allAreas: Array
  },
  components: {
    UserAdSelector,
    CreativeEditor,
    MvipSelector
  },
  data () {
    return {
      SEM_PLATFORM_BAIDU,
      LANDING_TYPE_AD,
      LANDING_TYPE_STORE,
      promotes: [],
      isErrorLandingPageShow: false,
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
        landingPage: [{ required: true, message: '请选择投放页面', trigger: 'blur' }]
      },
      buttonText: '创建标王计划',
      landingTypeOpts,

      creativeError: '',
      isLoading: false,
      showNotice: false
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
        landingType: landingType,
        landingPage,
        creativeTitle: creativeTitle || '',
        creativeContent: creativeContent || '',
        landingPageId: landingPageId || ''
      }

      // TIP: 2021-06-16 谢丽珍 下线官网落地页渠道，原有的计划选择官网重新选择落地页
      if (landingType === LANDING_TYPE_GW || landingType === LANDING_TYPE_WESHOP) {
        this.form.landingType = LANDING_TYPE_AD
        this.form.landingPage = ''
        this.form.landingPageId = ''
      }
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
  },
  methods: {
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
    setLandingPageValidity (type, isValid) {
      this.isErrorLandingPageShow = !isValid
      if (!isValid) {
        this.form.landingType = type
        this.clearLandingPage()
      }
    },
    clearLandingPage () {
      this.form.landingPage = ''
      this.form.landingPageId = ''
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
    banLandPageSelected () {
      // 落地页404，需要更改落地页投放
      if (this.isErrorLandingPageShow && !this.form.landingPage) {
        throw this.$message.error('当前投放页面失效，请重新选择新的投放页面')
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
