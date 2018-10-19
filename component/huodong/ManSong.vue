<template>
  <div class="mansong">
    <section>
      <h3 class="title">选择产品</h3>
      <p class="subtitle">选择充值推广资金</p>
      <div class="product-container">
        <simple-card v-for="(product, index) in products.slice(0,7)"
        :key="index" :price="product.price" :checked="checkedProducts.includes(product)"
        :editable="product.editable" class="simple-card" @click="toggleProduct(product)"
        @change="v => (product.price = v, product.originalPrice = v)" />
      </div>
      <p class="subtitle">选择精品官网</p>
      <card class="gw-card" v-for="(product, index) in products.slice(7)" :key="index"
      :title="product.name" :price="gw ? gw.price : product.price" :originalPrice="product.originalPrice" flag="热卖"
      :active="checkedProducts.includes(product)" @click.native="toggleProduct(product)">
        <div class="gw-content">
          <ul class="gw-info">
            <li>支持多端展示</li>
            <li>支持微信分享</li>
          </ul>
          <ul class="gw-info">
            <li>丰富媒体库</li>
            <li>支持多渠道落地页</li>
          </ul>
        </div>
      </card>
    </section>
    <section>
      <h3 class="title">订单信息</h3>
      <div class="price-list">
        <order
          :products="checkedProductsWithDiscount"
          :has-discount="!!checkedProductDiscounts.length"
          @discount-total="total => discountTotal = total"
          @price-total="total => priceTotal = total"
        >
        <p>
          <span v-if="currentManSong.length"><strong class="tag">满送</strong>已送<strong>{{f2y(currentManSong[1])}}元.</strong></span>
          <span v-if="nextManSong.length">购买<strong>{{f2y(nextManSong[0])}}元</strong>可送<strong>{{f2y(nextManSong[1])}}</strong>元</strong>，还差<strong>{{f2y(nextManSong[0] - priceTotal)}}元</strong></span>
        </p>
        <p v-if="gw && gw.originalPrice - gw.price > 0">
          <strong class="tag">减</strong>同时购买精品官网（365天）立减<strong>{{f2y(gw.originalPrice - gw.price)}}元</strong>
        </p>
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

const products = [
  {
    id: 1,
    productType: 3,
    name: '推广资金',
    originalPrice: 28800,
    price: 28800
  }, {
    id: 2,
    productType: 3,
    name: '推广资金',
    originalPrice: 58800,
    price: 58800
  }, {
    id: 3,
    productType: 3,
    name: '推广资金',
    originalPrice: 108800,
    price: 108800
  }, {
    id: 4,
    productType: 3,
    name: '推广资金',
    originalPrice: 308800,
    price: 308800
  }, {
    id: 5,
    productType: 3,
    name: '推广资金',
    originalPrice: 508800,
    price: 508800
  }, {
    id: 6,
    productType: 3,
    name: '推广资金',
    originalPrice: 1018800,
    price: 1018800
  }, {
    id: 7,
    productType: 3,
    name: '推广资金',
    editable: true,
    originalPrice: 0,
    price: 0
  }, {
    id: 8,
    productType: 4,
    name: '精品官网365天',
    originalPrice: 120000,
    price: 120000
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
      products,
      rules: [[100000, 5000], [400000, 35000], [1000000, 150000]], // 满，送
      checkedProducts: [],
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
    checkedProductDiscounts() {
      if (this.userDiscounts.length) {
        const types = this.checkedProducts.map(p => p.productType)

        return this.userDiscounts
          .filter(d => types.includes(d.productType))
      }
      return []
    },
    gw() {
      return this.checkedProductsWithDiscount.find(p => p.productType === 4)
    },
    currentManSong() {
      let current = []
      for (let rule of this.rules) {
        if (this.priceTotal >= rule[0]) {
          current = rule
        }
      }
      return current
    },
    nextManSong() {
      const index = this.rules.indexOf(this.currentManSong)
      if (index < 0) {
        return this.rules[0]
      }
      if (index === this.rules.length - 1) {
        return []
      }
      return this.rules[index + 1]
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
    toggleProduct (product) {
      const index = this.checkedProducts.indexOf(product)
      if (index > -1) {
        this.checkedProducts.splice(index, 1)
      } else {
        const chargeProduct = this.checkedProducts.find(p => p.productType === 3)
        if (chargeProduct && product.productType === 3) {
          const index = this.checkedProducts.indexOf(chargeProduct)
          this.checkedProducts.splice(index, 1)
        }
        this.checkedProducts.push(product)
      }
      this.$emit('checked-products', this.checkedProducts)
    },
    getDiscountPrice(productType, price) {
      const userDiscounts = this.userDiscounts
        .filter(d => d.productType === productType)

      let p = price

      for (const d of userDiscounts) {
        p = p - ((p * d.percentage / 100) | 0)
      }

      return p | 0
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
    async getFinalUserId() {
      return this.userId || this.user.id
    },
    async createOrder() {
      if (allowUseKaPackage([], this.user.id)) {
        return alert('您不在本次活动参与范围之内')
      }
      track({
        action: 'click-buy: huodong2',
        baxId: this.user.id
      })

      const newOrder = {
        activity: '181111p2',
        userId: await this.getFinalUserId()
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
  },
  async mounted() {
    this.checkedProducts = [this.products[1], this.products[7]]

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

    setTimeout(() => {
      track({
        action: 'enter-page: huodong2',
        baxId: this.user.id
      })
    }, 1200)
  },
  watch: {
    checkedProducts: {
      handler (checked) {
        const charge = checked.find(p => p.productType === 3)
        const gw = checked.find(p => p.productType === 4)

        if (charge && gw) {
          let gwPrice = gw.price
          if (charge.price < 58800) {
          } else if (charge.price < 508800) {
            gwPrice = gw.price - 20000
          } else if (charge.price < 1018800) {
            gwPrice = gw.price - 60000
          } else {
            gwPrice = gw.price - 120000
          }
          this.checkedProductsWithDiscount = checked.map(p => {
            return {
              ...p,
              price: p.productType === 4 ? gwPrice : p.price,
              discountPrice: this.getDiscountPrice(p.productType, p.productType === 4 ? gwPrice : p.price)
            }
          })
        } else {
          this.checkedProductsWithDiscount = checked.map(p => {
            return {
              ...p,
              discountPrice: this.getDiscountPrice(p.productType, p.price)
            }
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="postcss">
div.mansong > section {
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

  & > .gw-card {
    width: 321px;
  }

  & > .product-container {
    display: flex;
    flex-wrap: wrap;

    & > .simple-card {
      margin-right: 40px;
      margin-bottom: 27px;
    }
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

.gw-content {
  display: flex;
  justify-content: center;
  align-items: center;
  & > .gw-info {
    padding-inline-start: 25px;
    margin-block-start: 0;
    margin-block-end: 0;
  }
}
</style>
