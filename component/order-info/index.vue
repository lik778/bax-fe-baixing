
<template>
  <div class="order-info">
    <topbar :userInfo="userInfo">
      <label slot="title">订单详情</label>
    </topbar>
    <main>
      <div>
        <span>
          <item label="订单号" :value="orderInfo.order.id" />
          <item label="客户" :value="orderInfo.order.userName" />
          <item label="销售" :value="orderInfo.order.salesName" />
          <item label="创建时间" :value="orderInfo.order.createdAt | toHumanTime" />
          <item label="订单价格" :value="orderInfo.order.realPrice | price" />
        </span>
        <span />
      </div>
      <div>
        <log v-for="log in logs" :info="log" />
      </div>
    </main>
  </div>
</template>

<script>

import Topbar from 'com/topbar'
import Item from './item'
import Log from './log'

import store from './store'

import {
  toHumanTime,
  centToYuan,
  commafy
} from 'utils'

import {
  getOrderInfo,
  getOrderLogs
} from './action'

export default {
  name: 'order-info',
  store,
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    Topbar,
    Item,
    Log
  },
  filters: {
    toHumanTime,
    price(s) {
      return commafy(centToYuan(s)) + ' 元'
    }
  },
  async mounted() {
    const orderId = this.$route.params.id
    await Promise.all([
      getOrderInfo(orderId),
      getOrderLogs(orderId)
    ])
  }
}

</script>

<style scoped>

.order-info {
  padding: 0 35px;
}

</style>
