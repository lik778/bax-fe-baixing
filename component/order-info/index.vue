
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
          <item label="订单实价" :value="orderInfo.order.realPrice | price" />
          <item label="客户价格" :value="orderInfo.order.customerPrice | price" />
          <item label="订单原价" :value="orderInfo.order.originalPrice | price" />
        </span>
        <span />
      </div>
      <div v-if="unpaied">
        <el-input v-model="discount" />
        <el-button @click="changeDiscount">确认</el-button>
      </div>
      <div v-if="payUrl">
        {{ payUrl }}
      </div>
      <div>
        <log v-for="log in logs" :info="log" />
      </div>
    </main>
  </div>
</template>

<script>

import { Message } from 'element-ui'

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
  changeOrderDiscount,
  getOrderPayUrl,
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
  data() {
    return {
      discount: '',
      payUrl: ''
    }
  },
  filters: {
    toHumanTime,
    price(s) {
      return commafy(centToYuan(s)) + ' 元'
    }
  },
  computed: {
    unpaied() {
      const { orderInfo } = this
      return orderInfo && orderInfo.order && orderInfo.order.status === 0
    }
  },
  methods: {
    async changeDiscount() {
      const { discount } = this
      const amount = (discount | 0) * 100 | 0

      const orderId = this.$route.params.id

      await changeOrderDiscount(orderId, {
        amount
      })

      await getOrderInfo(orderId)

      Message.success('修改成功')

      this.discount = ''
    }
  },
  async mounted() {
    const orderId = this.$route.params.id
    const [info] = await Promise.all([
      getOrderInfo(orderId),
      getOrderLogs(orderId)
    ])

    if (info && info.order && info.order.status === 0) {
      const url = await getOrderPayUrl(orderId)
      this.payUrl = url
    }
  }
}

</script>

<style scoped>

.order-info {
  padding: 0 35px;
}

</style>
