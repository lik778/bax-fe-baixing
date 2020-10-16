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
          <span>{{form.url}}</span>
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
import { getRouteParam } from 'util'

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
      rules: {

      }
    }
  },
  created() {
    this.id = getRouteParam.bind(this)('id')
    this.init()
  },
  methods: {
    // 初始化页面数据
    async init () {
      const response = await getCreative({ id: this.id })
      const { keyword } = response || {}

      this.keyword = keyword
      this.reGenURL()
    },
    // 创建供应商
    async create () {
      if (!this.form.title) this.$message({ type: 'error', message: '请填写投放标题' })
      if (!this.form.content) this.$message({ type: 'error', message: '请填写推广内容' })

      const response = await saveCreative({ ...this.form })
      this.$notify({
        type: 'success',
        message: this.id ? '保存成功' : '创建成功',
      })
    },

    reGenURL() {
      this.form.url = 'http://www.baidu.com'
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
</style>
