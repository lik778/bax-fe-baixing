
<template>
  <div>
    <contract class="contract" />
    <hr>
    <el-form :model="model" :rules="rules" label-width="100px" ref="form">
      <el-form-item prop="category" label="行业">
        <el-radio-group v-model="model.category">
          <el-radio-button v-for="c in categories" :key="c.id" :label="c.id">{{c.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="expectedBudget" label="期望日预算">
        <el-radio-group v-model="model.expectedBudget">
          <el-radio-button v-for="c in expectedBudgetOpts" :key="c.value" :label="c.value">{{c.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="platform" label="投放平台">
        <el-checkbox-group v-model="model.platform">
          <el-checkbox v-for="c in semPlatformOpts" :key="c.value" :label="c.label"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="optType" label="优化内容">
        <el-checkbox-group v-model="model.optType">
          <el-checkbox v-for="c in optTypeOpts" :key="c.value" :label="c.label"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="confirm">
        <el-checkbox v-model="model.confirm">我已阅读并同意遵守<a>《百姓网托管协议》</a></el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">我要托管</el-button>
        <el-button @click="$emit('cancel')">我再想想</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Contract from './Contract'
import {expectedBudgetOpts, semPlatformOpts, optTypeOpts} from 'constant/fengming'

export default {
  props: {
    categories: Array
  },
  components: {
    Contract
  },
  data() {
    function truthValidator(rule, value, callback) {
      if (value !== true) {
        return callback(new Error('必须同意协议内容才能开启托管服务'))
      }
      callback()
    }
    return {
      model: {
        category: '',
        expectedBudget: '',
        platform: [],
        optType: [],
        confirm: false
      },
      rules: {
        category: [{ required: true, message: '请选择一个优化类目' }],
        expectedBudget: [{ required: true, message: '请选择期望预算' }],
        platform: [{ required: true, message: '请选择一个优化平台' }],
        optType: [{ required: true, message: '请选择一个优化内容' }],
        confirm: [{ validator: truthValidator }]
      },
      expectedBudgetOpts,
      semPlatformOpts,
      optTypeOpts
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$alert(
            '您的托管服务已经生效，稍后会有运营人员和您联系。本次服务有效期为 6 个月，取消和延期请到个人中心进行修改',
            '温馨提示',
            { confirmButtonText: '我知道了' }
          )
        }
      })
    }
  }
}
</script>

<style scoped>
.contract {
  height: 200px;
  width: 90%;
  margin: 0 auto;
}
hr {
  margin: 20px 0;
  border-top: 1px dashed #aaa;
}
a {
  color: #20a0ff;
}
</style>
