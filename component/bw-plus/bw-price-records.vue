<template>
  <el-card class="bw-price-record">
    <BwRecordsForm @search="search"/>
    <BwRecordsTable @preOrder="preOrder" @reviewPrice="reviewPrice" :loading="loading" :records="records" :allAreas="allAreas"/>
    <el-dialog
      title="查看"
      :visible.sync="dialogVisible"
      width="65%"
      >
      <InqueryResult @getValue="getCurrentPrice" :tableData="activeRecord.priceList"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRecord">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :hide-on-single-page="true"
      :page-size="PAGEAIZE"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
import { getInqueryList, userChoose, preOrder } from 'api/biaowang-plus'
import { APPLY_AUDIT_STATUS_OPTIONS, APPLY_TYPE_NORMAL } from 'constant/bw-plus'
import { BwRecordsForm, BwRecordsTable, InqueryResult } from './components'
import { normalizeRoles } from 'util/role'
import { orderServiceHost } from 'config'
import pick from 'lodash.pick'
import { f2y } from 'util'
const PAGEAIZE = 10
export default {
  name: 'bw-plus-price-records',
  components: {
    BwRecordsForm,
    BwRecordsTable,
    InqueryResult
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    },
    userInfo: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  data () {
    return {
      loading: true,
      formInline: {
        id: '',
        status: ''
      },
      f2y,
      APPLY_TYPE_NORMAL,
      PAGEAIZE,
      APPLY_AUDIT_STATUS_OPTIONS,
      records: [],
      total: 0,
      currentPage: 0,
      dialogVisible: false,
      activeRecord: [],
      currentPrice: {},
      orderPayUrl: ''
    }
  },
  async mounted () {
    await this.getRecord()
  },
  methods: {
    isBxUser () {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('BAIXING_USER')
    },
    isBxSales () {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('BAIXING_SALES')
    },
    isAgentAccounting () {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('AGENT_ACCOUNTING')
    },
    handleSizeChange () {

    },
    async search (value) {
      this.currentPage = 0
      this.formInline = value
      await this.getRecord()
    },
    handleCurrentChange () {

    },
    async getRecord () {
      this.loading = true
      const { formInline, currentPage } = this
      const params = {
        ...formInline,
        size: PAGEAIZE,
        page: currentPage
      }
      try {
        const { data: { content } } = await getInqueryList(params)
        this.records = content
        this.loading = false
      } catch (error) {
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    reviewPrice (record) {
      this.activeRecord = record
      this.dialogVisible = true
    },
    async getCurrentPrice (value) {
      this.currentPrice = value
    },
    async updateRecord () {
      const { id } = this.activeRecord
      const { currentPrice } = this
      const params = {
        id,
        ...pick(currentPrice, ['device', 'scheduleType', 'duration', 'price'])
      }
      const { code } = await userChoose(params)
      if (code === 0) {
        this.$message({
          message: '恭喜你，操作成功，去提单吧！',
          type: 'success'
        })
        this.currentPage = 0
        this.getRecord()
      }
    },
    async preOrder (record) {
      const { id: applyId } = record
      const { code, data: { preTradeId } } = await preOrder({ applyId })
      if (this.isBxUser) {
        location.href = `${orderServiceHost}/?appId=105&seq=${preTradeId}`
      } else if (this.isAgentAccounting) {
        location.href = `${orderServiceHost}/?appId=105&seq=${preTradeId}&agentId=${this.userInfo.id}`
      } else if (this.isBxSales) {
        this.orderPayUrl = `${orderServiceHost}/?appId=105&seq=${preTradeId}`
      }
      console.log(preTradeId)
      if (code === 0) {
        await this.getRecord()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  .bw-price-record{
    height: 100%;
    background: #fff;
    margin: 10px;
  }
  // .label{
  //   display: inline-block;
  //   height: 100%;
  //   line-height: 100%;
  //   white-space: nowrap;
  //   display: flex;
  //   align-items: center;
  //   font-size: 14px;
  // }
  // .el-select{
  //   width: 100%;
  // }
  // .button-group{
  //   display: flex;
  // }
  // .el-row{
  //   margin-bottom: 30px;
  // }
</style>
