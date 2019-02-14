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
              <el-radio-group v-model="landingTypeDisplay" size="small">
                <el-radio-button v-for="option of landingTypeOpts" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="landing-page">
              <user-ad-selector :type="adSelectorType"
                v-if="landingTypeDisplay === 0"
                :all-areas="allAreas" :limit-mvp="false"
                :selected-id="form.landingPageId"
                @select-ad="onSelectAd"
              />

              <qiqiaoban-page-selector
                v-if="landingTypeDisplay === 1"
                :value="form.landingPage"
                @change="onQiqiaobanChange"
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
  import {getPromoteById, getPromtesByOrders, updatePromote} from 'api/biaowang'
  import {landingTypeOpts, SEM_PLATFORM_BAIDU} from 'constant/fengming'
  import {AUDIT_STATUS_REJECT, PROMOTE_STATUS_OFFLINE, PROMOTE_STATUS_INIT} from 'constant/biaowang'
  import {Message} from 'element-ui'
  import UserAdSelector from 'com/common/user-ad-selector'
  import CreativeEditor from 'com/widget/creative-editor'
  import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'

  export default {
    name: 'bw-edit-plan',
    props: {
      allAreas: Array
    },
    components: {
      UserAdSelector,
      CreativeEditor,
      QiqiaobanPageSelector
    },
    data() {
      return {
        SEM_PLATFORM_BAIDU,
        promotes: [],
        landingTypeDisplay: 0,
        form: {
          promoteIds: [],
          landingType: 0,
          landingPageId: '',
          landingPage: '',
          creativeTitle: '',
          creativeContent: '',
        },
        rules: {
          promoteIds: [{required: true, message: '请勾选关键词'}],
          landingPage: [{required: true, message: '请选择投放页面'}]
        },
        buttonText: '创建标王计划',

        landingTypeOpts,
        creativeError: '',
        isLoading: false,
        showNotice: false,
      }
    },
    computed: {
      adSelectorType() {
        const type = this.promotes.every(p => p.status === PROMOTE_STATUS_INIT) ? '' : 'reselect'
        return type
      },
      isPromoteRejected() {
        return this.promotes.some(p => AUDIT_STATUS_REJECT.includes(p.auditStatus))
      },
      rejectReason() {
        return this.promotes.map(p => p.auditRejectReason).join(',')
      },
      isPromoteOffline() {
        return this.promotes.some(p => PROMOTE_STATUS_OFFLINE.includes(p.status))
      }
    },
    async mounted() {
      const {promoteId, orderIds: orderIdsString, notice} = this.$route.query
      if (promoteId) {
        const onePromote = await getPromoteById(promoteId)
        this.promotes = [onePromote]
        const {landingType, landingPage, landingPageId, creativeTitle, creativeContent} = onePromote
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
        console.log(this.promotes)
        this.form.promoteIds = this.promotes.map(p => p.id)
        this.buttonText = '创建标王计划'
      }
      if (notice === 'true' || notice === '1') {
        this.showNotice = true
      }
    },
    methods: {
      onSelectAd(ad) {
        this.form.landingType = 0
        this.form.landingPageId = ad.adId
        this.form.landingPage = ad.url

        this.form.creativeTitle = ad.title && ad.title.slice(0, 24)
        this.form.creativeContent = ad.content && ad.content.slice(0, 39)
      },
      onQiqiaobanChange(v) {
        this.form.landingType = 1
        this.form.landingPage = v
        this.form.landingPageId = ''

        this.form.creativeTitle = ''
        this.form.creativeContent = ''
      },
      handleCreativeError(message) {
        if(message) Message.error(message)
        this.creativeError = message
      },
      handleCreativeValueChange({title, content}) {
        this.form.creativeTitle = title
        this.form.creativeContent = content
      },
      onSubmit() {
        this.$refs.form.validate(async isValid => {
          if (isValid && !this.creativeError) {
            this.isLoading = true
            try {
              await updatePromote(this.form)
              Message.success('更新推广成功')
              this.$router.push({name: 'bw-plan-list'})
            } finally {
              this.isLoading = false
            }
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="postcss" scoped>
header {
  color: #666;
  border-bottom: 1px solid #E6E6E6;
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
      box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, .1);
      min-height: 700px;
      padding: 45px 60px;
    }
  }
}
.landing-page {
  margin: 20px auto;
}
</style>
