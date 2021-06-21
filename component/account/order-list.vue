<template>
  <div class="layout-container">
    <section-header>支付订单查询</section-header>
    <div class="action-container">
      <el-date-picker
        v-model="params.dateRange"
        type="daterange"
        style="width: 250px"
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
      <label>查询产品</label>
      <el-select v-model="params.merchantList" clearable placeholder="请选择产品">
        <el-option v-for="(value, key) in PRODUCTS" :key="key" :label="value" :value="key" />
      </el-select>
    </div>
    <el-table
      class="order-list-parent-table"
      :data="orderData"
      style="width: 100%"
      :row-class-name="getRowClass"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.itemVoList.filter(o => o.skuType === GIFT)"
                    :show-header="false"
                    :border="false"
                    class="child-table">
            <el-table-column label="订单编号" width="180" />
            <el-table-column label="产品名称" width="250" prop="skuName" />
            <el-table-column label="状态" width="90" align="center" :formatter="() => {return '--'}" />
            <el-table-column label="原价" width="105" align="center"
                             :formatter="row => formatPrice(row.originalPrice)"
                             prop="originalPrice" />
            <el-table-column label="优惠" width="105" align="center"
                             :formatter="row => formatPrice(row.originalPrice - row.dealPrice)" />
            <el-table-column label="实价" width="105"
                             prop="dealPrice"
                             :formatter="row => formatPrice(row.dealPrice)"
                             align="center" />
            <el-table-column label="创建时间" width="150" align="center" :formatter="() => {return '--'}"/>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="订单编号"
        prop="tradeSeq"/>
      <el-table-column
        width="250"
        label="产品名称"
        prop="skuName"/>
      <el-table-column
        width="90"
        align="center"
        label="状态"
        prop="status"
        :formatter="({status}) => orderStatusLabelDisplay[status]"/>
      <el-table-column
        width="105"
        align="center"
        label="原价"
        prop="originalPrice"
        :formatter="row => formatPrice(row.originalPrice, row.status)"/>
      <el-table-column
        width="105"
        align="center"
        label="优惠"
        :formatter="row => formatPrice(row.originalPrice - row.dealPrice, row.status)"/>
      <el-table-column
        width="105"
        align="center"
        label="实价"
        :formatter="row => formatPrice(row.dealPrice, row.status)"/>
      <el-table-column
        width="150"
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
            <a href="javascript:;" @click="payOrder(row.tradeSeq, row.status, row.parentId)">支付</a>
            <a href="javascript:;" @click="cancelOrder(row.tradeSeq, row.status, row.parentId)">取消订单</a>
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
import { orderStatusType, orderStatusLabelDisplay } from 'constant/order'
import { MERCHANTS, SKUTYPES } from 'constant/product'
import { orderServiceHost } from 'config'

const { FENG_MING_MERCHANT_CODE, PHOENIXS_MERCHANT_CODE } = MERCHANTS
const { GIFT } = SKUTYPES
const ONE_PAGE_NUM = 10
const DEFAULT_DATE_RANGE = [
  dayjs(new Date()).subtract(1, 'months').toDate(),
  dayjs().toDate()
]
const PRODUCTS = {
  [FENG_MING_MERCHANT_CODE]: '站外推广',
  [PHOENIXS_MERCHANT_CODE]: '标王'
}

export default {
  name: 'qwt-operastion-order-list',
  data () {
    return {
      orderStatusType,
      orderStatusLabelDisplay,
      params: {
        merchantList: '',
        orderStatusList: [orderStatusType.STATUS_UNPAID, orderStatusType.STATUS_PRE_TRADE],
        size: ONE_PAGE_NUM,
        dateRange: DEFAULT_DATE_RANGE
      },
      pageNo: 1,
      orderData: null,
      total: 0,

      GIFT,
      PRODUCTS
    }
  },
  components: { SectionHeader },
  methods: {
    async payOrder (tradeSeq, status, parentTradeSeq) {
      // tip: 支付和取消订单实际操作的是父订单，
      // 如果parentTradeSeq为空，说明本身就是父订单，反之，子订单
      const orderId = parentTradeSeq || tradeSeq
      const { STATUS_PRE_TRADE, STATUS_UNPAID } = this.orderStatusType
      this.$message.success('正在跳转支付页面')
      let payUrl = ''
      if (status === STATUS_PRE_TRADE) {
        payUrl = `${orderServiceHost}/?appId=105&seq=${orderId}`
      }
      if (status === STATUS_UNPAID) {
        payUrl = `${orderServiceHost}/pay?tradeId=${orderId}`
      }
      setTimeout(() => {
        location.href = payUrl
      }, 800)
    },
    async cancelOrder (tradeSeq, status, parentTradeSeq) {
      const orderId = parentTradeSeq || tradeSeq
      await this.$confirm('您确定要取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '放弃'
      })
      await api.cancelOrder(orderId)
      await this.fetchOrderData()
      this.$message.success('取消订单成功')
    },
    async fetchOrderData (isResetOffset) {
      if (isResetOffset) this.pageNo = 1
      const { query: { user_id: userId } } = this.$route
      const { dateRange, merchantList, ...otherParams } = this.params
      let queryParmas = {
        pageNo: this.pageNo || 1,
        ...otherParams,
        merchantList: merchantList || Object.keys(PRODUCTS),
        userId
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
      const orderData = data.map(trade => {
        trade.skuName = trade.itemVoList.length ? trade.itemVoList[0].skuName : ''
        return trade
      })
      this.orderData = orderData
      this.total = total
    },
    formatPrice (price, status) {
      const { STATUS_PRE_TRADE } = this.orderStatusType
      if (status === STATUS_PRE_TRADE && Number(price) === 0) {
        return '--'
      }
      return `${(price / 100)}元`
    },
    formatTime (time) {
      return dayjs(time * 1000).format('YYYY-MM-DD HH:mm')
    },
    handleCurrentPage (val) {
      this.pageNo = val
      this.fetchOrderData()
    },
    getRowClass ({ row, index }) {
      return !row.itemVoList.filter(o => o.skuType === GIFT).length ? 'hide-expand-row' : ''
    }
  },
  watch: {
    params: {
      deep: true,
      immediate: true,
      handler () {
        this.fetchOrderData(true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.action-container {
  margin-bottom: 20px;
  & > label {
    margin-left: 20px;
    margin-right: 15px;
  }
}
.btn-wrap {
  & > a {
    color: $qwt-c-blue;
  }
}
.pagination {
  margin-top: 20px;
}

/deep/ .order-list-parent-table {
  & .child-table {
    &:before {
      display: none;
    }
    &.el-table .cell {
      color: #aaa;
    }
    &.el-table tr:last-child {
      & td {
        border-bottom: 0;
      }
    }
  }
  & .el-table__expanded-cell {
    padding: 0 50px;
  }
  & .hide-expand-row {
    & .el-table__expand-icon {
      display: none;
    }
  }
}
</style>
