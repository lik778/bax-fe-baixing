
<template>
  <div class="gw-charge">
    <topbar :user-info="userInfo">
      <label slot="title">精品官网 - 购买</label>
    </topbar>
    <section>
      <header>请选择您需要官网版本：</header>
      <main>
        <gw-pro-widget v-for="i of products" :key="i.id"
          :title="i.name" :price="i.showPrice | centToYuan"
          :checked="productChecked(i.id)"
          @click="checkProduct(i.id)">
        </gw-pro-widget>
      </main>
    </section>
    <section>
      <div style="margin-top: 45px;">
        <aside>价格信息:</aside>
        <span>
          <price-list :products="checkedProducts"></price-list>
        </span>
      </div>
      <div style="margin-top: 35px;">
        <aside>服务编号:</aside>
        <span v-if="salesIdLocked">
          {{ salesId }}
        </span>
        <span v-else>
          <el-input v-model.trim="salesId"
            placeholder="如有服务编号请您填写">
          </el-input>
        </span>
      </div>
      <div style="margin-top: 25px;">
        <aside>百姓网余额需支付:</aside>
        <span>{{ '￥' + totalPrice }}</span>
      </div>
      <div style="margin-top: 30px;">
        <el-button type="primary" @click="createOrder">
          确认购买
        </el-button>
        <span v-if="orderPayUrl">
          <label :title="orderPayUrl">
            {{ '付款链接: ' + orderPayUrl }}
          </label>
          <Clipboard :content="orderPayUrl"></Clipboard>
        </span>
      </div>
      <footer>
        <li>合同条款:</li>
        <li>1. 一切我们说了算</li>
        <li>2. 我们最牛逼</li>
        <li>3. 不续费弄死你</li>
      </footer>
    </section>
  </div>
</template>

<script>

import Clipboard from 'com/widget/clipboard'
import GwProWidget from 'com/widget/gw-pro'
import PriceList from './price-list'
import Topbar from 'com/topbar'

import { Message } from 'element-ui'

import { centToYuan } from 'utils'

import {
  allowGetOrderPayUrl
} from 'util/role'

import {
  getOrderPayUrl,
  createOrder,
  getProducts
} from './action'

import store from './store'

export default {
  name: 'gw-charge',
  store,
  components: {
    GwProWidget,
    Clipboard,
    PriceList,
    Topbar
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      checkedProductId: 0,
      orderPayUrl: '',

      salesIdLocked: false,
      salesId: ''
    }
  },
  filters: {
    centToYuan
  },
  computed: {
    checkedProducts() {
      return this.products.filter(p => p.id === this.checkedProductId)
    },
    totalPrice() {
      // 目前就一个 :)
      const p = this.checkedProducts.map(p => p.price).pop()
      return centToYuan(p)
    }
  },
  methods: {
    productChecked(id) {
      return this.checkedProductId === id
    },
    checkProduct(id) {
      const checked = this.checkedProductId === id

      if (checked) {
        this.checkedProductId = 0
      } else {
        this.checkedProductId = id
      }
    },
    async getOrderPayUrl(oids) {
      const {
        userInfo
      } = this

      if (!allowGetOrderPayUrl(userInfo.roles)) {
        return
      }

      const url = await getOrderPayUrl(oids)

      this.orderPayUrl = url
    },
    async createOrder() {
      const {
        checkedProductId: id,
        userInfo,
        salesId
      } = this

      if (!id) {
        return Message.error('请先选择产品')
      }

      const { user_id: userId } = this.$route.query

      const order = {
        salesId: salesId || userInfo.salesId,
        userId: userId || userInfo.id,
        products: [{
          id
        }]
      }

      const oids = await createOrder(order)

      await this.getOrderPayUrl(oids)

      Message.success('购买成功')
    }
  },
  async mounted() {
    const { sales_id: salesId } = this.$route.query

    if (salesId) {
      this.salesIdLocked = true
      this.salesId = salesId
    }

    await getProducts(2)
  }
}

</script>

<style scoped>

@import "cssbase/mixin";

.gw-charge {
  padding: 0 35px;
  width: 100%;

  & > section:nth-child(2) {
    border-bottom: dashed 1px #979797;

    & > header {
      font-size: 14px;
      color: #6a778c;
    }

    & > main {
      display: flex;
      margin: 46px 0 50px;

      & > div {
        margin-right: 10px;
      }
    }
  }

  & > section:nth-child(3) {
    padding-left: 12px;

    & > div {
      & > aside {
        min-width: 84px;
        font-size: 14px;
        color: #6a778c;
      }
    }

    & > div:first-child {
      display: flex;

      & > aside {
        margin: 5px 5px 0 0;
      }
    }

    & > div:nth-child(3) {
      & > span {
        font-size: 18px;
        color: #ff1f0e;
      }
    }

    & > div:nth-child(4) {
      & > span {
        display: inline-flex;
        align-items: center;
        margin-left: 35px;

        & > label {
          @mixin wordline;
          width: 320px;
          max-width: 320px;
          font-size: 14px;
          color: #6a778c;
        }
      }
    }

    & > footer {
      margin: 34px 0 30px;
      font-size: 13px;
      line-height: 1.62;
      color: #6a778c;
    }
  }
}

</style>
