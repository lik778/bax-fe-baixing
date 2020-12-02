<template>
  <section class="page qc-creative-page">
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

        <el-form-item label="核心产品" prop="coreWords">
          <span>{{form.coreWords.join(',')}}</span>
        </el-form-item>
        <el-form-item label="投放页面" prop="landingPageId">
          <!-- * 目前没有官网过期逻辑的判断，无此需求 -->
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
          <el-button type="primary" :loading="loading.form" @click="update">更新推广计划</el-button>
          <el-button @click="() => $router.go(-1)">返回上一页</el-button>
        </el-form-item>
      </el-form>
    </div>

  </section>
</template>

<script>
import dayjs from 'dayjs'

import { getRouteParam } from 'util'
import { QIANCI_LANDING_TYPE } from 'constant/qianci'
import { getUserSites } from 'api/ka'
import { getCreative, saveCreative } from 'api/qianci'

export default {
  name: 'creative-manage',
  data() {
    return {
      id: null,
      isFormEdited: false,
      form: {
        coreWords: [],
        landingPage: '',
        landingPageId: '',
        creativeTitle: '',
        creativeContent: '',
      },
      rules: {
        coreWords: [{ type: 'array', required: true, message: '哇核心产品都没有' }],
        landingPageId: [{ required: true, message: '请选择投放页面' }],
        creativeTitle: [
          { required: true, message: '请填写推广标题' },
          { validator: (rule, value, callback) => {
              if (value.length < 9 || value.length > 25) callback('推广标题长度需要在 9-25 之间')
              callback()
            },
            trigger: 'blur'
          }
        ],
        creativeContent: [
          { required: true, message: '请填写推广内容' },
          { validator: (rule, value, callback) => {
              if (value.length < 9 || value.length > 80) callback('推广内容长度需要在 9-80 之间')
              if (value === this.form.creativeTitle) callback('推广内容不能和推广标题相同')
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
      },
      loading: {
        form: false
      }
    }
  },
  watch: {
    form: {
      deep: true,
      immediate: false,
      handler () {
        this.isFormEdited = true
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
        coreWords,
        landingPage,
        creativeTitle,
        creativeContent,
      } = response || {}
      const targetSite = this.options.sites.find(site => (landingPage || '').includes(site.domain))

      this.form.coreWords = coreWords
      this.form.creativeTitle = creativeTitle
      this.form.creativeContent = creativeContent
      if (targetSite) {
        this.form.landingPageId = String(targetSite.id)
        this.form.landingPage = landingPage
      }
      this.$nextTick(() => (this.isFormEdited = false))
    },
    async initSites () {
      const sites = await getUserSites()
      this.options.sites = (sites || []).map(x => ({
        ...x,
        label: x.name,
        value: String(x.id)
      }))
    },
    async update () {
      // 调用编辑物料会走审核。如果表单没有任何变化，则不调用接口。
      if (!this.isFormEdited) {
        this.loading.form = true
        setTimeout(() => {
          this.loading.form = false
          this.$notify({
            type: 'success',
            message: '保存成功'
          })
        }, 1000)
        return null
      }
      this.$refs['query-form'].validate(async isValid => {
        if (isValid) {
          this.loading.form = true
          const query = {
            ...this.form,
            id: this.id,
            landingType: QIANCI_LANDING_TYPE,
          }
          try {
            const response = await saveCreative(query)
          } finally {
            setTimeout(() => (this.loading.form = false), 300)
          }
          this.isFormEdited = false
          this.$notify({
            type: 'success',
            message: '保存成功'
          })
        }
      })
    },
    onSelectSite(ids) {
      if (!ids) return null

      const id = ids.length && ids[0]
      this.form.landingPageId = String(id)
      const handle = this.options.sites.find(x => x.value == id)
      this.reGenURL(handle)
    },
    reGenURL(site) {
      this.form.landingPage = site
        ? 'http://' + site.domain + '.mvp.baixing.com'
        : ''
    }
  }
}
</script>

<style lang="scss" scoped>
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

<style lang="scss">
/* TODO 查找 Element 级联被样式污染原因 */
.el-cascader__dropdown {
  & .el-scrollbar__wrap {
    margin-bottom: 0 !important;
    overflow: hidden scroll;
  }
}
</style>
