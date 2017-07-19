
<template>
  <section>
    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="order.id" label="订单编号" width="120" />
      <el-table-column label="订单状态">
        <template scope="s">
          <span>{{ s.row.status | orderStatus }}</span>
          <el-button v-if="s.row.order.status === 0"
            size="mini" type="danger"
            @click="cancel(s.row.order.id)">
            取消
          </el-button>
          <el-button v-if="allowPayOrder && (s.row.order.status === 0)"
            size="mini" type="primary"
            @click="pay(s.row.order.id)">
            付款
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="广告类型" width="120"
        :formatter="formatOrderType">
      </el-table-column>
      <el-table-column prop="order.userName" label="客户">
      </el-table-column>
      <el-table-column label='创建时间'>
        <template scope="s">
          <span>{{ s.row.order.createdAt | toHumanTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label='操作' width="180">
        <template scope="s">
          <router-link :to="{ name: 'order-info', params: { id: s.row.order.id } }">
            查看详情
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination :options="query"
      @current-change="onCurrentChange">
    </bax-pagination>
  </section>
</template>

<script>

import BaxPagination from 'com/common/pagination'

import { toHumanTime } from 'utils'

import { Message } from 'element-ui'

import {
  sspOrderStatus,
  sspOrderType
} from 'constant/order'

import {
  allowPayOrder
} from 'util/role'

import {
  cancelOrder,
  getOrders,
  payOrder
} from './action'

export default {
  name: 'order-list',
  components: {
    BaxPagination
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    orders: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  computed: {
    allowPayOrder() {
      return allowPayOrder(this.userInfo.roles)
    }
  },
  filters: {
    orderStatus(s) {
      return sspOrderStatus[String(s)]
    },
    toHumanTime
  },
  methods: {
    async cancel(id) {
      try {
        await this.$confirm(`确认取消订单: ${id} ?`)
      } catch (err) {
        return
      }

      await cancelOrder(id)
      await getOrders()
      Message.success('已取消订单')
    },
    async pay(id) {
      try {
        await this.$confirm(`确认支付订单: ${id} ?`)
      } catch (err) {
        return
      }

      await payOrder(id)
      await getOrders()
      Message.success('支付成功')
    },
    async onCurrentChange({offset}) {
      await getOrders({offset})
    },
    formatOrderType(row) {
      return sspOrderType[String(row.orderType)]
    }
  },
  async mounted() {
    await getOrders({...this.query})
  }
}

</script>

<style scoped>

section {
  margin-top: 16px;
}

</style>
