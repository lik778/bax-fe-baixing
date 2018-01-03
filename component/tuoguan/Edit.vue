
<template>
  <div class="edit">
    <div v-if="step === 1" class="center">
      <p>托管服务结束时间：{{expireAt}}</p>
      <el-button type="primary" size="large" @click="step = 2">延长服务</el-button>
      <el-button type="danger" size="large" @click="step = 3">停止服务</el-button>
      <el-button size="large" @click="close">取消</el-button>
    </div>
    <div v-if="step === 2">
      <el-form :model="model" label-width="150px" class="form">
        <el-form-item label="延迟托管服务时间">
          <el-radio-group v-model="model.days">
            <el-radio-button :label="30">30天</el-radio-button>
            <el-radio-button :label="60">60天</el-radio-button>
            <el-radio-button :label="90">90天</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onExtend">确认</el-button>
          <el-button @click="step = 1">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="step === 3" class="center">
      <p>您的托管服务正在运行中，还有 {{days}} 天到期，您确定要停止服务吗？</p>
      <el-button type="primary" @click="onStop">确认</el-button>
      <el-button @click="step = 1">取消</el-button>
    </div>
  </div>
</template>

<script>
import { extendTuoguan, stopTuoguan } from './action'
import { toHumanTime } from 'utils'

export default {
  name: 'edit',
  props: {
    expire: Number
  },
  data() {
    return {
      step: 1,
      model: {
        days: 30
      }
    }
  },
  computed: {
    expireAt() {
      return toHumanTime(new Date(this.expire * 1000), 'YYYY年MM月DD日')
    },
    days() {
      return Math.floor((this.expire - Date.now() / 1000) / 86400)
    }
  },
  methods: {
    close() {
      setTimeout(() => {
        this.step = 1
      }, 1000)
      this.$emit('cancel')
    },

    onExtend() {
      extendTuoguan(this.model).then(() => {
        this.close()
        this.$message.success('服务延期成功')
      })
    },

    onStop() {
      stopTuoguan().then(() => {
        this.close()
        this.$message.success('服务停止成功')
      })
    }
  }
}
</script>

<style scoped>
.center {
  text-align: center;
  & p {
    margin-bottom: 30px;
  }
}
.form {
  width: 400px;
  margin: 0 auto;
}
</style>
