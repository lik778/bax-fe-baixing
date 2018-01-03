
<template>
  <div class="edit">
    <div v-if="step === 1" class="center">
      <p>托管服务结束时间：xxx</p>
      <el-button type="primary" size="large" @click="step = 2">延长服务</el-button>
      <el-button type="danger" size="large" @click="step = 3">停止服务</el-button>
      <el-button size="large" @click="$emit('cancel')">取消</el-button>
    </div>
    <div v-if="step === 2">
      <el-form :model="model" label-width="150px" class="form">
        <el-form-item label="延迟托管服务时间">
          <el-radio-group v-model="model.duration">
            <el-radio-button :label="30">30天</el-radio-button>
            <el-radio-button :label="60">60天</el-radio-button>
            <el-radio-button :label="90">90天</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">确认</el-button>
          <el-button @click="step = 1">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="step === 3" class="center">
      <p>您的托管服务正在运行中，还有 xxx 天到期，您确定要停止服务吗？</p>
      <el-button type="primary">确认</el-button>
      <el-button @click="step = 1">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit',
  data() {
    return {
      step: 1,
      model: {
        duration: 30
      }
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
