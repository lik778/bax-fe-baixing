<template>
  <div class="bx-ad-list">
    <el-table :data="ads" border
    style="width: 490px">
      <el-table-column
        label="选择"
        width="50">
      </el-table-column>
      <el-table-column
        label="帖子标题"
        width="310">
      </el-table-column>
      <el-table-column
        label="城市"
        width="70">
      </el-table-column>
      <el-table-column
        label="操作"
        width="60">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'mvp-campaign-ad-list',
  data() {
    return {
      ads: []
    }
  }
}
</script>

<style>
.bx-ad-list {
  & .el-table__header-wrapper {
    background-color: #f7f7f7;
  }
}
</style>
