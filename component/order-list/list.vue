
<template>
  <section>
    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="order.id" label="ID" width="120">
      </el-table-column>
      <el-table-column label="订单状态" width="80">
        <template scope="s">
          <span>{{ s.row.order.status | orderStatus }}</span>
          <el-button v-if="s.row.order.status === 0" size="mini"
            @click="pay(s.row.order.id)">
            付款
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="order.userName" label="客户" width="120">
      </el-table-column>
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
  </section>
</template>

<script>

import { sspOrderStatus } from 'constant/order'
import { toHumanTime } from 'utils'

import { Message } from 'element-ui'

import {
  getOrders,
  payOrder
} from './action'

export default {
  name: 'order-list',
  props: {
    orders: {
      type: Array,
      required: true
    }
  },
  methods: {
    async pay(id) {
      await payOrder(id)
      await getOrders()
      Message.success('支付成功')
    }
  },
  filters: {
    orderStatus(s) {
      return sspOrderStatus[String(s)]
    },
    toHumanTime
  },
  async mounted() {
    await getOrders()
  }
}

</script>

<style scoped>

section {
  margin-top: 16px;
}

</style>
