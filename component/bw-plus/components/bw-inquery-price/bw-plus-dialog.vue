<template>
   <el-dialog
    :visible.sync="BwPlusDialogMsg.dialogVisible"
    custom-class="bw-plus-dialog"
    width="30%"
    :show-close="false"
    @close="$emit('close')"
    >
    <template slot="title">
        <el-alert
            :title="BwPlusDialogMsg.title"
            :type="BwPlusDialogMsg.type"
            :closable="false"
            show-icon>
        </el-alert>
    </template>
    <div v-if="BwPlusDialogMsg.type === 'error'">
      <p v-for="(item, index) in BwPlusDialogMsg.content" :key="index">{{item.keyword}}-{{item.cities}}</p>
    </div>
    <div v-else><p>{{BwPlusDialogMsg.content}}</p></div>
    <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="$emit('close')">取 消</el-button>
        <router-link v-if="BwPlusDialogMsg.type === 'success'" to="/main/bw-plus/price-records"><el-button size="small" type="primary">查看审核进度</el-button></router-link>
        <el-button v-else size="small" @click="$emit('close')">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'bw-plus-dialog',
  props: {
    BwPlusDialogMsg: {
      type: Object,
      default: () => {},
      require: true
    }
  }
}
</script>
<style lang="scss" scoped>
    /deep/ .bw-plus-dialog{
      .el-alert{
        background: none;
        .el-alert__icon{
          font-size: 18px;
        }
        .el-alert__title{
          font-size: 16px;
        }
      }
      .el-dialog__body{
        padding-top: 0;
        p{
          font-size: 14px;
          color: #909399;
        }
      }
    }
</style>
