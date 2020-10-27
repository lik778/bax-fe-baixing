<template>
  <section class="page">
    <header>投放内容</header>

    <div class="form-wrapper">
      <el-form
        :model="form"
        :rules="rules"
        ref="query-form"
        label-width="120px"
        label-position="left"
        class="form"
        @submit.native.prevent>

        <el-form-item><span class="header">基本信息</span></el-form-item>

        <el-form-item label="推广关键字" prop="coreWord">
          <span>{{form.coreWord}}</span>
        </el-form-item>
        <el-form-item label="投放页面" prop="landingPageId">
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

        <el-form-item label="投放标题" prop="creativeTitle">
          <el-input
            v-model="form.creativeTitle"
            placeholder="请填写投放标题"
            clearable
          />
        </el-form-item>
        <el-form-item label="推广内容" prop="creativeContent">
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
          <el-button @click="() => $router.go(-1)">返回管理推广列表</el-button>
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
      form: {
        coreWord: '',
        landingPage: '',
        landingPageId: null,
        creativeTitle: '',
        creativeContent: '',
      },
      rules: {
        coreWord: [{ required: true, message: '哇推广关键字都没有' }],
        landingPageId: [{ required: true, message: '请选择投放页面' }],
        creativeTitle: [
          { required: true, message: '请填写推广标题' },
          { validator: (rule, value, callback) => {
              if (!/^[\u4E00-\u9FA5A-Za-z0-9]{9,25}$/.test(value)) callback('推广标题不能含有特殊字符，长度在 9-25 之间')
              callback()
            },
            trigger: 'blur'
          }
        ],
        creativeContent: [
          { required: true, message: '请填写推广内容' },
          { validator: (rule, value, callback) => {
              if (!/^[\u4E00-\u9FA5A-Za-z0-9]{9,80}$/.test(value)) callback('推广标题不能含有特殊字符，长度在 9-80 之间')
              callback()
            },
            trigger: 'blur'
          }
        ],
      },
      options: {
        sites: []
      },
      visible: {
        siteExpireWarning: false,
        siteExistWebsite: false
      }
    }
  },
  async created() {
    this.id = getRouteParam.bind(this)('promoteId')
    if (!this.id) {
      throw new Error('No ID on qc-creative page.')
    } else {
      await this.initSites()
      this.initCreative()
    }
  },
  methods: {
    async initCreative () {
      const response = await getCreative({ id: this.id })
      const {
        coreWord,
        landingPage,
        creativeTitle,
        creativeContent,
      } = response || {}
      this.form = {
        coreWord,
        landingPage,
        creativeTitle,
        creativeContent
      }
      this.form.landingPageId = this.options.sites.find(site => (
        landingPage === 'http://' + site.domain + '.mvp.baixing.com'
      )).id
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
      this.$refs['query-form'].validate(async isValid => {
        if (isValid) {
          const query = {
            id: this.id,
            landingType: 3,
            ...this.form,
          }
          console.log('query: ', query)
          const response = await saveCreative(query)
          this.$notify({
            type: 'success',
            message: '保存成功'
          })
        }
      })
    },
    onSelectSite(ids) {
      const id = ids.length && ids[0]
      this.form.landingPageId = id
      const handle = this.options.sites.find(x => x.value == id)
      this.reGenURL(handle)

      // this.visible.showExpireWarning = dayjs(handle.expireAt).subtract(this.promotion.duration, 'day').isBefore(dayjs(), 'day')
      // this.visible.showExistWebsite = this.existPromotionWebsite.some(o => (o.trim() === landingPage))
    },
    reGenURL(site) {
      this.form.landingPage = site
        ? 'http://' + site.domain + '.mvp.baixing.com'
        : ''
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
  color: #444;
}
.payment-url-input {
  margin-top: 16px;
}
</style>
