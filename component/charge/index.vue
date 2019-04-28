
<template>
  <div class="qwt-charge">
    <main>
      <section class="shadow">
        <step :step="currentStep" />
      </section>
      <section class="qwt-product shadow">
        <header>
          1. 选择产品 | <span class="discount-btn" @click="showDiscount = !showDiscount">查看优惠细则<i class="el-icon-question"></i></span>
        </header>
        <div class="discount-section" v-show="showDiscount">
          <p class="discount-info">满588元：<span class="red">赠</span>送十万火急 50 元现金券 <span class="mute">(满100元可用，不限城市与类目，有效期30天)；</span>同时购买精品官网（1年）官网<span class="red">减</span>立减 200 元；购买精品官网2年【送一年】官网<span class="red">减</span>立减 600 元</p>
          <p class="discount-info">满1088元：<span class="red">赠</span>送十万火急 80 元现金券 <span class="mute">(满200元可用，不限城市与类目，有效期30天)；</span>同时购买精品官网（1年）官网<span class="red">减</span>立减 200 元；购买精品官网2年【送一年】官网<span class="red">减</span>立减 600 元</p>
          <p class="discount-info">满3088元：<span class="red">赠</span>送十万火急 300 元现金券 <span class="mute">(满400元可用，不限城市与类目，有效期30天)；</span>同时购买精品官网（1年）官网<span class="red">减</span>立减 200 元；购买精品官网2年【送一年】官网<span class="red">减</span>立减 600 元</p>
          <p class="discount-info">满5088元：<span class="red">赠</span>送十万火急 300 元现金券 <span class="mute">(满400元可用，不限城市与类目，有效期30天)；</span>同时购买精品官网（1年）官网<span class="red">减</span>立减 600 元；购买精品官网2年【送一年】官网<span class="red">减</span>立减 1200 元</p>
          <p class="discount-info">满10188元：<span class="red">赠</span>送十万火急 300 元现金券 <span class="mute">(满400元可用，不限城市与类目，有效期30天)；</span>同时购买精品官网（1年）官网<span class="red">减</span>立减 1000 元；购买精品官网2年【送一年】官网<span class="red">减</span>立减 1400 元</p>
        </div>
        <div class="charge">
          <header>选择充值推广资金包：</header>
          <main>
            <section>
              <price-tag v-for="(product, index) in allProducts.slice(0, 7)" :key="index"
                :editable="product.editable" :price="product.price"
                :checked="checkedProducts.includes(product)"
                @click="toggleProduct(product)"
                @change="v => product.price = v">
              </price-tag>
            </section>
            <div>
              <p class="discount-info" v-html="promotionDiscount"></p>
            </div>
          </main>

          <header>选择精品官网</header>
          <main>
            <section>
              <gw-pro-widget
                v-for="(product, index) of allProducts.slice(7)" :key="index"
                :title="product.name"
                :original-price="centToYuan(product.price)"
                :price="gwPrice"
                :checked="checkedProducts.includes(product)"
                :is-hot="product.isHot"
                @click.native="toggleProduct(product)"
              />
            </section>
          </main>
        </div>
      </section>

      <section class="qwt-order shadow">
        <header>
          2. 核对订单
        </header>

        <div class="price-list">
          <price-list
            :products="fullCheckedProducts"
            :has-discount="!!checkedProductDiscounts.length"
            :discount-infos="discountInfos"
          />
        </div>

        <div class="coupon" v-if="!isAgentAccounting">
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
                  :selected="selectedCoupon.includes(coupon)"
                />
                <p v-if="effectiveCoupons.length === 0">暂无可用优惠券</p>
                <hr class="hr">
                <coupon
                  v-for="(coupon, index) in ineffectiveCoupons" :key="index"
                  :coupon="displayCoupon(coupon)"
                  class="coupon"
                  :disabled="true"
                  >
                </coupon>

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
              <el-input
                placeholder="如有服务编号请您填写"
                v-model.trim="inputSalesId"
              />
              <i
                class="el-icon-check"
                title="检测服务编号"
                @click="checkInputSalesId"
              />
            </span>
          </section>
          <section
            v-if="displayUserMobile"
            class="user-mobile"
          >
            <aside>用户手机号：</aside>
            <span>
              {{ displayUserMobile }}
            </span>
          </section>
          <contract-ack type="contract" />
          <promotion-area-limit-tip :all-areas="allAreas" page="charge" />
          <section class="pay-info">
            <button
              v-if="!isAgentSales"
              class="pay-order"
              :loading="payInProgress"
              @click="createOrder"
            >
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
          <li>2. 该精品官网及推广资金自购买之日起有效期为1年，请在有效期内使用；</li>
          <li>3. 详细推广记录请在【搜索通】-【数据报表】查看。</li>
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
import Clipboard from 'com/widget/clipboard'
import FlatBtn from 'com/common/flat-btn'
import GwProWidget from 'com/widget/gw-pro'
import Coupon from 'com/common/coupon'
import PriceList from './price-list'
import PriceTag from './price-tag'

import { Message } from 'element-ui'
import uuid from 'uuid/v4'

import Step from './step'

import { centToYuan } from 'utils'

import store from './store'

import track from 'util/track'

import { displayCoupon } from 'util/meta'

import {
  allowGetOrderPayUrl,
  allowPayOrder
} from 'util'

import { usingCondition } from 'constant/coupon'

import { product as PRODUCT } from 'constant/product'

import { normalizeRoles } from 'util/role'

import { createOrder } from 'api/fengming'

import {
  getUserIdFromBxSalesId,
  queryUserInfo,
  getUserInfo
} from 'api/account'

import {
  getOrderPayUrl,
  payOrders
} from 'api/order'

import { redeemCoupon } from 'api/meta'

/**
 * 关于推广资金的产品说明:
 *   1. 推广资金的产品只有 1 个, 客户自由定价
 *   2. 前端展示多个产品
 */

const allProducts = [
  {
    id: 1,
    productType: 3,
    price: 28800
  }, {
    id: 2,
    productType: 3,
    price: 58800
  }, {
    id: 3,
    productType: 3,
    price: 108800
  }, {
    id: 4,
    productType: 3,
    price: 308800
  }, {
    id: 5,
    productType: 3,
    price: 508800
  }, {
    id: 6,
    productType: 3,
    price: 1018800
  }, {
    id: 7,
    productType: 3,
    editable: true,
    price: 0
  }, {
    id: 8,
    productType: 4,
    price: 120000,
    discountExecPriceFunc: [
      'p >= 0 && p < 58800 ? 0 : false',
      'p >= 58800 && p < 508800 ? 20000 : false',
      'p >= 508800 && p < 1018800 ? 60000 : false',
      'p >= 1018800 ? 100000 : false'
    ],
    name: '精品官网一年',
    isHot: false
  }, {
    id: 9,
    productType: 4,
    price: 240000,
    discountExecPriceFunc: [
      'p >= 0 && p < 58800 ? 0 : false',
      'p >= 58800 && p < 508800 ? 60000 : false',
      'p >= 508800 && p < 1018800 ? 120000 : false',
      'p >= 1018800 ? 140000 : false'
    ],
    name: '精品官网两年【送一年】',
    isHot: true
  }
]

export default {
  name: 'qwt-charge',
  components: {
    PromotionAreaLimitTip,
    ContractAck,
    GwProWidget,
    Clipboard,
    PriceList,
    PriceTag,
    FlatBtn,
    Coupon,
    Step
  },
  fromMobx: {
    usingConditions: () => store.usingConditions,
    allDiscounts: () => store.allDiscounts,
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
      showDiscount: false,
      actionTrackId: uuid(),
      currentStep: 2,
      allProducts,
      checkedProducts: [],
      fullCheckedProducts: [],

      salesIdLocked: false,
      displayUserMobile: '',
      displayBxSalesId: '',
      inputSalesId: '',
      orderPayUrl: '',

      couponVisible: true,
      activeCouponTab: 'first',
      selectedCoupon: [],
      // 支持以后使用多种优惠券
      couponCode: '',
      payInProgress: false,
      payDialogVisible: false
    }
  },
  computed: {
    gwPrice() {
      const gw = this.fullCheckedProducts.find(p => p.productType === 4)
      if (gw) {
        return centToYuan(gw.price)
      }
    },
    promotionDiscount() {
      const charge = this.checkedProducts.find(p => p.productType === 3)
      if (charge) {
        const siteProductText = !!this.fullCheckedProducts.find(({id}) => id === 8)
          ? '一年' : '两年【送一年】'
        const siteProduct = this.fullCheckedProducts.find(({productType}) => productType === 4)
        const siteDiscountPrice = siteProduct && centToYuan(siteProduct.originalPrice - siteProduct.discountPrice)
        let huojiCouponContent = ''
        if (charge.price < 58800) {
            huojiCouponContent =  `
              充值更多，可享更多优惠！
            `
          } else if (charge.price < 108800) {
            huojiCouponContent =  `
              <span class="red">赠</span>送十万火急 50 元现金券 <span class="mute">(满100元可用，不限城市与类目，有效期30天)；</span>
            `
          } else if (charge.price < 308800) {
            huojiCouponContent =  `
              <span class="red">赠</span>送十万火急 80 元现金券 <span class="mute">(满200元可用，不限城市与类目，有效期30天)；</span>
            `
          } else {
            huojiCouponContent =  `
              <span class="red">赠</span>送十万火急 300 元现金券 <span class="mute">(满400元可用，不限城市与类目，有效期30天)；</span>
            `
          }
          return huojiCouponContent + (siteDiscountPrice
            ? `同时购买精品官网（${siteProductText}）立<span class="red">减</span> ${siteDiscountPrice} 元`
            : '')
      }
      return ''
    },
    discountInfos() {
      const charge = this.checkedProducts.find(p => p.productType === 3)
      const gw = this.checkedProducts.find(p => p.productType === 4)
      if (charge && !gw) {
        return this.promotionDiscount.split('；').slice(0, 1)
      } else if (charge && gw) {
        return this.promotionDiscount.split('；')
      }
    },
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
        let products = this.fullCheckedProducts
        for (const condition of coupon.usingConditions) {
          if (condition.type === usingCondition.PRODUCT_PACKAGES) {
            products = products.filter(p => condition.productPackages.includes(p.pkgId))
          } else if (condition.type === usingCondition.PRODUCTS) {
            products = products.filter(p => condition.products.includes(p.productType))
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
    ineffectiveCoupons() {
      return this.coupons.filter(coupon => !this.effectiveCoupons.includes(coupon))
    },
    // 减去各选中产品对应的券金额
    finalPrice() {
      if (this.totalPrice >= this.couponAmount) {
        return this.totalPrice - this.couponAmount
      } else {
        return 0
      }
    },
    couponAmount() {
      if (!this.selectedCoupon.length) return 0

      const coupon = this.selectedCoupon[0]
      let products = this.fullCheckedProducts

      let productSum = 0
      let sum = 0

      for (let condition of coupon.usingConditions) {
        if (condition.type === usingCondition.PRODUCTS) {
          products = this.fullCheckedProducts.filter(p => condition.products.includes(p.productType))
        }
      }
      productSum = products.reduce((s, p) => {s += p.discountPrice; return s}, 0)
      sum = productSum > coupon.amount ? coupon.amount : productSum

      for (let condition of coupon.usingConditions) {
        if (condition.type === usingCondition.ORDER_SUM_ORIGINAL_PRICE) {
          productSum = products.reduce((s, p) => {s += p.discountPrice; return s}, 0)
          sum = productSum > coupon.amount ? coupon.amount : productSum
        }
      }

      for (let condition of coupon.usingConditions) {
        if (condition.type === usingCondition.ORDER_DISCOUNT_PRICE_RATIO) {
          const discountRatio = condition.orderSumOriginalPriceRatio
          productSum = products.reduce((s, p) => {s += p.discountPrice; return s}, 0)
          sum = productSum * discountRatio / 100
        }
      }

      return sum
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
    isAgentAccounting() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('AGENT_ACCOUNTING')
    },
    checkedProductDiscounts() {
      if (!this.isAgentAccounting) {
        return []
      }

      const types = this.checkedProducts.map(p => p.productType)

      return this.allDiscounts
        .filter(d => types.includes(d.productType))
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
      const p = this.fullCheckedProducts.map(i => i.discountPrice)

      return p.reduce((a, b) => a + b, 0)
    }
  },
  methods: {
    displayCoupon,
    toggleProduct (product) {
      const index = this.checkedProducts.indexOf(product)
      if (index > -1) {
        this.checkedProducts.splice(index, 1)
      } else {
        const chargeProduct = this.checkedProducts.find(p => p.productType === 3)
        const gwProduct = this.checkedProducts.find(p => p.productType === 4)
        if (chargeProduct && product.productType === 3) {
          const index = this.checkedProducts.indexOf(chargeProduct)
          this.checkedProducts.splice(index, 1)
        }
        if (gwProduct && product.productType === 4) {
          this.checkedProducts = this.checkedProducts.filter(({productType}) => productType !== 4)
        }
        this.checkedProducts.push(product)
      }
    },
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
      //  目前只有这一个角色可以用券
      //  FIX: 修复页面加载后没有优惠券信息 使用$watch去监听 bxUser 变化并触发coupon 更新
      this.unBxUserWatch = this.$watch(
        () => this.isBxUser,
        async isBxUser => {
          if (isBxUser) {
            await store.getConditions()
            await store.getCoupons({ onlyValid: true, status: 0 })
            this.unBxUserWatch()
          }
      }, {immediate: true})
      await Promise.all([
        store.getProductDiscounts([3, 4]), // 充值／新官网
        store.getProducts([3,4])
      ])
    },
    getDiscountPrice(productType, price) {
      if (!this.isAgentAccounting) {
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
        actionTrackId,
        userInfo
      } = this

      const newOrder = {
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

      newOrder.products = this.fullCheckedProducts.map(p => {
        return {
          price: p.orderPrice,
          id: p.productType // ?
        }
      })

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
    // 选中最合适的coupon
    selectDefaultCoupon() {
      if (this.effectiveCoupons.length) {
        let theOne = this.effectiveCoupons[0]
        for(let coupon of this.effectiveCoupons) {
          if (coupon.amount > theOne.amount) {
            theOne = coupon
          } else if (coupon.amount === theOne.amount && coupon.expiredAt < theOne.expiredAt) {
            theOne = coupon
          }
        }
        this.selectedCoupon = [theOne]
      }
    },
    centToYuan
  },
  watch: {
    fullCheckedProducts(v) {
      this.selectDefaultCoupon()
    },
    coupons() {
      this.selectDefaultCoupon()
    },
    async couponVisible(v) {
      if (v) {
        // 必须先拿到 condition
        await store.getConditions()
        await store.getCoupons({ onlyValid: true, status: 0 })
      } else {
        this.selectedCoupon = []
      }
    },
    checkedProducts: {
      deep: true,
      handler: function (checked) {
        const charge = checked.find(p => p.productType === 3)
        const gw = checked.find(p => p.productType === 4)

        if (charge && gw) {
          let gwPrice = gw.price
          const { discountExecPriceFunc } = gw
          gwPrice = gw.price - discountExecPriceFunc
            .map(execStr => new Function('p', 'return ' + execStr)(charge.price))
            .find(res => res !== false)
          this.fullCheckedProducts = checked.map(product => {
            const {id, productType, price} = product
            return {
              id,
              productType,
              name: PRODUCT[productType],
              price: productType === 4 ? gwPrice : price,
              originalPrice: price,
              discountPrice: this.getDiscountPrice(productType, productType === 4 ? gwPrice : price)
            }
          })
        } else {
          this.fullCheckedProducts = checked.map(product => {
            const {id, productType, price, orderPrice} = product
            return {
              id,
              productType,
              name: PRODUCT[productType],
              price: price,
              originalPrice: price,
              orderPrice: orderPrice || price,
              discountPrice: this.getDiscountPrice(productType, price)
            }
          })
        }
      }
    }
  },
  async mounted() {
    const {
      sales_id: salesId,
      user_id: userId,
      select_gw: selectGw
    } = this.$route.query

    await this.init()

    setTimeout(() => {
      const { userInfo, actionTrackId } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        baixingId: userInfo.baixingId,
        action: 'enter-page: charge',
        baxId: userInfo.id,
        actionTrackId
      })
    }, 1200)

    let clickSent = false

    document.addEventListener('click', evt => {
      if (!clickSent) {
        const { userInfo, actionTrackId } = this
        track({
          roles: userInfo.roles.map(r => r.name).join(','),
          action: 'clicked: charge',
          baixingId: userInfo.baixingId,
          baxId: userInfo.id,
          actionTrackId
        })
        clickSent = true
      }
    })

    if (selectGw === 'true' || +selectGw === 1) {
      this.checkedProducts.push(this.allProducts[this.allProducts.length - 1])
    } else {
      this.checkedProducts.push(this.allProducts[0])
    }

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

<style lang="postcss">
.discount-info {
  font-size: 12px;
  margin-bottom: 10px;

  &>span.red {
    background-color: #ff3c3c;
    color: white;
    padding: 1px 4px;
    margin: 0 5px;
    border-radius: 2px;
  }
  &>span.mute {
    color: #949292;
  }
}
</style>

<style lang="postcss" scoped>
@import "../../cssbase/var";
@import "cssbase/mixin";

.discount-btn {
  color: #ff3c3c;
  cursor: pointer;

  & > i {
    margin-left: 5px;
    font-size: 16px;
  }
}

.discount-section {
  font-size: 12px;
  background-color: #f5f5f5;
  padding: 20px;
  margin-top: 10px;
}

.qwt-charge {
  width: 100%;

  & > main {
    width: 100%;
    background: var(--qwt-c-gray);
  }
}

.qwt-product, .qwt-order {
  margin-top: 10px;
  padding: 20px 0 10px 20px;
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
      line-height: 1.5;
      color: #666666;
    }

    & > main {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }

  & .package {
    margin-top: 20px;
  }

  & .charge {
    margin-top: 10px;

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
.shadow {
  box-shadow: 0px 2px 9px 0px rgba(83,95,127,0.1);
}
.hr {
  height: 1px;
  margin: 10px 0;
  background-color: #CFCFCF;
}
</style>
