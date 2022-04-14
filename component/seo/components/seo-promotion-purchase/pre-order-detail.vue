<template>
    <el-dialog
    title="提单确认"
    :visible.sync="dialogVisible"
    width="50%"
    @close="cancel"
    >
    <p class="tip">请确认订单信息，支付后将不能在更改</p>
    <PreInfoConfirm :allAreas="allAreas" :preInfo="preInfo" :confirm="confirm"/>
    <div class="row-info total-price">
        <p>客户手机号：{{preInfo.mobile}}</p>
        <p>客户id：{{preInfo.userBxId}}</p>
        <p>销售编号：{{preInfo.saleId}}</p>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="preOrder">确认，生成并复制提单链接</el-button>
    </span>
    </el-dialog>
</template>
<script>
import PreInfoConfirm from './pre-info-confim.vue'
export default {
  name: 'pre-order-detail',
  components: {
    PreInfoConfirm
  },
  data () {
    return {
      confirm: true
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
      require: true
    },
    preInfo: {
      type: Object,
      default: () => {},
      require: true
    },
    allAreas: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    preOrder () {
      this.$emit('preOrder')
      console.log('确认，生成并复制提单链接')
    }
  }

}
</script>
<style lang="scss" scoped>
    .tip{
      padding-bottom: 20px;
    }
    .pre-info-item{
        margin-bottom: 0;
        font-size: 16px;
        font-weight: 500;
    }
    .pre-info-row{
        border-top: 1px solid #ddd;
        padding: 6px 0;
        margin-top: 10px;
        font-size: 16px;
        font-weight: 500;
    }
    .pre-info-price{
        color: crimson;
    }
    .total-price{
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      margin-bottom: 0;
      position: relative;
      padding: 12px 0;
      p{
        margin-left: 10px;
      }
      &::after{
        width: 100%;
        content: '';
        height: 1px;
        background: #ECECEC;
        left: 0;
        bottom: 0;
        position: absolute;
      }
    }
</style>
