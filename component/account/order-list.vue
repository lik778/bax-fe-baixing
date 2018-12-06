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
      <el-radio-group v-model="params.status">
        <el-radio-button :label="statusType.STATUS_UNPAID">未支付</el-radio-button>
        <el-radio-button :label="statusType.STATUS_PAID">已支付</el-radio-button>
        <el-radio-button :label="statusType.STATUS_CANCELED">已取消</el-radio-button>
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
        :formatter="({status}) => statusLabel[status]"/>
      <el-table-column
        width="105"
        align="center"
        label="充值金额"
        :formatter="({customerPrice}) => formatPrice(customerPrice)"/>
      <el-table-column
        width="90"
        align="center"
        label="精品官网"
        :formatter="({productType}) => productType === 4 ? 1200 : '-'"/>
      <el-table-column
        width="105"
        align="center"
        label="原价"
        :formatter="({originalPrice}) => formatPrice(originalPrice)"/>
      <el-table-column
        width="105"
        align="center"
        label="优惠券"
        :formatter="({originalPrice, realPrice}) => formatPrice(originalPrice - realPrice)"/>
      <el-table-column
        width="105"
        align="center"
        label="实价"
        :formatter="({realPrice}) => formatPrice(realPrice)"/>
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
          <div class="btn-wrap" v-if="row.status === statusType.STATUS_UNPAID">
            <a href="javascript:;" @click="payOrder(row.id)">支付</a>
            <a href="javascript:;" @click="cancelOrder(row.id)">取消订单</a>
          </div>
          <div v-else>-</div>
        </div>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total"
      class="pagination"
      :page-count="Math.floor(total / params.limit)"
      @current-change="goto"
      :page-size="params.limit"
      layout="total, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
import moment from 'moment'
import * as api from 'api/account'
import SectionHeader from 'com/common/section-header'

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
  [statusType.STATUS_ACTIVE]: '-'
}

const ONE_PAGE_NUM = 10

const transformUnixTimeStamp = (date) =>  {
  return moment(new Date(date)).unix()
}

export default {
  name: 'qwt-operastion-order-list',
  data() {
    return {
      statusType,
      statusLabel,

      params: {
        dateRange: [],
        limit: ONE_PAGE_NUM,
        offset: 0,
        status: statusType.STATUS_UNPAID
      },

      orderData: [],
      total: 0
    }
  },
  components: {SectionHeader},
  methods: {
    async payOrder(orderId) {
      const url = await api.payOrder([orderId])
      this.$message.success('正在跳转支付页面')
      setTimeout(() => {
        location.href = url
      }, 800)
    },
    async cancelOrder(orderId) {
      await api.cancelOrder(orderId)
      await this.fetchOrderData()
      this.$message.success('取消订单成功')
    },
    async fetchOrderData() {
      // format quey parmas
      const { dateRange, ...otherParams } = this.params
      const [startTs, endTs] = dateRange.map(transformUnixTimeStamp)
      if (!(startTs && endTs)) return
      const queryParmas = {
        startTs,
        endTs,
        ...otherParams
      }
      const {total, data} = await api.queryOrder(queryParmas)
      this.orderData = data
      this.total = total
    },
    formatPrice(price) {
      return (price / 100)
    },
    formatCreatedAt({createdAt}) {
      return moment(new Date(createdAt * 1000)).format('YY-MM-DD HH:mm')
    },
    goto(page) {
      this.params.offset = page * ONE_PAGE_NUM
    }
  },
  watch: {
    params: {
      deep: true,
      handler() {
        this.fetchOrderData()
      }
    }
  }
}
</script>

<style scoped lang="postcss">
  .action-container {
    margin-bottom: 20px;
    & > label {
      margin-left: 40px;
      margin-right: 15px;
    }
  }
  .btn-wrap {
    & > a {
      color: #409EFF;
    }
  }
  .pagination {
    margin-top: 20px;
  }
</style>
