
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
          <item label="订单价格" :value="orderInfo.order.customerPrice | price" />
          <item label="订单原价" :value="orderInfo.order.originalPrice | price" />
        </span>
        <span>
          <div v-if="orderInfo.order.relatedOrderId">
            <label>关联订单</label>
            <span @click="gotoRelatedOrder">
              {{ orderInfo.order.relatedOrderId }}
            </span>
          </div>
          <div v-else>
            <el-button @click="addRelatedOrder">添加关联订单</el-button>
          </div>
        </span>
      </div>
      <div class="discount" v-if="unpaied">
        <span>
          <el-input v-model="discount"
            placeholder="降价 xx 元" />
        </span>
        <el-button @click="changeDiscount">确认</el-button>
      </div>
      <div class="pay-url" v-if="payUrl">
        <span :title="payUrl">{{ payUrl }}</span>
        <i class="el-icon-document"
          v-clipboard:copy="payUrl"
          v-clipboard:success="onCopySuccess"
          v-clipboard:error="onCopyError" />
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
    async initOrderInfo() {
      const orderId = this.$route.params.id
      const [info] = await Promise.all([
        getOrderInfo(orderId),
        getOrderLogs(orderId)
      ])

      console.warn('TODO - role 限制')

      if (info && info.order && info.order.status === 0) {
        const url = await getOrderPayUrl(orderId)
        this.payUrl = url
      }
    },
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
    },
    addRelatedOrder() {
      const id = this.$route.params.id

      this.$router.push({
        name: 'create-order',
        query: {
          relatedOrderId: id
        }
      })
    },
    gotoRelatedOrder() {
      const id = this.orderInfo.order.relatedOrderId

      this.$router.push({
        name: 'order-info',
        params: {
          id
        }
      })
    },
    onCopySuccess() {
      Message.success('复制成功')
    },
    onCopyError() {
      Message.error('复制失败')
    }
  },
  async mounted() {
    await this.initOrderInfo()
  },
  watch: {
    '$route.params.id': async function(v, p) {
      if (v !== p) {
        await this.initOrderInfo()
      }
    }
  }
}

</script>

<style scoped>

@import 'cssbase/mixin';

.discount {
  display: flex;
  align-items: center;

  & > span {
    width: 200px;
  }
}

.pay-url {
  display: flex;
  align-items: center;

  & > span {
    @mixin wordline;
    width: 200px;
  }
}

.order-info {
  padding: 0 35px;
}

</style>
