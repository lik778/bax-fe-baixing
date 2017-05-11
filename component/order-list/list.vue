
<template>
  <section>
    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="order.id" label="ID" width="120" />
      <el-table-column label="订单状态" width="120">
        <template scope="s">
          <span>{{ s.row.status | orderStatus }}</span>
          <el-button v-if="allowPayOrder && (s.row.order.status === 0)"
            size="mini"
            @click="pay(s.row.order.id)">
            付款
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" width="120"
        :formatter="formatOrderType" />
      <el-table-column prop="order.userName" label="客户" width="120" />
      <el-table-column label='创建时间'>
        <template scope="s">
          <span>{{ s.row.order.createdAt | toHumanTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label='操作'>
        <template scope="s">
          <router-link :to="{ name: 'order-info', params: { id: s.row.order.id } }">
            查看详情
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination :options="query"
      @current-change="onCurrentChange" />
  </section>
</template>

<script>

import BaxPagination from 'com/common/pagination'

import { sspOrderStatus } from 'constant/order'
import { toHumanTime } from 'utils'

import { Message } from 'element-ui'

import {
  sspOrderType
} from 'constant/order'

import {
  allowPayOrder
} from 'util/role'

import {
  getOrders,
  payOrder
} from './action'

export default {
  name: 'order-list',
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
  components: {
    BaxPagination
  },
  methods: {
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
      return sspOrderType[String(row.order.orderType)]
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
