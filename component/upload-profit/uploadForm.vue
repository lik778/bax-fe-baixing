<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="所属产品" prop="product">
      <el-select v-model="form.product" placeholder="请选择产品">
        <el-option label="APP广告" value="APP广告"></el-option>
        <el-option label="拼框" value="拼框"></el-option>
        <el-option label="大客户" value="大客户"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属日期"  prop="uploadDate">
      <el-col :span="11">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.uploadDate" :picker-options="dateOption"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="客户名称" prop="client">
      <el-input type="text" v-model="form.client" placeholder="客户名字或ID"></el-input>
    </el-form-item>
    <el-form-item label="收入" prop="income">
      <el-input type="number" v-model.number="form.income" min=0></el-input>
    </el-form-item>
    <el-form-item label="利润" prop="profit">
      <el-input v-model.number="form.profit" min=0></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('form')">立即上传</el-button>
      <el-button @click="resetForm('form')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { saveUpload } from './action'
  import moment from 'moment'

  export default {
    name: 'upload-form',
    data() {
      return {
        form: {
          product: '',
          uploadDate: new Date(),
          client: '',
          income: '',
          profit: ''
        },
        rules: {
          product: { required: true, message: '请选择一个产品', trigger: 'change' },
          uploadDate:   { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
          income: [{ required: true, message: '收入不能为空' }, { type: 'number', message: '收入必须为数字值' }],
          profit: [{ required: true, message: '收入不能为空' }, { type: 'number', message: '收入必须为数字值' }],
        },
        dateOption: {
          disabledDate(time) {
            // 前天、昨天、今天
            return time.getTime() < Date.now() - 3*8.64e7 || time.getTime() > Date.now();
          }
        }
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.form.income < this.form.profit) {
              return this.$message.warning('利润超过收入。。')
            }
            let data = JSON.parse(JSON.stringify(this.form))
            data.uploadDate = +moment(this.form.uploadDate).format('YYYYMMDD')
            saveUpload(data).then(() => {
              this.$message.success('上传成功')
              this.resetForm('form')
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
