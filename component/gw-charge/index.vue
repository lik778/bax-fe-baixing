
<template>
  <div class="gw-charge">
    <topbar :user-info="userInfo">
      <label slot="title">精品官网 - 购买</label>
    </topbar>
    <section>
      <header>请选择您需要的官网版本：</header>
      <main>
        <gw-pro-widget v-for="i of products" :key="i.id"
          v-if="!isKaOnly || i.name === '升级版精品官网'"
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
        <span v-if="salesIdLocked || isBxSales">
          {{ displayBxSalesId || userInfo.salesId }}
        </span>
        <span v-else>
          <el-input v-model.trim="inputSalesId"
            placeholder="如有服务编号请您填写">
          </el-input>
        </span>
      </div>
      <div v-if="!isBxUser" style="margin-top: 35px;">
        <aside>用户ID:</aside>
        <span>
          <span v-if="userIdLocked">
            {{ displayUserId }}
          </span>
          <el-input v-else
            v-model.trim="inputUserId" placeholder="用户 ID">
          </el-input>
        </span>
      </div>
      <div class="price">
        <aside>百姓网余额需支付:</aside>
        <span>{{ '￥' + totalPrice }}</span>
      </div>
      <div class="terms">
        <el-checkbox :value="true"></el-checkbox>
        <label>我已阅读并同意遵守</label>
        <a download="百姓网精品官网入驻协议.docx"
          v-bind:href="contractDocx">
          《百姓网精品官网入驻协议》
        </a>
      </div>
      <div class="submit">
        <button class="buy-btn" @click="createOrder">
          {{ submitButtonText }}
        </button>
        <span v-if="orderPayUrl">
          <label :title="orderPayUrl">
            {{ '付款链接: ' + orderPayUrl }}
          </label>
          <Clipboard :content="orderPayUrl"></Clipboard>
        </span>
      </div>
      <footer>
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

import { assetHost } from 'config'

import {
  createOrder
} from 'api/fengming'

import {
  getUserIdFromBxSalesId,
  getUserInfo
} from 'api/account'

import {
  getOrderPayUrl,
  payOrders
} from 'api/order'

import {
  allowGetOrderPayUrl,
  allowSeeKaOnly,
  allowPayOrder
} from 'util/fengming-role'

import {
  normalizeRoles
} from 'util/role'

import store from './store'

export default {
  name: 'gw-charge',
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
  fromMobx: {
    products: () => store.products
  },
  data() {
    return {
      checkedProductId: 4,
      orderPayUrl: '',

      salesIdLocked: false,
      displayBxSalesId: '',
      userIdLocked: false,
      displayUserId: '',
      inputSalesId: '',
      inputUserId: ''
    }
  },
  filters: {
    centToYuan
  },
  computed: {
    isAgentSales() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('AGENT_SALES')
    },
    isKaOnly() {
      const { roles, id } = this.userInfo
      return allowSeeKaOnly(roles, id)
    },
    isBxUser() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('BAIXING_USER')
    },
    isBxSales() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('BAIXING_SALES')
    },
    allowDiscount() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('AGENT_ACCOUNTING')
    },
    checkedProducts() {
      return this.products.filter(p => p.id === this.checkedProductId)
    },
    submitButtonText() {
      const { userInfo } = this
      if (this.isBxUser) {
        return '确认购买'
      }

      if (allowGetOrderPayUrl(userInfo.roles)) {
        return '生成链接'
      }

      return '确认购买'
    },
    totalPrice() {
      // 目前就一个 :)
      const p = this.checkedProducts.map(p => p.price).pop()
      return centToYuan(p)
    },
    contractDocx() {
      return assetHost + 'baixing-custom-website-contract.docx'
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
    async getFinalSalesId() {
      const { sales_id: salesId } = this.$route.query
      if (salesId) {
        return salesId
      }

      const {
        inputSalesId,
        userInfo
      } = this

      if (inputSalesId) {
        const id = await getUserIdFromBxSalesId(inputSalesId)
        return id
      }

      if (this.isBxUser) {
        return
      }

      return userInfo.id
    },
    async getFinalUserId() {
      const { user_id: userId } = this.$route.query
      if (userId) {
        return userId
      }

      const { inputUserId } = this
      if (inputUserId) {
        return inputUserId
      }

      const { userInfo } = this
      return userInfo.id
    },
    async payOrders(oids) {
      const {
        userInfo
      } = this

      if (!allowPayOrder(userInfo.roles)) {
        return
      }

      await payOrders(oids)
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
        checkedProductId: id
      } = this

      if (!id) {
        return Message.error('请先选择产品')
      }

      const order = {
        userId: await this.getFinalUserId(),
        products: [{
          id
        }]
      }

      const sid = await this.getFinalSalesId()
      if (sid) {
        order.salesId = sid
      }

      const oids = await createOrder(order)

      await this.getOrderPayUrl(oids)

      await this.payOrders(oids)

      Message.success('购买成功')
    }
  },
  async mounted() {
    const { sales_id: salesId, user_id: userId } = this.$route.query

    if (salesId) {
      const userInfo = await getUserInfo(salesId)
      this.displayBxSalesId = userInfo.salesId
      this.salesIdLocked = true
    }

    if (userId) {
      this.userIdLocked = true
      this.displayUserId = userId
    }

    await store.getProducts()
  }
}
</script>

<style scoped>
@import "cssbase/mixin";

.buy-btn {
  @mixin center;
  width: 110px;
  height: 35px;
  margin-top: 30px;
  border-radius: 4px;
  background: #ff7533;
  color: white;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.29;
  cursor: pointer;
}

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

    & > div.price {
      margin-top: 25px;

      & > span {
        font-size: 18px;
        color: #ff1f0e;
      }
    }

    & > div.terms {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding-left: 320px;
      margin: 10px 0;

      & a {
        color: #48576a;
        cursor: pointer;
      }

      & .el-checkbox {
        margin-right: 10px;
      }
    }

    & > div.submit {
      margin-top: 30px;

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
