<template>
  <div class="bw-plus-plan-list">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>管理推广</el-breadcrumb-item>
      <el-breadcrumb-item>推广计划</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="promotes" class="table">
      <el-table-column label="计划ID"></el-table-column>
      <el-table-column label="关键词"></el-table-column>
      <el-table-column label="平台"></el-table-column>
      <el-table-column label="审核状态"></el-table-column>
      <el-table-column label="投放状态"></el-table-column>
      <el-table-column label="投放城市"></el-table-column>
      <el-table-column label="推广时段"></el-table-column>
      <el-table-column label="服务时长"></el-table-column>
      <el-table-column label="投放剩余天数"></el-table-column>
      <el-table-column label="操作">
        <div>
          <el-button type="text">编辑创意</el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'bw-plus-plan-list',
  data () {
    return {
      promotes: []
    }
  }
}
</script>

<style lang='scss' scoped>
.bw-plus-plan-list {
  margin: 10px;
  background: #fff;
  padding: 0;
  > .breadcrumb {
    color: #666;
    border-bottom: 1px solid #e6e6e6;
    padding: 14px;
    font-size: 13px;
  }
  > .table {
    padding: 14px;
    margin-top: 20px;
  }
}
</style>
