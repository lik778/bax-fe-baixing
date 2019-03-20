<template>
  <div class="loading-placeholder">
    <slot name="header"></slot>
    <div class="loading-content">
      <i class="el-icon-loading" /><slot name="default">正在获取数据</slot>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.loading-content {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  font-size: 16px;
  height: 100%;
  letter-spacing: 1px;
  & .el-icon-loading {
    font-size: 20px;
    margin-right: 5px;
  }
}
</style>
