<template>
  <el-tooltip
    class="item"
    effect="dark"
    content="点击下载使用手册"
    placement="top-start"
  >
    <a
      class="use-tips"
      target="_blank"
      href="https://file.baixing.net/bax-fe/asset/product-use-book-20220117.pdf"
      download="产品使用手册"
    >
      <i class="el-icon-question"></i>
      使用指引
    </a>
  </el-tooltip>
</template>

<script>
export default {
  name: 'use-tips'
}
</script>

<style lang="scss" scoped>
.use-tips {
  display: block;
  color: #909399;
  font-size: 12px;
  &:hover {
    color: #409eff;
    i {
      color: #409eff;
    }
  }
  i {
    color: #909399;
  }
}
</style>
