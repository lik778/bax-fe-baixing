<template>
  <div class="xianshi">
    <div class="gw-container">
      <card class="gw-card" v-for="(pkg, index) in pkgs" :key="index"
      :title="pkg.name" :price="pkg.products.reduce((a, b) => a + b.price, 0)" :originalPrice="pkg.products.reduce((a, b) => a + b.originalPrice, 0)" :flag="pkg.flag"
      :active="checkedPkg === pkg" @click.native="checkedPkg = pkg">
        <div class="gw-content">
          <p v-for="(product, index) in pkg.products" :key="index">
            <span class="price">{{f2y(product.productType === 3 ? product.price : product.originalPrice / 2)}}元</span><span>{{product.name}}</span>
          </p>
        </div>
      </card>
    </div>
    <section>
      <h3 class="title">订单信息</h3>
      <div class="price-list">
        <order
          :products="checkedProductsWithDiscount"
          :has-discount="!!checkedProductDiscounts.length"
          @discount-total="total => discountTotal = total"
          @price-total="total => priceTotal = total"
        >
          <p><strong class="tag">赠</strong>精品官网买一送一</p>
        </order>
      </div>

      <div class="info">
        <section class="price-summary">
          <div>
            <aside>百姓网余额需支付：</aside>
            <i>{{(discountTotal / 100).toFixed(2) + '元'}}</i>
          </div>
        </section>
        <section class="sales-code">
          <aside>服务编号：</aside>
          <span v-if="salesIdLocked || isBxSales">
            {{ displayBxSalesId || user.salesId }}
          </span>
          <span v-else>
            <input placeholder="如有服务编号请您填写" v-model.trim="inputSalesId"/>
            <i class="el-icon-check" title="检测服务编号" @click="checkInputSalesId"/>
          </span>
        </section>
        <section v-if="displayUserMobile" class="user-mobile">
          <aside>用户手机号：</aside>
          <span>{{ displayUserMobile }}</span>
        </section>
        <contract-ack type="contract" />
        <section class="pay-info">
          <button
            v-if="!isAgentSales"
            class="pay-order"
            :loading="payInProgress"
            @click="createOrder"
            :disabled="status !== '进行中'"
          >
            {{ submitButtonText }}
          </button>
          <span v-if="orderPayUrl">
            <label :title="orderPayUrl">{{ '付款链接: ' + orderPayUrl }}</label>
            <clipboard :content="orderPayUrl" />
          </span>
        </section>
      </div>
    </section>
    <rules />
  </div>
</template>

<script>
import SimpleCard from './SimpleCard'
import Order from './Order'
import Card from './Card'
import ContractAck from 'com/widget/contract-ack'
import Rules from './Rules'
import { Message, MessageBox } from 'element-ui'
import Clipboard from 'com/widget/clipboard'

import { centToYuan as f2y } from 'utils'
import { normalizeRoles } from 'util/role'
import {
  allowGetOrderPayUrl,
  allowPayOrder,
  allowUseKaPackage
} from 'util'

import track from 'util/track'

import {
  getUserIdFromBxSalesId,
  queryUserInfo,
  getUserInfo
} from 'api/account'
import { createOrder } from 'api/fengming'
import {
  getOrderPayUrl,
  payOrders
} from 'api/order'

const pkgs = [
  {
    name: '精品官网',
    flag: '买一送一',
    products: [{
      productType: 4,
      name: '精品官网买1年送1年',
      originalPrice: 240000,
      price: 120000
    }]
  }, {
    name: '精品官网超值包',
    flag: '买一送一再减200',
    products: [{
      productType: 3,
      name: '推广资金',
      originalPrice: 58800,
      price: 58800
    }, {
      productType: 4,
      name: '精品官网买1年送1年',
      originalPrice: 240000,
      price: 100000
    }]
  }, {
    name: '精品官网特惠包',
    flag: '买一送一再减600',
    products: [{
      productType: 3,
      name: '推广资金',
      originalPrice: 508800,
      price: 508800
    }, {
      productType: 4,
      name: '精品官网买1年送1年',
      originalPrice: 240000,
      price: 60000
    }]
  }
]

export default {
  name: 'mansong',
  props: {
    status: String,
    userDiscounts: Array,
    userId: String,
    salesId: String,
    user: Object
  },
  components: {
    SimpleCard,
    Card,
    ContractAck,
    Order,
    Rules,
    Clipboard
  },
  data () {
    return {
      pkgs,
      checkedPkg: pkgs[0],

      checkedProductsWithDiscount: [],
      priceTotal: 0,
      discountTotal: 0,

      displayBxSalesId: '',
      salesIdLocked: false,
      displayUserMobile: '',
      inputSalesId: '',
      payInProgress: false,
      orderPayUrl: '',
    }
  },
  computed: {
    checkedProducts() {
      return this.checkedPkg.products
    },
    checkedProductDiscounts() {
      if (this.userDiscounts.length) {
        const types = this.checkedProducts.map(p => p.productType)

        return this.userDiscounts
          .filter(d => types.includes(d.productType))
      }
      return []
    },
    isAgentSales() {
      const roles = normalizeRoles(this.user.roles)
      return roles.includes('AGENT_SALES')
    },
    isBxUser() {
      const roles = normalizeRoles(this.user.roles)
      return roles.includes('BAIXING_USER')
    },
    isBxSales() {
      const roles = normalizeRoles(this.user.roles)
      return roles.includes('BAIXING_SALES')
    },
    submitButtonText() {
      if (this.status === '预热中') {
        return '即将开始'
      } else if (this.status === '已结束') {
        return '已结束'
      }
      if (this.isBxUser) {
        return '确认购买'
      }

      if (allowGetOrderPayUrl(this.user.roles)) {
        return '生成链接'
      }

      return '确认购买'
    },
  },
  methods: {
    f2y,
    getDiscountPrice(productType, price) {
      const userDiscounts = this.userDiscounts
        .filter(d => d.productType === productType)

      let p = price

      for (const d of userDiscounts) {
        p = p - ((p * d.percentage / 100) | 0)
      }

      return p | 0
    },
    async payOrders(oids) {
      if (!allowPayOrder(this.user.roles)) {
        return
      }

      await payOrders(oids)
    },
    async getOrderPayUrl(oids, summary) {
      if (!allowGetOrderPayUrl(this.user.roles)) {
        return
      }

      const url = await getOrderPayUrl(oids, summary)

      this.orderPayUrl = url

      if (this.isBxUser) {
        setTimeout(() => {
          location.href = url
        }, 800)
      }
    },
    async checkInputSalesId() {
      const { inputSalesId } = this
      if (!inputSalesId) {
        return Message.error('请填写销售编号')
      }

      await getUserIdFromBxSalesId(inputSalesId)

      Message.success('销售编号可用')
    },
    async getFinalSalesId() {
      if (this.salesId) {
        return this.salesId
      }

      const {
        inputSalesId,
        user
      } = this

      if (inputSalesId) {
        const id = await getUserIdFromBxSalesId(inputSalesId)
        return id
      }

      if (this.isBxUser) {
        return
      }

      return user.id
    },
    getFinalUserId() {
      return this.userId || this.user.id
    },
    async createOrder() {
      if (allowUseKaPackage([], this.user.id)) {
        return alert('您不在本次活动参与范围之内')
      }
      track({
        action: 'click-buy: huodong1',
        baxId: this.user.id
      })

      const newOrder = {
        activity: '181111p1',
        userId: this.getFinalUserId()
      }

      const sid = await this.getFinalSalesId()
      if (sid) {
        newOrder.salesId = sid
      }

      if (this.checkedProducts.length === 0) {
        return Message.error('请选择购买的产品 ~')
      }

      const chargeProduct = this.checkedProducts.find(p => p.productType === 3)
      if (chargeProduct && chargeProduct.price < 100 * 100) {
        return Message.error('最低充值金额100元')
      }

      newOrder.products = this.checkedProducts.map(p => {
        return {
          price: p.originalPrice,
          id: p.productType // ?
        }
      })

      const codes = this.checkedProductDiscounts.map(d => d.code)
      if (codes.length) {
        newOrder.discountCodes = [...codes]
      }

      if (!this.isBxUser) {
        try {
          await MessageBox.confirm('是否购买 ?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
        } catch (err) {
          return
        }
      }

      this.payInProgress = true

      try {
        const oids = await createOrder(newOrder)

        if (this.discountTotal !== 0) {
          await this.getOrderPayUrl(oids)

          await this.payOrders(oids)
        } else {
          this.orderPayUrl = '0元订单无需支付'
          this.payDialogVisible = true
        }
        Message.success('创建订单成功')
      } catch (e) {
        console.error(e)
      }
      this.payInProgress = false
      this.couponVisible = false
    },
  },
  async mounted() {

    if (this.salesId) {
      const userInfo = await getUserInfo(this.salesId)
      this.displayBxSalesId = userInfo.salesId
      this.salesIdLocked = true
    }

    if (this.userId) {
      const info = await queryUserInfo(this.userId)
      if (info.mobile) {
        this.displayUserMobile = info.mobile
      }
    }
    this.checkedPkg = this.pkgs[1]

    setTimeout(() => {
      track({
        action: 'enter-page: huodong1',
        baxId: this.user.id
      })
    }, 1200)
  },
  watch: {
    checkedProducts: {
      handler (checked) {
        this.checkedProductsWithDiscount = checked.map(p => {
          return {
            ...p,
            discountPrice: this.getDiscountPrice(p.productType, p.price)
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="postcss">
.gw-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  & > .gw-card {
    width: 321px;
    margin-bottom: 27px;

    & > .content > .gw-content {
      height: 55px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 20px;
      & > p {
        margin-bottom: 5px;
        margin-top: 5px;

        & > span:first-of-type {
          display: inline-block;
          width: 70px;
          margin-right: 10px;
        }
      }
    }
  }
}

div.xianshi > section {
  padding: 27px 13px 27px 35px;
  border-radius: 8px;
  color: #fff;
  background-color: #380098;
  margin-bottom: 20px;

  & > .title {
    margin-top: 0;
    margin-bottom: 16px;
    padding-bottom: 10px;
    font-size: 18px;
    border-bottom: 1px solid #5D00C6;
  }



  & > .info {
    display: flex;
    flex-flow: column;
    align-items: flex-end;
    justify-content: center;
    margin-top: 30px;
    width: 610px;
    padding-right: 35px;
    padding-bottom: 34px;

    & > .price-summary {
      & > div:first-child {
        & > aside {
          font-size: 14px;
        }

        & > i {
          font-size: 22px;
          font-weight: 500;
          color: #FFD500;
        }
      }
    }

    & > .sales-code {
      display: flex;
      align-items: center;
      margin-top: 20px;

      & > aside {
        font-size: 14px;
      }

      & > span {
        display: flex;
        align-items: center;
        & > input {
          background-color: #5E00FF;
          width: 167px;
          height: 32px;
          border: none;
          color: #fff;
          border-radius: 4px;
          padding-left: 5px;
        }
        & > i {
          margin-left: 5px;
          font-size: 14px;
        }
      }
    }

    & > .pay-info {
      & > .pay-order {
        width: 110px;
        height: 32px;
        margin-top: 30px;
        border-radius: 4px;
        background-color: #FFD500;
        color: #5F00C9;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.29;
      }
      & > .pay-order[disabled] {
        color: #666;
        background-color: #DBDBDB;
      }

      & > span {
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 14px;

        & > label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 320px;
        }
      }
    }

    & > .user-mobile {
      margin: 20px 0 0;
      font-size: 14px;
    }
  }
}
</style>
