
<template>
  <div class="order-info">
    <topbar :userInfo="userInfo">
      <label slot="title">订单详情</label>
    </topbar>
    <main>
      <div>
        <span>
          <item label="订单号" :value="orderInfo.order.id"></item>
          <item label="客户" :value="orderInfo.order.userName"></item>
          <item label="销售" :value="orderInfo.order.salesName"></item>
          <item label="创建时间" :value="orderInfo.order.createdAt | toHumanTime"></item>
          <item label="订单价格" :value="orderInfo.order.realPrice | price">
          </item>
        </span>
        <span>
        </span>
      </div>
    </main>
  </div>
</template>

<script>

import Topbar from 'com/topbar'
import Item from './item'

import store from './store'

import {
  toHumanTime,
  centToYuan,
  commafy
} from 'utils'

import {
  getOrderInfo
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
    Item
  },
  filters: {
    toHumanTime,
    price(s) {
      return commafy(centToYuan(s)) + ' 元'
    }
  },
  async mounted() {
    const orderId = this.$route.params.id
    await getOrderInfo(orderId)
  }
}

</script>

<style scoped>

.order-info {
  padding: 0 35px;
}

</style>
