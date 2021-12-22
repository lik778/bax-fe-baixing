<template>
    <el-tooltip class="item" effect="dark" content="点击下载使用手册" placement="top-start">
        <a class="use-tips" target="_blank" href="http://file.baixing.net/bax-fe/static/product-use.pdf" download="产品使用手册">
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
    .use-tips{
        position: fixed;
        top: 100px;
        right: 60px;
        z-index: 999;
        display: block;
        color: #909399;
        font-size: 12px;
        &:hover{
            color: #409EFF;
            i{
               color: #409EFF;
            }
        }
        i{
            color: #909399;
        }
    }
</style>
