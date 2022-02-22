<template>
  <div class="seo-word-records">
    <el-card class="bw-price-record">
      <SeoRecordsForm @search="search"/>
      <SeoRecordsTable @getDetail="getDetail" @doCopy="preOrder" @preOrder="getPreInfo" :loading="loading" :records="records" :allAreas="allAreas"/>
      <el-dialog
        title="查看"
        :visible.sync="dialogVisible"
        width="65%"
        >
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button :disabled="notAllowUpdate" type="primary" @click="updateRecord">确 定</el-button>
        </span>
      </el-dialog>
      <el-pagination
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
        :current-page="currentPage + 1"
        :page-size="PAGESIZE"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
      <PreOrderDetail :loading="loading" @preOrder="preOrder" @cancel="checkPriceCancel" :allAreas="allAreas" :dialogVisible="isPreInfo" :preInfo="preInfo"/>
      <el-dialog
      title="查价详情"
      :visible="detailVisible"
      @close="detailVisible=false">
          <PreInfoConfirm :preInfo="queryPriceDetail" :allAreas="allAreas"/>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getuserList, getPreInfo, getPreOrder } from 'api/biaowang-plus'
import { APPLY_AUDIT_STATUS_OPTIONS, APPLY_TYPE_NORMAL } from 'constant/bw-plus'
import PreInfoConfirm from './components/seo-promotion-purchase/pre-info-confim.vue'
import PreOrderDetail from './components/seo-promotion-purchase/pre-order-detail.vue'
import SeoRecordsForm from './components/seo-promotion-purchase/seo-records-form.vue'
import SeoRecordsTable from './components/seo-promotion-purchase/seo-records-table.vue'
import { f2y } from 'util'
import { Message } from 'element-ui'
const PAGESIZE = 10
export default {
  name: 'seo-word-records',
  components: {
    SeoRecordsForm,
    SeoRecordsTable,
    // InqueryResult,
    PreOrderDetail,
    PreInfoConfirm
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
    },
    salesInfo: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  computed: {
    notAllowUpdate () {
      return !this.currentPrice.price
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
      preInfo: {},
      deviceAvailableStatus: {},
      queryPriceDetail: {},
      detailVisible: false,
      applyId: null
    }
  },
  async mounted () {
    const { query: { skipAudit, applyId } } = this.$route
    await this.getRecord()
    if (skipAudit) {
      await this.getPreInfo({ id: applyId })
      this.isPreInfo = true
    }
  },
  methods: {
    getDetail (row) {
      this.queryPriceDetail = row
      this.detailVisible = true
    },
    checkPriceCancel () {
      this.isPreInfo = false
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
        const { data: { content, totalElements } } = await getuserList(params)
        this.records = content
        this.total = totalElements
        this.loading = false
      } catch (error) {
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    async getCurrentPrice (value) {
      this.currentPrice = value
    },
    async updateRecord () {
      const { currentPrice } = this
      if (currentPrice.price === 0) {
        this.$message({
          message: '不能选择0元订单',
          type: 'error'
        })
      }
    },
    async preOrder () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { userId } = this.salesInfo
      try {
        const { code, data: { url }, message } = await getPreOrder({ applyId: this.applyId, userId })
        if (code === 0) {
          this.$copyText(url).then(async (e) => {
            Message.success('提单链接已复制到剪切板')
            this.isPreInfo = false
            await this.getRecord()
          }, function (e) {})
          return
        }
        if (code === 4080) {
          Message.error(message || '关键词已经被售出!')
        }
      } catch (error) {
        console.log('error', error)
      } finally {
        loading.close()
      }
    },
    async getPreInfo (record) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { userId } = this.salesInfo
      const { id: applyId } = record
      this.applyId = applyId
      this.activeRecord = record
      this.isPreInfo = true
      const { data } = await getPreInfo({ applyId, userId })
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
