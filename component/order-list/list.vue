
<template>
  <section>
    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="order.id" label="ID" width="120">
      </el-table-column>
      <el-table-column label="订单状态" width="80">
         <template scope="s">
          <span>{{ s.row.order.status | orderStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" width="120">
        <template scope="scope">
          <span>缺字段</span>
        </template>
      </el-table-column>
      <el-table-column label='创建时间'>
        <template scope="s">
          <span>{{ s.row.order.createdAt | toHumanTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label='操作'>
        <template scope="s">
          <router-link :to="{ name: 'orderDetail', params: { id: s.row.order.id } }">
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

import {
  getOrders
} from './action'

export default {
  name: 'order-list',
  props: {
    orders: {
      type: Array,
      required: true
    }
  },
  filters: {
    orderStatus(s) {
      return sspOrderStatus[String(s)]
    },
    toHumanTime
  },
  mounted() {
    getOrders()
  }
}

</script>

<style scoped>

section {
  margin-top: 16px;
}

</style>
