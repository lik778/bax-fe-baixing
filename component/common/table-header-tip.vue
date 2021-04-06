<template>
  <div class="header-tip" :class="[wrapClass]" :style="wrapStyle">
    <div v-html="labelHtml" />
    <el-tooltip :effect="effect" :placement="placement">
      <div slot="content" v-html="tipHtml" />
      <i class="el-icon-question" />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'header-tip',
  props: {
    wrapStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    wrapClass: {
      type: String,
      default: ''
    },
    labelHtml: {
      type: String,
      default: ''
    },
    effect: {
      type: String,
      default: 'dark'
    },
    placement: {
      type: String,
      default: 'top'
    },
    tipHtml: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.header-tip {
  display: flex;
  align-items: center;
  .el-icon-question {
    margin-left: 5px;
    font-size: 12px;
    color: #97a8be;
    cursor: help;
  }
}
</style>
