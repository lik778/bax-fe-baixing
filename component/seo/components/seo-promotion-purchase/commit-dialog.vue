<template>
    <el-dialog
          :title="isPreInfo?'提单确认':'您的套餐已确认，可直接去提单哦！'"
          :visible.sync="visible"
          width="50%"
          :before-close="cancel"
        >
        <p class="tip" v-if="isPreInfo">请确认订单信息，支付后将不能在更改</p>
        <PreInfoConfirm :allAreas="allAreas" :preInfo="preInfo" :skipAudit="skipAudit" :industry="industry"/>
        <div class="row-info total-price" v-if="isPreInfo">
            <p>客户手机号：{{preInfo.mobile}}</p>
            <p>客户id：{{preInfo.userBxId}}</p>
            <p>销售编号：{{preInfo.saleId}}</p>
        </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" :loading="isPending" @click="submit">{{isPreInfo?'确认，并生成提单链接':'去提单'}}</el-button>
          </span>
    </el-dialog>
</template>
<script>
import PreInfoConfirm from './pre-info-confim.vue'
export default {
  name: 'commit-dialog',
  components: {
    PreInfoConfirm
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      require: true
    },
    isPreInfo: {
      type: Boolean,
      default: false,
      require: true
    },
    allAreas: {
      type: Array,
      default: () => [],
      require: true
    },
    preInfo: {
      type: Object,
      default: () => {},
      require: true
    },
    isPending: {
      type: Boolean,
      default: false,
      require: true
    },
    skipAudit: {
      type: Boolean,
      default: true
    },
    industry: {
      type: String,
      default: '',
      require: true
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    submit () {
      if (this.isPreInfo) {
        this.$emit('preOrder')
      } else {
        this.$emit('submit')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    .tip{
      padding-bottom: 20px;
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
