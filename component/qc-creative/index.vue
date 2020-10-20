<template>
  <section class="page">
    <header>我的推广计划</header>

    <div class="form-wrapper">
      <el-form
        :model="form"
        :rules="rules"
        label-width="120px"
        ref="form"
        label-position="left"
        class="form"
        @submit.native.prevent>

        <el-form-item><span class="header">基本信息</span></el-form-item>

        <el-form-item label="推广关键字">
          <span>{{coreWord}}</span>
        </el-form-item>
        <el-form-item label="投放页面">
          <el-cascader
            v-model="form.landingPageId"
            clearable
            :options="options.sites"
            @change="onSelectSite"
          />
          <el-input
            v-if="form.landingPageId"
            class="payment-url-input"
            v-model="form.landingPage"
            readonly
            clearable
          />
          <p class="form-warning" v-if="visible.siteExpireWarning">
            站点{{'xxx'}}天内将过期，
            请选择其他站点，或<router-link :to="{name: 'seo-charge'}">购买</router-link>新官网
          </p>
          <p class="form-warning" v-if="visible.siteExistWebsite">该站点已创建首页宝加速词包计划，请更换</p>
        </el-form-item>

        <el-form-item><span class="header">推广物料设置</span></el-form-item>

        <el-form-item label="投放标题">
          <el-input
            v-model="form.creativeTitle"
            placeholder="请填写投放标题"
            clearable
          />
        </el-form-item>
        <el-form-item label="推广内容">
          <el-input
            type="textarea"
            v-model="form.creativeContent"
            placeholder="请填写推广内容"
            clearable
            :autosize="{minRows: 5, maxRows: 8}"
          />
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" @click="update">保存推广计划</el-button>
          <el-button type="warn" @click="() => $router.go(-1)">返回上一页</el-button>
        </el-form-item>
      </el-form>
    </div>

  </section>
</template>

<script>
import dayjs from 'dayjs'

import { getRouteParam } from 'util'

import { getUserSites } from 'api/ka'
import { getCreative, saveCreative } from 'api/qianci'

export default {
  name: 'creative-manage',
  data() {
    return {
      id: null,
      coreWord: '',
      form: {
        landingPage: '',
        landingPageId: null,
        creativeTitle: '',
        creativeContent: '',
      },
      rules: {},
      options: {
        sites: []
      },
      visible: {
        siteExpireWarning: false,
        siteExistWebsite: false
      }
    }
  },
  created() {
    this.id = getRouteParam.bind(this)('id')
    this.initCreative()
    this.initSites()
  },
  methods: {
    async initCreative () {
      const response = await getCreative({ id: this.id })
      const {
        coreWord,
        landingPage,
        landingPageId,
        creativeTitle,
        creativeContent,
      } = response || {}
      this.coreWord = coreWord
      this.form = {
        landingPage,
        creativeTitle,
        creativeContent,
        landingPageId: String(landingPageId),
      }
    },
    async initSites () {
      const sites = await getUserSites()
      this.options.sites = (sites || []).map(x => ({
        ...x,
        label: x.name,
        value: x.id
      }))
    },
    async update () {
      if (!this.form.landingPageId) this.$message({ type: 'error', message: '请选择推广官网' })
      if (!this.form.creativeTitle) this.$message({ type: 'error', message: '请填写投放标题' })
      if (!this.form.creativeContent) this.$message({ type: 'error', message: '请填写推广内容' })

      const query = {
        ...this.form,
        landingType: 3
      }
      const response = await saveCreative(query)
      this.$notify({
        type: 'success',
        message: '保存成功'
      })
    },
    onSelectSite(ids) {
      const id = ids.length && ids[0]
      this.form.landingPageId = id
      const handle = this.options.sites.find(x => x.value == id)
      this.reGenURL(handle.domain)

      // this.visible.showExpireWarning = dayjs(handle.expireAt).subtract(this.promotion.duration, 'day').isBefore(dayjs(), 'day')
      // this.visible.showExistWebsite = this.existPromotionWebsite.some(o => (o.trim() === landingPage))
    },
    reGenURL(domain) {
      this.form.landingPage = 'http://' + domain + '.mvp.baixing.com'
    }
  }
}
</script>

<style lang="postcss" scoped>
.form-wrapper {
  margin-top: 36px;
  padding-left: 20px;
  width: 700px;
}
.header {
  margin-left: -120px;
  font-weight: bold;
}
.payment-url-input {
  margin-top: 16px;
}
</style>
