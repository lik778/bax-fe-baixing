<template>
  <div class="summary-container">
    <section-header>我的账户</section-header>
    <el-row type="flex" justify="space-around" align="space-between">
      <el-col :span="6">
        <div class="line">
          <p>推广资金余额</p>
          <p><strong>1020</strong>元</p>
          <el-button type="primary">充值</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="8">
            <p>今日消耗：87元</p>
            <p>今日预算：100元</p>
          </el-col>
          <el-col :span="8">
            <my-progress type="circle" :percentage="20" :width="80" :class="classes" />
          </el-col>
          <el-col :span="8">
            <div><el-button type="primary">推广管理</el-button></div>
            <div><el-button type="primary">新建推广</el-button></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import SectionHeader from 'com/common/section-header'
  import MyProgress from 'com/common/my-progress'

  export default {
    name: 'summary',
    components: {
      SectionHeader,
      MyProgress
    }
  }
</script>

<style scoped>
  .summary-container {

  }
  .line {
    border-right: 1px dotted #aaa;
  }
</style>
