<template>
    <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
      <el-form-item label="关键词：" prop="keyword">
        <el-input v-model="formInline.keyword" placeholder="关键词：" clearable></el-input>
      </el-form-item>
      <el-form-item label="ID：" prop="id">
        <el-input v-model="formInline.id" placeholder="ID：" clearable></el-input>
      </el-form-item>
      <el-form-item label="销售名称：" prop="salesName">
        <el-input v-model="formInline.salesName" placeholder="销售名称：" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select clearable size="medium" v-model="formInline.status" placeholder="请选择">
          <el-option
            v-for="item in Object.keys(APPLY_AUDIT_STATUS_OPTIONS_FILTER)"
            :key="item"
            :label="APPLY_AUDIT_STATUS_OPTIONS_FILTER[item]"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="primary" size="small" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
</template>
<script>
import { APPLY_AUDIT_STATUS_OPTIONS_FILTER } from 'constant/bw-plus'
export default {
  name: 'bw-records-form',
  data () {
    return {
      APPLY_AUDIT_STATUS_OPTIONS_FILTER,
      formInline: {
        keyword: '',
        status: '',
        id: ''
      }
    }
  },
  methods: {
    search () {
      this.$emit('search', this.formInline)
    },
    reset () {
      this.$refs.formInline.resetFields()
    }
  }
}
</script>
