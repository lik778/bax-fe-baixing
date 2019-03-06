<template>
  <div class="layout-container">
    <section-header>支付订单查询</section-header>
    <div class="action-container">
      <bax-select
        v-model="params.productType"
        :clearable="false"
        placeholder="请选择"
        :options="productTypeOpts"
      />
      <el-date-picker
        v-model="params.dateRange"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <label>订单状态</label>
      <el-radio-group v-model="params.statuses">
        <el-radio-button :label="statusType.STATUS_UNPAID">未支付</el-radio-button>
        <el-radio-button :label="[statusType.STATUS_PAID, statusType.STATUS_ACTIVE]">已支付</el-radio-button>
        <el-radio-button :label="statusType.STATUS_CANCELED">已取消</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
      :data="params.productType === PRODUCT_TYPE_FENGMING ? fengmingOrderData: biaowangOrderData"
      style="width: 100%"
    >
      <template v-if="params.productType === PRODUCT_TYPE_FENGMING">
        <el-table-column
          width="180"
          label="订单编号"
          prop="id"/>
        <el-table-column
          width="90"
          align="center"
          label="状态"
          :formatter="({status}) => statusLabel[status]"/>
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
          :formatter="({originalPrice, extra}) => formatPrice(originalPrice * genKaSiteDuration(extra))"/>
        <el-table-column
          width="105"
          align="center"
          label="优惠"
          :formatter="({originalPrice, customerPrice, extra}) => formatPrice(originalPrice * genKaSiteDuration(extra) - customerPrice)"/>
        <el-table-column
          width="105"
          align="center"
          label="实价"
          :formatter="({customerPrice}) => formatPrice(customerPrice)"/>
        <el-table-column
          width="140"
          align="center"
          label="创建时间"
          :formatter="({ createdAt }) => formatTimestamp(createdAt * 1000)"/>
        <el-table-column label="操作"
          width="180"
          align="center"
        >
          <div slot-scope="{row}">
            <div class="btn-wrap" v-if="row.status === statusType.STATUS_UNPAID">
              <a href="javascript:;" @click="payOrder(row.id)">支付</a>
              <a href="javascript:;" @click="cancelOrder(row.id)">取消订单</a>
            </div>
            <div v-else>-</div>
          </div>
        </el-table-column>
      </template>
      
      <template v-else>
        <el-table-column
          width="240"
          label="订单编号"
          prop="tradeSeq"/>
        <el-table-column
          width="90"
          align="center"
          label="状态"
          :formatter="({status}) => statusLabel[status]"/>
        <el-table-column
          width="105"
          align="center"
          label="原价"
          :formatter="({originalPrice}) => formatPrice(originalPrice)"/>
        <el-table-column
          width="105"
          align="center"
          label="优惠"
          :formatter="({originalPrice, dealPrice}) => formatPrice(originalPrice - dealPrice) || '-'"/>
        <el-table-column
          width="105"
          align="center"
          label="实价"
          :formatter="({dealPrice}) => formatPrice(dealPrice)"/>
        <el-table-column
          width="140"
          align="center"
          label="创建时间"
          :formatter="({ createdTime }) => formatTimestamp(createdTime)"/>
        <el-table-column label="操作"
          width="180"
          align="center"
        >
          <div slot-scope="{row}">
            <div class="btn-wrap" v-if="row.status === statusType.STATUS_UNPAID">
              <a href="javascript:;" @click="payOrder(row.tradeSeq, true)">支付</a>
              <a href="javascript:;" @click="cancelOrder(row.tradeSeq, true)">取消订单</a>
            </div>
            <div v-else>-</div>
          </div>
      </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="total"
      class="pagination"
      :total="total"
      :current-page="Math.floor(offset / params.limit) + 1"
      @current-change="goto"
      :page-size="params.limit"
      layout="total, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import * as api from 'api/account'
import * as biaowangApi from 'api/biaowang'
import BaxSelect from 'com/common/select'
import SectionHeader from 'com/common/section-header'
import { productTypeOpts, PRODUCT_TYPE_BIAOWANG, PRODUCT_TYPE_FENGMING } from 'constant/log'
import { orderServiceHost } from 'config'

const statusType = {
  STATUS_REFUND: -10,
  STATUS_CANCELED: -1,
  STATUS_UNPAID: 0,
  STATUS_PAID: 1,
  STATUS_ACTIVE: 10
}

const statusLabel = {
  [statusType.STATUS_REFUND]: '已退款',
  [statusType.STATUS_CANCELED]: '已取消',
  [statusType.STATUS_UNPAID]: '未支付',
  [statusType.STATUS_PAID]: '已支付',
  [statusType.STATUS_ACTIVE]: '已支付'
}

const ONE_PAGE_NUM = 10

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
      statusType,
      statusLabel,
      productTypeOpts,
      PRODUCT_TYPE_FENGMING,

      params: {
        productType: PRODUCT_TYPE_FENGMING,
        dateRange: DEFAULT_DATE_RANGE,
        limit: ONE_PAGE_NUM,
        statuses: statusType.STATUS_UNPAID
      },
      offset: 0,
      fengmingOrderData: [],
      biaowangOrderData: [],
      total: 0
    }
  },
  components: {SectionHeader, BaxSelect},
  methods: {
    async payOrder(orderId, isBw) {
      let url
      if (isBw) {
        url = `${orderServiceHost}/pay/?tradeId=${orderId}`
      } else {
        url = await api.payOrder(orderId)
      }
      this.$message.success('正在跳转支付页面')
      setTimeout(() => {
        location.href = url
      }, 800)
    },
    async cancelOrder(orderId, isBw) {
      await this.$confirm('您确定要取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '放弃'
      })
      if (isBw) {
        await biaowangApi.cancelOrder(orderId)
      } else {
        await api.cancelOrder(orderId)
      }
      await this.fetchOrderData()
      this.$message.success('取消订单成功')
    },
    async fetchOrderData(isResetOffset) {
      if (isResetOffset) this.offset = 0
      // format quey parmas
      const { dateRange: originalDateRange, productType, limit, statuses } = this.params
      const [startTs, endTs] = originalDateRange.map(transformUnixTimeStamp)
      if (!(startTs && endTs)) return
      const dateRange = {
        startTs,
        endTs
      }
      if (productType === PRODUCT_TYPE_FENGMING) {
        const {data, total} = await api.queryOrder({
          limit,
          statuses,
          ...dateRange,
          offset: this.offset
        })
        this.fengmingOrderData = data
        this.total = total
      } else {
        const page = this.offset / ONE_PAGE_NUM
        const size = ONE_PAGE_NUM
        const {data, total} = await biaowangApi.queryOrder({
          page,
          size,
          status: statuses
        })
        this.biaowangOrderData = data
        this.total = total
      }
    },
    formatPrice(price) {
      return (price / 100)
    },
    formatChargePrice({originalPrice, productType}) {
      // 这个订单如果只买了官网，没有充值，就显示“-”
      return productType === 4 ? '-' : this.formatPrice(originalPrice)
    },
    formatTimestamp(timestamp) {
      return dayjs(new Date(timestamp)).format('YY-MM-DD HH:mm')
    },
    formatKaSiteDuration({productType, extra}) {
      if (productType === 3) return '-'
      const duration = this.genKaSiteDuration(extra)
      return `${duration}年`
    },
    genKaSiteDuration(extra) {
      const {new_shop_duration} = JSON.parse(extra)
      switch(new_shop_duration) {
        case 31536000:
          return 1
        case 47304000:
          return 1.5
        case 63072000:
          return 2
        default:
          return 1
      }
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
      handler(val, oVal) {
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
