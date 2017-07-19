
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
      <div class="discount" v-if="unpaied && isOperator">
        <span>
          <el-input v-model="discount"
            placeholder="降价 xx 元" />
        </span>
        <el-button @click="changeDiscount">确认</el-button>
      </div>
      <div class="pay-order" v-if="allowPayOrder">
        <label>当前订单未付款</label>
        <el-button @click="payOrder" type="primary">
          立即支付
        </el-button>
      </div>
      <div class="pay-url" v-if="payUrl">
        <label>付款链接</label>
        <span :title="payUrl">{{ payUrl }}</span>
        <i class="el-icon-document"
          v-clipboard:copy="payUrl"
          v-clipboard:success="onCopySuccess"
          v-clipboard:error="onCopyError"></i>
      </div>
      <div>
        <log v-for="(log, i) in logs" :info="log" :key="i" />
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
  allowGetOrderPayUrl,
  allowPayOrder
} from 'util/role'

import {
  toHumanTime,
  centToYuan,
  commafy
} from 'utils'

import {
  changeOrderDiscount,
  getOrderPayUrl,
  getOrderInfo,
  getOrderLogs,
  payOrder
} from './action'

export default {
  name: 'order-info',
  store,
  components: {
    Topbar,
    Item,
    Log
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
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
    allowGetOrderPayUrl() {
      return allowGetOrderPayUrl(this.userInfo.roles)
    },
    allowPayOrder() {
      const ok = allowPayOrder(this.userInfo.roles)
      return ok && this.unpaied
    },
    unpaied() {
      const { orderInfo } = this
      return orderInfo && orderInfo.order && orderInfo.order.status === 0
    },
    isOperator() {
      const roles = this.userInfo.roles || []
      return roles.map(r => r.nameEn).includes('NORMAL_OPERATOR')
    }
  },
  methods: {
    async initOrderInfo() {
      const orderId = this.$route.params.id
      const [info] = await Promise.all([
        getOrderInfo(orderId),
        getOrderLogs(orderId)
      ])

      if (!this.allowGetOrderPayUrl) {
        return
      }

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
    async payOrder() {
      const orderId = this.$route.params.id

      try {
        await this.$confirm(`确认支付订单: ${orderId} ?`)
      } catch (err) {
        return
      }

      await payOrder(orderId)

      Message.success('支付成功')

      await this.initOrderInfo()
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
  margin: 10px 0;

  & > span {
    width: 200px;
    margin-right: 10px;
  }
}

.pay-order {
  display: flex;
  align-items: center;
  margin: 20px 0;

  & > label {
    margin-right: 50px;
    font-size: 14px;
    color: #5e6d82;
  }
}

.pay-url {
  display: flex;
  align-items: center;

  & > label {
    font-size: 14px;
    color: #5e6d82;
    margin-right: 5px;
  }

  & > span {
    @mixin wordline;
    width: 200px;
  }

  & > i {
    cursor: pointer;
  }
}

.order-info {
  padding: 0 35px;
  width: 100%;
}

</style>
