<template>
    <el-dialog
    title="提单确认"
    :visible.sync="dialogVisible"
    width="50%"
    @close="cancel"
    >
    <PreInfoConfirm :isRenew="isRenew" :preInfo="preInfo" :allAreas="allAreas"/>
    <div class="row-info total-price">
<!--      <BwDescriptionItem label="客户手机号：" :value="preInfo.customerMobile"/>-->
      <BwDescriptionItem label="销售编号：" :value="preInfo.saleId"/>
      <BwDescriptionItem label="客户uid：" :value="preInfo.customerId"/>
    </div>
    <BwDescriptionItem label="客户信息：" :value="preInfo.customerDesc"/>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="isYbsAccounting()" type="primary" @click="preOrder">确认提单</el-button>
        <el-button v-if="isYbsSales()" type="primary" @click="updateRenewSku">修改商品</el-button>
    </span>
    </el-dialog>
</template>
<script>
import PreInfoConfirm from './pre-info-confirm.vue'
import BwDescriptionItem from './bw-description-item.vue'
import { normalizeRoles } from 'util/role'
export default {
  name: 'pre-order-detail',
  components: {
    PreInfoConfirm,
    BwDescriptionItem
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
      require: true
    },
    userInfo: {
      type: Object,
      default: () => {},
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
    },
    isRenew: {
      type: Boolean,
      default: false,
      require: false
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    isYbsSales () {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('YBS_SALES')
    },
    isYbsAccounting () {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('YBS_ACCOUNTING')
    },
    preOrder () {
      this.$confirm('请确认客户已付款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('preOrder')
      }).catch(() => {
      })
    },
    updateRenewSku () {
      this.$router.push({ name: 'renew-upgrade', query: { packageId: this.preInfo.packageId } })
    }
  }
}
</script>
<style lang="scss" scoped>
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
      margin-bottom: 20px;
      position: relative;
      padding: 12px 0;
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
