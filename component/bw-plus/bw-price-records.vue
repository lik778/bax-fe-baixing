<template>
  <el-card class="bw-price-record">
    <BwRecordsForm @search="search"/>
    <BwRecordsTable @preOrder="getPreInfo" @reviewPrice="reviewPrice" :loading="loading" :records="records" :allAreas="allAreas"/>
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
      @current-change="handleCurrentChange"
      :current-page="currentPage + 1"
      :hide-on-single-page="true"
      :page-size="PAGESIZE"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
    <PreOrderDetail @preOrder="preOrder" @cancel="isPreInfo=false" :allAreas="allAreas" :dialogVisible="isPreInfo" :preInfo="preInfo"/>
  </el-card>
</template>

<script>
import { getInqueryList, userChoose, preOrder, preInfo } from 'api/biaowang-plus'
import { APPLY_AUDIT_STATUS_OPTIONS, APPLY_TYPE_NORMAL } from 'constant/bw-plus'
import { BwRecordsForm, BwRecordsTable, InqueryResult, PreOrderDetail } from './components'
import { normalizeRoles } from 'util/role'
import pick from 'lodash.pick'
import { f2y } from 'util'
import { Message } from 'element-ui'
const PAGESIZE = 10
export default {
  name: 'bw-plus-price-records',
  components: {
    BwRecordsForm,
    BwRecordsTable,
    InqueryResult,
    PreOrderDetail
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
      PAGESIZE,
      APPLY_AUDIT_STATUS_OPTIONS,
      records: [],
      total: 0,
      currentPage: 0,
      dialogVisible: false,
      activeRecord: {},
      currentPrice: {},
      orderPayUrl: '',
      isPreInfo: false,
      preInfo: {}
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
    async search (value) {
      this.currentPage = 0
      this.formInline = value
      await this.getRecord()
    },
    async handleCurrentChange (current) {
      this.currentPage = current - 1
      await this.getRecord()
    },
    async getRecord () {
      this.loading = true
      const { formInline, currentPage } = this
      const params = {
        ...formInline,
        size: PAGESIZE,
        page: currentPage
      }
      try {
        const { data: { content, totalElements } } = await getInqueryList(params)
        this.records = content
        this.total = totalElements
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
        this.dialogVisible = false
        this.$message({
          message: '恭喜你，操作成功，去提单吧！',
          type: 'success'
        })
        this.currentPage = 0
        this.getRecord()
      }
    },
    async preOrder () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { id: applyId } = this.activeRecord
      const { code, data: { url } } = await preOrder({ applyId })
      loading.close()
      if (code === 0) {
        this.$copyText(url).then(async (e) => {
          Message.success('提单链接已复制到剪切板')
          await this.getRecord()
        }, function (e) {
        })
      }
    },
    async getPreInfo (record) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { id: applyId } = record
      this.activeRecord = record
      this.isPreInfo = true
      const { data } = await preInfo({ applyId })
      loading.close()
      this.preInfo = data
    }
  }
}
</script>

<style lang='scss' scoped>
  .bw-price-record{
    min-height: 100%;
    background: #fff;
    margin: 10px;
    box-sizing: border-box;
  }
</style>
