<template>
  <div>
    <form :model="form">
      <el-form-item label="推广关键词">
        <el-checkbox-group v-model="form.promotes">
          <el-checkbox v-for="(promote, index) in promotes" :key="index">{{promote.word}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="投放页面">
        <div class="landing-type">
          <el-radio-group v-model="form.landingType" size="small">
            <el-radio-button v-for="option of landingTypeOpts" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="landing-page">
          <user-ad-selector :type="adSelectorType"
            v-if="form.landingType === 0"
            :all-areas="allAreas" :limit-mvp="false"
            :selected-id="form.landingPageId"
            @select-ad="ad => onSelectAd(ad)"
          />

          <qiqiaoban-page-selector
            v-if="form.landingType === 1"
            :value="form.landingPage"
            @change="setLandingPage"
          />
        </div>
      </el-form-item>
      <h3>投放物料设置</h3>
      <creative-editor
        :platforms="[SEM_PLATFORM_BAIDU]"
        :title="form.creativeTitle"
        :content="form.creativeContent"
        @change="handleCreativeValueChange"
        @error="handleCreativeError"
      />
      <el-form-item>
        <el-button @click="onSubmit">创建标王计划</el-button>
      </el-form-item>
    </form>
  </div>
</template>

<script>
  import store from './store'
  // import {getPromteById, getPromtesByOrders, updatePromote} from 'api/bw'
  import {landingTypeOpts, SEM_PLATFORM_BAIDU} from 'constant/fengming'
  import {Message} from 'element-ui'

  export default {
    name: 'bw-edit-plan',
    props: {
      allAreas: Object
    },
    data() {
      return {
        promotes: [],
        form: {
          promotes: [],
          landingType: 0,
          landingPageId: '',
          landingPage: '',
          creativeTitle: '',
          creativeContent: '',
        },

        landingTypeOpts,
        creativeError: ''
      }
    },
    computed: {
      adSelectorType() {
        return this.$route.query.promoteId ? 'reselect' : ''
      },
    },
    async mounted() {
      const {orderId, promoteId} = this.$route.query
      if (promoteId) {
        this.promotes = [await getPromteById(promoteId) ]
      }
      if (orderId) {
        this.promotes = await getPromtesByOrders
      }
    },
    methods: {
      onSelectAd(ad) {
        this.form.landingPageId = ad.adId
        this.form.landingPage = ad.url

        this.form.creativeTitle = ad.title && ad.title.slice(0, 24)
        this.form.creativeContent = ad.content && ad.content.slice(0, 39)
      },
      handleCreativeError(message) {
        if(message) Message.error(message)
        this.creativeError = message
      },
      handleCreativeValueChange({title, content}) {
        this.newPromotion.creativeTitle = title
        this.newPromotion.creativeContent = content
      },
      onSubmit() {

      }
    }
  }
</script>

<style lang="postcss" scoped>

</style>
