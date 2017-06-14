
<template>
  <main class="qwt-promotion-list">
    <el-table :data="data" style="width: 1140px">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="open" label="开关" width="80">
        <template>
          <el-switch :value="true" on-text="" off-text="" />
        </template>
      </el-table-column>
      <el-table-column prop="a1" label="计划/创意" width="160" />
      <el-table-column prop="status" label="状态" width="140" />
      <el-table-column prop="money" label="预算" width="100" />
      <el-table-column prop="percent" label="移动端出价比例(0.1-50)" width="120" />
      <el-table-column prop="start" label="开始日期" width="120" />
      <el-table-column prop="end" label="结束日期" width="120" />
      <el-table-column prop="consume" label="今日消耗" width="80" />
      <el-table-column prop="channel" label="渠道" width="100" />
      <el-table-column prop="operate" label="操作" width="80" />
    </el-table>
  </main>
</template>

<script>
  export default {
    name: 'qwt-promotion-list',
    data() {
      return {
        data: [{}]
      }
    }
  }
</script>

<style scoped>

.qwt-promotion-list {
  margin-top: 16px;
}

</style>
