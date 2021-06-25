<template>
   <el-dialog
    custom-class="success-dialog"
    :visible.sync="success"
    width="30%"
    :show-close="false">
    <template slot="title">
        <el-alert
            title="提交成功"
            type="success"
            show-icon>
        </el-alert>
    </template>
    <p>审核预计1-3个工作日，去查看审核进度</p>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary">查看审核进度</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'success-dialog',
  props: {
    success: {
      type: Boolean,
      default: false,
      require: true
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.success-dialog{
    & .el-alert__title{
        font-size: 16px;
    }
    & .el-dialog__header{
       & .el-alert{
            background: none;
        }
    }
    & .el-dialog__body{
        padding: 10px !important;
    }
}
</style>
