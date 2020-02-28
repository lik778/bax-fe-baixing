<template>
  <div class="layout-container">
    <section-header>支付订单查询</section-header>
    <div class="action-container">
      <el-date-picker
        v-model="params.dateRange"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <label>订单状态</label>
      <el-radio-group v-model="params.orderStatusList">
        <el-radio-button :label="[orderStatusType.STATUS_UNPAID, orderStatusType.STATUS_PRE_TRADE]">未支付</el-radio-button>
        <el-radio-button :label="[orderStatusType.STATUS_PAID]">已支付</el-radio-button>
        <el-radio-button :label="[orderStatusType.STATUS_ORDER_CANCELED]">已取消</el-radio-button>
        <el-radio-button :label="[orderStatusType.STATUS_ORDER_REFUND]">已退款</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
      :data="orderData"
      style="width: 100%"
    >
      <el-table-column
        width="230"
        label="订单编号"
        prop="tradeSeq"/>
      <el-table-column
        width="200"
        label="产品Id"
        prop="skuId"/>
      <el-table-column
        width="90"
        align="center"
        label="产品名称"
        prop="skuTitle"/>
      <el-table-column
        width="90"
        align="center"
        label="状态"
        prop="status"
        :formatter="({status}) => orderStatusLabel[status]"/>
      <el-table-column
        width="105"
        align="center"
        label="原价"
        prop="originalPrice" 
        :formatter="row => formatPrice(row.originalPrice)"/>
      <el-table-column
        width="105"
        align="center"
        label="优惠"
        :formatter="row => formatPrice(row.reducedPrice)"/>
      <el-table-column
        width="105"
        align="center"
        label="实价"
        :formatter="row => formatPrice(row.dealPrice)"/>
      <el-table-column
        width="140"
        align="center"
        label="创建时间"
        :formatter="row => formatTime(row.createdTime)"/>
      <el-table-column label="操作"
        width="180"
        align="center"
      >
        <div slot-scope="{row}">
          <div class="btn-wrap" 
               v-if="row.status === orderStatusType.STATUS_UNPAID || row.status === orderStatusType.STATUS_PRE_TRADE">
            <a href="javascript:;" @click="payOrder(row.tradeSeq, row.status)">支付</a>
            <a href="javascript:;" @click="cancelOrder(row.tradeSeq, row.status)">取消订单</a>
          </div>
          <div v-else>-</div>
        </div>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total"
      class="pagination"
      :total="total"
      :current-page="pageNo"
      @current-change="handleCurrentPage"
      :page-size="params.size"
      layout="total, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import * as api from 'api/account'
import SectionHeader from 'com/common/section-header'
import { orderStatusType, orderStatusLabel} from 'constant/order'
import { MERCHANTS } from 'constant/product'
import { orderServiceHost } from 'config'

const { FENG_MING_MERCHANT_CODE, WEBSITE_MERCHANT_CODE} = MERCHANTS
const ONE_PAGE_NUM = 10
const DEFAULT_DATE_RANGE = [
  dayjs(new Date()).subtract(1, 'months').toDate(),
  dayjs().toDate()
]

export default {
  name: 'qwt-operastion-order-list',
  data() {
    return {
      orderStatusType,
      orderStatusLabel,
      params: {
        merchantList:[FENG_MING_MERCHANT_CODE, WEBSITE_MERCHANT_CODE],
        orderStatusList: [orderStatusType.STATUS_UNPAID, orderStatusType.STATUS_PRE_TRADE],
        size: ONE_PAGE_NUM,
        dateRange: DEFAULT_DATE_RANGE,
      },
      pageNo: 1,
      orderData: null,
      total: 0
    }
  },
  components: {SectionHeader},
  methods: {
    async payOrder(tradeSeq, status) {
      const { STATUS_PRE_TRADE, STATUS_UNPAID } = this.orderStatusType
      this.$message.success('正在跳转支付页面')
      let payUrl = ''
      if (status === STATUS_PRE_TRADE) {
        payUrl = `${orderServiceHost}/?tradeId=${tradeSeq}`
      }
      if (status === STATUS_UNPAID) {
        payUrl = `${orderServiceHost}/?appId=105&seq=${tradeSeq}`
      }
      setTimeout(() => {
        location.href = payUrl
      }, 800)
    },
    async cancelOrder(tradeSeq, status) {
      await this.$confirm('您确定要取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '放弃'
      })
      await api.cancelOrder(tradeSeq)
      await this.fetchOrderData()
      this.$message.success('取消订单成功')
    },
    async fetchOrderData(isResetOffset) {
      if (isResetOffset) this.pageNo = 1
      const { dateRange, ...otherParams } = this.params
      let queryParmas = {
        pageNo: this.pageNo,
        ...otherParams
      }
      if (dateRange) {
        const startDate = dayjs(dateRange[0]).startOf('day').unix()
        const endDate = dayjs(dateRange[1]).endOf('day').unix()
        queryParmas = {
          startDate,
          endDate,
          ...queryParmas
        }
      } 
      const { total, data } = await api.queryOrder(queryParmas)
      this.orderData = data
      this.total = total
    },
    formatPrice(price) {
      return (price / 100)
    },
    formatTime (time) {
      return dayjs(time * 1000).format('YY-MM-DD HH:mm')
    },
    handleCurrentPage(val) {
      this.params.pageNo = val
      this.fetchOrderData()
    },
  },
  watch: {
    params: {
      deep: true,
      immediate: true,
      handler() {
        this.fetchOrderData(true)
      }
    }
  }
}
</script>

<style scoped lang="postcss">
  @import "../../cssbase/var.css";
  .action-container {
    margin-bottom: 20px;
    & > label {
      margin-left: 40px;
      margin-right: 15px;
    }
  }
  .btn-wrap {
    & > a {
      color: var(--qwt-c-blue);
    }
  }
  .pagination {
    margin-top: 20px;
  }
</style>
