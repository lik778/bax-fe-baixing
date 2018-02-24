<template>
  <div class="user-ad-selector">
    <el-input size="small" suffix-icon="el-icon-search"
      style="width: 240px; margin-bottom: 14px;"
      placeholder="请输入帖子标题进行搜索"></el-input>
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
  name: 'mvp-user-ad-selector',
  data() {
    return {
      ads: []
    }
  }
}
</script>

<style>
.user-ad-selector {
  & .el-table__header-wrapper {
    background-color: #f7f7f7;
  }
}
</style>
