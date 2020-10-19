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
          <span>{{keyword}}</span>
        </el-form-item>
        <el-form-item label="投放页面">
          <el-cascader
            v-model="input.site"
            clearable
            :options="options.sites"
            @change="onSelectSite"
          />
          <el-input
            v-if="active.site"
            class="payment-url-input"
            v-model="form.url"
            readonly
            clearable
          />
          <p class="warning" v-if="visible.siteExpireWarning">
            站点{{'xxx'}}天内将过期，
            请选择其他站点，或<router-link :to="{name: 'seo-charge'}">购买</router-link>新官网
          </p>
          <p class="warning" v-if="visible.siteExistWebsite">该站点已创建首页宝加速词包计划，请更换</p>
        </el-form-item>

        <el-form-item><span class="header">推广物料设置</span></el-form-item>

        <el-form-item label="投放标题">
          <el-input
            v-model="form.title"
            placeholder="请填写投放标题"
            clearable
          />
        </el-form-item>
        <el-form-item label="推广内容">
          <el-input
            type="textarea"
            v-model="form.content"
            placeholder="请填写推广内容"
            clearable
            :autosize="{minRows: 5, maxRows: 8}"
          />
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" @click="create">{{id ? '保存' : '创建'}}推广计划</el-button>
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
      keyword: '',
      form: {
        title: '',
        url: '',
        content: '',
      },
      input: {
        site: null,
      },
      rules: {},
      options: {
        sites: []
      },
      active: {
        site: null,
      },
      visible: {
        siteExpireWarning: false,
        siteExistWebsite: false
      }
    }
  },
  created() {
    this.id = getRouteParam.bind(this)('id')
    this.initKeyword()
    this.initSites()
  },
  methods: {
    async initKeyword () {
      const response = await getCreative({ id: this.id })
      const { keyword } = response || {}
      this.keyword = keyword
      this.reGenURL()
    },
    async initSites () {
      const sites = await getUserSites()
      this.options.sites = (sites || []).map(x => ({
        label: x.name,
        value: x.id,
        raw: x
      }))
    },
    async create () {
      if (!this.form.title) this.$message({ type: 'error', message: '请填写投放标题' })
      if (!this.form.content) this.$message({ type: 'error', message: '请填写推广内容' })

      const response = await saveCreative({ ...this.form })
      this.$notify({
        type: 'success',
        message: this.id ? '保存成功' : '创建成功',
      })
    },
    onSelectSite(ids) {
      const id = ids.length && ids[0]
      const handle = this.options.sites.find(x => x.value == id)
      // this.visible.showExpireWarning = dayjs(handle.expireAt).subtract(this.promotion.duration, 'day').isBefore(dayjs(), 'day')
      // this.visible.showExistWebsite = this.existPromotionWebsite.some(o => (o.trim() === landingPage))
      this.active.site = handle
      this.input.site = ids
      this.reGenURL()
    },
    reGenURL() {
      this.form.url = 'http://' + this.active.site.raw.domain + '.mvp.baixing.com'
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
