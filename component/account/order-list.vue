<template>
  <div class="layout-container">
    <section-header>支付订单查询</section-header>
    <div class="action-container">
      <el-date-picker
        v-model="params.dateRange"
        type="datetimerange"
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
        width="180"
        label="订单编号"
        prop="id"/>
      <el-table-column
        width="90"
        align="center"
        label="状态"
        :formatter="({status}) => orderStatusLabel[status]"/>
      <el-table-column
        width="105"
        align="center"
        label="充值金额"
        :formatter="formatChargePrice"/>
      <el-table-column
        width="90"
        align="center"
        label="精品官网"
        :formatter="formatKaSiteDuration"/>
      <el-table-column
        width="105"
        align="center"
        label="原价"
        :formatter="row => formatPrice(genOriginalPrice(row) * genKaSiteDuration(row.extra))"/>
      <el-table-column
        width="105"
        align="center"
        label="优惠"
        :formatter="row => formatPrice(genOriginalPrice(row) * genKaSiteDuration(row.extra) - row.customerPrice)"/>
      <el-table-column
        width="105"
        align="center"
        label="实价"
        :formatter="({customerPrice}) => formatPrice(customerPrice)"/>
      <el-table-column
        width="140"
        align="center"
        label="创建时间"
        :formatter="formatCreatedAt"/>
      <el-table-column label="操作"
        width="180"
        align="center"
      >
        <div slot-scope="{row}">
          <div class="btn-wrap" v-if="row.status === orderStatusType.STATUS_UNPAID">
            <a href="javascript:;" @click="payOrder(row.id)">支付</a>
            <a href="javascript:;" @click="cancelOrder(row.id)">取消订单</a>
          </div>
          <div v-else>-</div>
        </div>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      v-if="total"
      class="pagination"
      :total="total"
      :current-page="Math.floor(offset / params.limit) + 1"
      @current-change="goto"
      :page-size="params.limit"
      layout="total, prev, pager, next, jumper"
    >
    </el-pagination> -->
  </div>
</template>

<script>
import dayjs from 'dayjs'
import * as api from 'api/account'
import SectionHeader from 'com/common/section-header'
import { orderStatusType, orderStatusLabel} from 'constant/order'

const ONE_PAGE_NUM = 10
const ONE_YEAR_QUOTA_PRICE = 120000

const transformUnixTimeStamp = (date) =>  {
  return dayjs(new Date(date)).unix()
}
const DEFAULT_DATE_RANGE = [
  dayjs(new Date()).subtract(1, 'months'),
  new Date()
]

export default {
  name: 'qwt-operastion-order-list',
  data() {
    return {
      orderStatusType,
      orderStatusLabel,

      params: {
        dateRange: DEFAULT_DATE_RANGE,
        orderStatusList: [orderStatusType.STATUS_UNPAID, orderStatusType.STATUS_PRE_TRADE],
        size: ONE_PAGE_NUM
      },
      pageNo: 1,
      orderData: [],
      total: 0
    }
  },
  components: {SectionHeader},
  methods: {
    genOriginalPrice({productType, originalPrice}) {
      if (productType === 4) return ONE_YEAR_QUOTA_PRICE
      return originalPrice
    },
    async payOrder(orderId) {
      const url = await api.payOrder(orderId)
      this.$message.success('正在跳转支付页面')
      setTimeout(() => {
        location.href = url
      }, 800)
    },
    async cancelOrder(orderId) {
      await this.$confirm('您确定要取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '放弃'
      })
      await api.cancelOrder(orderId)
      await this.fetchOrderData()
      this.$message.success('取消订单成功')
    },
    async fetchOrderData(isResetOffset) {
      if (isResetOffset) this.offset = 0
      const { dateRange, ...otherParams } = this.params
      const [startDate, endDate] = dateRange.map(transformUnixTimeStamp)
      if (!(startDate && endDate)) return
      const queryParmas = {
        startDate,
        endDate,
        pageNo: this.pageNo,
        ...otherParams
      }
      const data = await api.queryOrder(queryParmas)
      this.orderData = data.data
      this.total = data.totalElements
    },
    formatPrice(price) {
      return (price / 100)
    },
    formatChargePrice({originalPrice, productType}) {
      // 这个订单如果只买了官网，没有充值，就显示“-”
      return productType === 4 ? '-' : this.formatPrice(originalPrice)
    },
    formatCreatedAt({createdAt}) {
      return dayjs(new Date(createdAt * 1000)).format('YY-MM-DD HH:mm')
    },
    formatKaSiteDuration({productType, extra}) {
      if (productType === 3) return '-'
      const duration = this.genKaSiteDuration(extra)
      return `${duration}年`
    },
    genKaSiteDuration(extra) {
      const ONE_YEAR_MILLISECOND = 31536000
      const {new_shop_duration} = JSON.parse(extra)
      if (!new_shop_duration) return 1
      const result = new_shop_duration / ONE_YEAR_MILLISECOND
      return result % 1 === 0 ? result : result.toFixed(1)
    },
    goto(page) {
      this.offset = (page - 1) * ONE_PAGE_NUM
      this.fetchOrderData()
    }
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
