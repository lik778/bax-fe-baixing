
<template>
  <div class="qwt-charge">
    <topbar :user-info="userInfo" :back="false">
    </topbar>
    <main>
      <step :mode="mode" :step="currentStep" />
      <section class="qwt-product">
        <header>
          1. 选择产品
        </header>
        <div v-if="mode === 'buy-service'"
          class="package">
          <header>
            选择优惠套餐：
          </header>
          <main>
            <qwt-pkg-widget v-for="i of packages" :key="i.id"
              :name="i.name" :products="i.products"
              :checked="packageChecked(i.id)"
              @click="checkPackage(i.id)">
            </qwt-pkg-widget>
          </main>
        </div>
        <div class="charge">
          <header>
            叠加推广资金包：
          </header>
          <main>
            <section>
              <qwt-pro-widget v-for="i of allProducts.slice(0, 4)" :key="mode + i.id"
                :price="i.price" :title="i.title" :editable="i.editable"
                :highlight="mode === 'charge-only'"
                :checked="chargeProductChecked(i.id)"
                @click="checkChargeProduct(i.id)"
                @set-money="setChargeMoney">
              </qwt-pro-widget>
            </section>
            <section>
              <qwt-pro-widget v-for="i of allProducts.slice(4)" :key="mode + i.id"
                :price="i.price" :title="i.title" :editable="i.editable"
                :highlight="mode === 'charge-only'"
                :checked="chargeProductChecked(i.id)"
                @click="checkChargeProduct(i.id)"
                @set-money="setChargeMoney">
              </qwt-pro-widget>
            </section>
          </main>
        </div>
      </section>

      <section class="qwt-order">
        <header>
          2. 核对订单
        </header>

        <div class="price-list">
          <price-list :products="checkedProducts"
            :has-discount="!!checkedProductDiscounts.length">
          </price-list>
        </div>

        <div class="coupon" v-if="!allowDiscount">
          <header>
            <span>
              <el-checkbox v-model="couponVisible">使用优惠券</el-checkbox>
              <i>{{'有' + effectiveCoupons.length + '张可用优惠券'}}</i>
            </span>
            <span>{{'-' + (couponAmount / 100).toFixed(2) + '元'}}</span>
          </header>
          <div v-if="couponVisible">
            <el-tabs v-model="activeCouponTab">
              <el-tab-pane label="可用优惠券" name="first" class="coupon-pane">
                <coupon
                  v-for="coupon in effectiveCoupons"
                  :key="coupon.id"
                  :coupon="displayCoupon(coupon)"
                  class="coupon"
                  @click="onCouponClick(coupon)"
                  :selected="selectedCoupon.includes(coupon)"/>
                  <p v-if="effectiveCoupons.length === 0">暂无可用优惠券</p>
              </el-tab-pane>
              <el-tab-pane label="优惠码兑换" name="second" class="coupon-code-pane">
                <el-input class="coupon-code-input" style="width: 200px"
                  v-model.trim="couponCode" placeholder="输入优惠码" />
                <el-button type="primary" style="margin-left: 16px;"
                  @click="redeem">确认</el-button>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <div class="info">
          <section class="price-summary">
            <div>
              <aside>百姓网余额需支付：</aside>
              <i>{{(finalPrice / 100).toFixed(2) + '元'}}</i>
            </div>
          </section>
          <section class="sales-code">
            <aside>服务编号：</aside>
            <span v-if="salesIdLocked || isBxSales">
              {{ displayBxSalesId || userInfo.salesId }}
            </span>
            <span v-else>
              <el-input v-model.trim="inputSalesId"
                placeholder="如有服务编号请您填写">
              </el-input>
              <i class="el-icon-check" title="检测服务编号"
                @click="checkInputSalesId"></i>
            </span>
          </section>
          <section class="user-mobile"
            v-if="displayUserMobile">
            <aside>用户手机号：</aside>
            <span>
              {{ displayUserMobile }}
            </span>
          </section>
          <contract-ack type="contract" />
          <promotion-area-limit-tip :all-areas="allAreas" page="charge" />
          <section class="pay-info">
            <button v-if="!isAgentSales" class="pay-order"
              @click="createOrder" :loading="payInProgress">
              {{ submitButtonText }}
            </button>
            <span v-if="orderPayUrl">
              <label :title="orderPayUrl">
                {{ '付款链接: ' + orderPayUrl }}
              </label>
              <Clipboard :content="orderPayUrl"></Clipboard>
            </span>
          </section>
        </div>

        <footer>
          <li>推广资金使用规则：</li>
          <li>1. 该产品购买后，精品官网及推广资金不可退款，如有疑问请致电客服400-036-3650；</li>
          <li>2. 该精品官网及推广资金自购买之日起有效期为365天，请在有效期内使用；</li>
          <li>3. 详细推广记录请在【全网通】-【数据报表】查看。</li>
        </footer>
      </section>
    </main>

    <el-dialog title="提示"
      :visible.sync="payDialogVisible">
      <h3 class="hint-text">订单支付成功，资金已到账！</h3>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$router.push({name: 'account'})">
          查看账户
        </el-button>
        <el-button type="primary" @click="$router.push({name: 'qwt-create-promotion'})">
          创建投放计划
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import ContractAck from 'com/widget/contract-ack'
import QwtPkgWidget from 'com/widget/qwt-pkg'
import QwtProWidget from 'com/widget/qwt-pro'
import Clipboard from 'com/widget/clipboard'
import FlatBtn from 'com/common/flat-btn'
import Coupon from 'com/common/coupon'
import PriceList from './price-list'
import Topbar from 'com/topbar'

import { Message } from 'element-ui'
import uuid from 'uuid/v4'

import Step from './step'

import { centToYuan } from 'utils'

import gStore from '../store'
import store from './store'

import track from 'util/track'

import { displayCoupon } from 'util/meta'

import {
  allowGetOrderPayUrl,
  allowPayOrder
} from 'util/fengming-role'

import {
  usingCondition
} from 'constant/coupon'

import {
  normalizeRoles
} from 'util/role'

import {
  createOrder
} from 'api/fengming'

import {
  getUserIdFromBxSalesId,
  queryUserInfo,
  getUserInfo
} from 'api/account'

import {
  getOrderPayUrl,
  payOrders
} from 'api/order'

import {
  redeemCoupon
} from 'api/meta'

/**
 * 关于推广资金的产品说明:
 *   1. 推广资金的产品只有 1 个, 客户自由定价
 *   2. 前端展示多个产品
 */

const allProducts = [
  {
    id: 1,
    price: 288
  }, {
    id: 2,
    price: 588
  }, {
    id: 3,
    price: 1088
  }, {
    id: 4,
    price: 3088
  }, {
    id: 5,
    title: '购买其他金额',
    editable: true
  }, {
    id: 0,
    title: '下次再充值'
  }
]

export default {
  name: 'qwt-charge',
  components: {
    PromotionAreaLimitTip,
    QwtPkgWidget,
    QwtProWidget,
    ContractAck,
    Clipboard,
    PriceList,
    FlatBtn,
    Topbar,
    Coupon,
    Step
  },
  fromMobx: {
    usingConditions: () => store.usingConditions,
    allDiscounts: () => store.allDiscounts,
    packages: () => store.packages,
    products: () => store.products,
    coupons: () => store.coupons
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      actionTrackId: uuid(),
      currentStep: 2,
      allProducts,

      salesIdLocked: false,
      displayUserMobile: '',
      displayBxSalesId: '',
      inputSalesId: '',

      orderPayUrl: '',
      checkedPackageId: 0,
      checkedChargeProductId: 0, // 注: 此 id 仅用于前端标记
      chargeMoney: 0,

      couponVisible: false,
      activeCouponTab: 'first',
      selectedCoupon: [],
      // 支持以后使用多种优惠券
      couponCode: '',
      payInProgress: false,
      payDialogVisible: false
    }
  },
  computed: {
    productSummary() {
      var a = this.checkedProducts.reduce((s, p) => {
        if (s[p.id] === undefined) {
          s[p.id] = 0
        }
        s[p.id] += p.discountPrice
        return s
      }, {})
      return a
    },
    effectiveCoupons() {
      // 返回符合当前购买产品等条件的可用券
      return this.coupons.filter(coupon => {
        let products = this.checkedProducts
        for (const condition of coupon.usingConditions) {
          if (condition.type === usingCondition.PRODUCT_PACKAGES) {
            products = products.filter(p => condition.productPackages.includes(p.pkgId))
          } else if (condition.type === usingCondition.PRODUCTS) {
            products = products.filter(p => condition.products.includes(p.id))
          }
        }
        if (products.length === 0) {
          return false
        }
        for (const condition of coupon.usingConditions) {
          if (condition.type === usingCondition.ORDER_SUM_ORIGINAL_PRICE) {
            const sum = products.reduce((s, p) => {
              s += p.discountPrice
              return s
            }, 0)
            return sum >= condition.orderSumOriginalPrice
          }
        }
        return true
      })
    },
    finalPrice() {
      if (this.totalPrice >= this.couponAmount) {
        return this.totalPrice - this.couponAmount
      } else {
        return 0
      }
    },
    couponAmount() {
      return this.selectedCoupon.reduce((a, b) => a + b.amount, 0)
    },
    isAgentSales() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('AGENT_SALES')
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
    checkedProductDiscounts() {
      if (!this.allowDiscount) {
        return []
      }

      const types = this.checkedProducts.map(p => p.type)

      return this.allDiscounts
        .filter(d => types.includes(d.productType))
    },
    checkedProductDesc() {
      const { checkedPackageId } = this

      const p = this.packages.find(p => p.id === checkedPackageId)
      const name = (p && p.name) || ''

      let h1 = '0'
      let h2 = '0'
      let h3 = '0'

      this.checkedProducts.forEach(p => {
        if (p.name === '精品官网') {
          h1 = p.amount
          return
        }

        if (p.isPkg) {
          h2 = centToYuan(p.discountPrice)
          return
        }

        h3 = centToYuan(p.discountPrice)
      })

      return this.mode === 'charge-only' ? `推广资金：${h3}元`
        : `${name}（精品官网：${h1}天，推广资金：${h2}元），推广资金包：${h3}元`
    },
    checkedProducts() {
      const {
        checkedChargeProductId,
        checkedPackageId,
        chargeMoney,
        productType,
        productId
      } = this

      const pkg = this.packages
        .filter(p => p.id === checkedPackageId)
        .pop()

      let products = []

      if (pkg) {
        products = pkg.products.map(p => {
          return {
            discountPrice: this.getDiscountPrice(p.productType, p.price),
            originalPrice: p.selfPriceAdjust ? p.price : p.showPrice,
            type: p.productType,
            amount: p.amount,
            price: p.price,
            name: p.name,
            isPkg: true,
            pkgId: checkedPackageId,
            id: p.id
          }
        })
      }

      if (checkedChargeProductId && chargeMoney) {
        products.push({
          discountPrice: this.getDiscountPrice(productType, chargeMoney),
          originalPrice: chargeMoney,
          price: chargeMoney,
          type: productType,
          name: '推广资金包',
          id: productId
        })
      }

      return products
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
      const p = this.checkedProducts.map(i => i.discountPrice)

      return p.reduce((a, b) => a + b, 0)
    },
    productType() {
      // TODO 目前: products.length === 1
      return this.products.map(p => p.productType).pop()
    },
    productId() {
      // TODO 目前: products.length === 1
      return this.products.map(p => p.id).pop()
    },
    mode() {
      // mode: charge-only, buy-service
      return this.$route.query.mode || 'buy-service'
    }
  },
  methods: {
    displayCoupon,
    onCouponClick(coupon) {
      if (this.selectedCoupon.length) {
        this.selectedCoupon.splice(0, 1)
      }
      this.selectedCoupon.splice(0, 0, coupon)
    },
    async redeem() {
      if (!this.couponCode) {
        return
      }
      const result = await redeemCoupon(this.couponCode)
      if (result === 0) {
        this.$message.error('兑换失败')
        return
      }
      this.$message.success('兑换成功')
      await store.getCoupons({ onlyValid: true, status: 0 })
    },
    empty() {
      this.orderPayUrl = ''
      this.checkedPackageId = 0
      this.checkedChargeProductId = 0
      this.chargeMoney = 0
    },
    async init() {
      this.empty()

      await Promise.all([
        store.getProductDiscounts([1, 2, 3, 4]),
        store.getProductPackages(1),
        store.getProducts(3)
      ])

      setTimeout(() => {
        const { mode } = this
        const pkg = this.packages[0]
        const pro = this.allProducts[0]

        if (mode === 'buy-service') {
          this.checkPackage(pkg.id)
          this.checkChargeProduct(pro.id)
          this.setChargeMoney(pro.price)
        } else if (mode === 'charge-only') {
          this.checkChargeProduct(pro.id)
          this.setChargeMoney(pro.price)
        }
      }, 100)
    },
    packageChecked(id) {
      return this.checkedPackageId === id
    },
    checkPackage(id) {
      this.checkedPackageId = id
    },
    chargeProductChecked(id) {
      return this.checkedChargeProductId === id
    },
    checkChargeProduct(id) {
      this.checkedChargeProductId = id
    },
    setChargeMoney(v) {
      this.chargeMoney = (v * 100) | 0
    },
    getDiscountPrice(productType, price) {
      if (!this.allowDiscount) {
        return price
      }

      const discounts = this.allDiscounts
        .filter(d => d.productType === productType)

      let p = price

      for (const d of discounts) {
        p = p - ((p * d.percentage / 100) | 0)
      }

      return p | 0
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
    async getOrderPayUrl(oids, summary) {
      const {
        userInfo
      } = this

      if (!allowGetOrderPayUrl(userInfo.roles)) {
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

      const { userInfo } = this
      return userInfo.id
    },
    async createOrder() {
      const {
        checkedChargeProductId,
        checkedPackageId,
        actionTrackId,
        chargeMoney,
        productId,
        userInfo
      } = this

      const newOrder = {
        userId: await this.getFinalUserId()
      }

      const sid = await this.getFinalSalesId()
      if (sid) {
        newOrder.salesId = sid
      }

      if (this.mode === 'buy-service' && !checkedPackageId) {
        return Message.error('必须选择一个全网通套餐包')
      }

      if (!checkedChargeProductId && !checkedPackageId) {
        return Message.error('请选择购买的产品 ~')
      }

      if (checkedChargeProductId && chargeMoney) {
        newOrder.products = [{
          price: chargeMoney,
          id: productId
        }]
      }

      if (checkedPackageId) {
        newOrder.packages = [{
          id: checkedPackageId
        }]
      }

      const codes = this.checkedProductDiscounts.map(d => d.code)
      if (codes.length) {
        newOrder.discountCodes = [...codes]
      }

      // 添加优惠券
      if (this.selectedCoupon.length) {
        newOrder.couponIds = this.selectedCoupon.map(c => c.id)
      }

      if (!this.isBxUser) {
        try {
          await this.$confirm('是否购买 ?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
        } catch (err) {
          return
        }
      }

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'click-button: charge',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId
      })

      this.currentStep = 3

      this.payInProgress = true

      try {
        const oids = await createOrder(newOrder)

        track({
          roles: userInfo.roles.map(r => r.name).join(','),
          action: 'create order success',
          baixingId: userInfo.baixingId,
          time: Date.now() / 1000 | 0,
          oids: oids.join(','),
          baxId: userInfo.id,
          actionTrackId
        })

        if (this.finalPrice !== 0) {
          const summary = this.checkedProductDesc

          await this.getOrderPayUrl(oids, summary)

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
    centToYuan
  },
  watch: {
    async couponVisible(v) {
      if (v) {
        // 必须先拿到 condition
        await store.getConditions()
        await store.getCoupons({ onlyValid: true, status: 0 })
      } else {
        this.selectedCoupon = []
      }
    },
    async mode() {
      this.init()
    }
  },
  async mounted() {
    const {
      sales_id: salesId,
      user_id: userId
    } = this.$route.query

    await this.init()

    setTimeout(() => {
      const { userInfo, actionTrackId } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        baixingId: userInfo.baixingId,
        action: 'enter-page: charge',
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId
      })
    }, 1200)

    if (salesId) {
      const userInfo = await getUserInfo(salesId)
      this.displayBxSalesId = userInfo.salesId
      this.salesIdLocked = true
    }

    if (userId) {
      const info = await queryUserInfo(userId)
      if (info.mobile) {
        this.displayUserMobile = info.mobile
      }
    }
  }
}
</script>

<style scoped>
@import "../../cssbase/var";
@import "cssbase/mixin";

.qwt-charge {
  width: 100%;

  & > main {
    width: 100%;
    padding: 10px 10px 30px 10px;
    background: var(--qwt-c-gray);
  }
}

.qwt-product, .qwt-order {
  margin-top: 10px;
  padding: 20px 0 10px 21px;
  border-radius: 4px;
  background: white;
}

.qwt-product {
  & > header {
    font-weight: 600;
    font-size: 14px;
    color: #333333;
  }

  & .package, & .charge {
    & > header {
      font-size: 14px;
      color: #666666;
      line-height: 1.5;
    }

    & > main {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
    }
  }

  & .package {
    margin-top: 20px;
  }

  & .charge {
    margin-top: 30px;

    & > main {
      flex-flow: column;

      & > section {
        display: flex;
      }
    }
  }
}

.qwt-order {
  & > header {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    color: #333333;
  }

  & > .price-list {
    margin-top: 20px;
  }

  & > .coupon {
    margin-top: 20px;
    width: 610px;
    padding: 15px 10px 20px;
    border: solid 1px #e6e6e6;

    & > header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px 0 20px;

      & > span:first-child {
        & > i {
          font-size: 12px;
          color: #666666;
        }
      }

      & > span:last-child {
        color: #333333;
      }
    }

    & .coupon {
      width: 310px;
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
    border-bottom: solid 1px #e6e6e6;

    & > .price-summary {
      & > div:first-child {
        & > aside {
          font-size: 14px;
          color: #666666;
        }

        & > i {
          font-size: 22px;
          font-weight: 500;
          color: #ff7533;
        }
      }
    }

    & > .sales-code {
      display: flex;
      align-items: center;
      margin-top: 20px;

      & > aside {
        font-size: 14px;
        color: #666666;
      }

      & > span {
        display: flex;
        align-items: center;

        & > i {
          margin-left: 5px;
          font-size: 14px;
          color: #666666;
        }
      }
    }

    & > .pay-info {
      & > .pay-order {
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
      }

      & > span {
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 14px;
        color: #333333;

        & > label {
          @mixin wordline;
          width: 320px;
        }
      }
    }

    & > .user-mobile {
      margin: 20px 0 0;
      font-size: 14px;
      color: #333333;
    }
  }

  & > footer {
    margin-top: 20px;
    font-size: 12px;
    line-height: 1.86;
    color: #999999;
  }
}

.qwt-pkg-widget {
  margin-right: 30px;
}

.qwt-pro-widget {
  margin: 0 30px 20px 0;
}

.tip {
  margin-bottom: 10px;
  margin-left: 5px;
  font-size: 12px;
  color: var(--c-tip-gray);
}

.hint-text {
  text-align: center;
  font-size: 1.5em;
}

.dialog-footer {
  text-align: center;
}

.tuoguan {
  position: relative;
  right: 10px;
}
</style>
