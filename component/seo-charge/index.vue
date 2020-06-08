
<template>
  <div class="qwt-charge">
    <main>
      <section class="shadow">
        <bax-step title="首页宝充值与购买" hint="首页宝推广资金不支持凤鸣及标王推广，如需购买请直接进入相应页面进行购买" />
      </section>
      <section class="qwt-product shadow">
        <header>
          1. 选择产品 | <span class="discount-btn" @click="showDiscount = !showDiscount">查看优惠细则<i class="el-icon-question"></i></span>
        </header>
        <div class="discount-section" v-show="showDiscount">
          <p class="discount-info">满2400元：同时购买专业版精品官网1年送1年<span class="red">减</span>官网立减 600 元；</p>
          <p class="discount-info">满4800元：同时购买专业版精品官网1年送1年<span class="red">减</span>官网立减 900 元；</p>
          <p class="discount-info">满9600元：同时购买专业版精品官网1年送1年<span class="red">减</span>官网立减 1500 元；</p>
        </div>
        <div class="charge">
          <header>选择充值推广资金包：</header>
          <main>
            <section>
              <price-tag v-for="(product, index) in allProducts.slice(0, 4)" :key="index"
                :editable="product.editable" :price="product.price"
                :checked="checkedProducts.includes(product)"
                :minInputPrice="parseInt(minInputPrice / 100)"
                @click="toggleProduct(product)"
                @change="(v)=> product.price = v">
              </price-tag>
            </section>
            <div>
              <p class="discount-info" v-html="promotionDiscount"></p>
              <p class="charge-info">新建首页宝自选词推广计划需2400元起；首页宝加速词包推广限时特惠3000元起/季度，请充值足够的推广资金包，以保证计划顺利上线！</p>
            </div>
          </main>

          <header>选择精品官网</header>
          <main>
            <section>
              <gw-pro-widget
                v-for="(product, index) of allProducts.slice(4)" :key="index"
                :is-pro="product.isPro"
                :title="product.name"
                :original-price="centToYuan(product.price)"
                :price="getGwPrice(product)"
                :checked="checkedProducts.includes(product)"
                :is-hot="product.isHot"
                @click.native="toggleProduct(product)"
              />
            </section>
            <div>
              <p v-if="showGwWarnInfo" class="gw-warn-info">短期官网仅支持本次充值{{LOCK_SHORT_GW_PRICE/100}}元及以上推广资金的用户购买</p>
              <p class="charge-info">首页宝自选词推广的官网有效时长需6个月以上，如需进行首页宝自选词推广，请选择一年版精品官网；如需进行加速词包推广，可选择100天或200天官网版本。</p>
            </div>
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
            :discount-infos="promotionDiscount.split(';')"
          />
        </div>

        <div class="info">
          <section class="price-summary">
            <div>
              <aside>百姓网余额需支付：</aside>
              <i>{{(finalPrice / 100).toFixed(2) + '元'}}</i>
            </div>
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
          <contract-ack type="contract" ref="contract" />
          <promotion-area-limit-tip :all-areas="allAreas" page="charge" />
          <section class="pay-info">
            <button
              v-if="!isAgentSales"
              class="pay-order"
              :loading="payInProgress"
              @click="createPreOrder"
            >
              {{submitButtonText}}
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
          <!-- <li>3. 详细推广记录请在【搜索通】-【数据报表】查看。</li> -->
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

    <div class="intro" v-show="showIntro">
      <div class="content">
        <div class="img"></div>
        <div class="body">
          <h1>搜索通首页宝产品上线</h1>
          <p>一样的预算，更多的效果，明智的投放配比sem：seo=3:1。</p>
          <p>高性价比的专业seo服务，不达百度首页不计费。</p>
          <p class="highlight">每词低至8元/端/天</p>
          <div class="round-btn" @click="showIntro = false">我知道啦</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import ContractAck from 'com/widget/contract-ack'
import Clipboard from 'com/widget/clipboard'
import FlatBtn from 'com/common/flat-btn'
import GwProWidget from 'com/widget/gw-pro'
import BaxStep from 'com/widget/step'
import PriceList from '../charge/price-list'
import PriceTag from '../charge/price-tag'

import { Message } from 'element-ui'
import uuid from 'uuid/v4'

import { centToYuan } from 'utils'

import store from './store'

import track from 'util/track'

import { displayCoupon } from 'util/meta'

import {
  allowGetOrderPayUrl,
  allowPayOrder
} from 'util'

import { product as PRODUCT } from 'constant/product'

import { normalizeRoles } from 'util/role'

import { createPreOrder } from 'api/seo'
import {orderServiceHost} from 'config'

import {
  getUserIdFromBxSalesId,
  queryUserInfo,
  getUserInfo
} from 'api/account'

import {
  getOrderPayUrl,
  payOrders
} from 'api/order'

import { SKU_GW, SKU_GW_100, SKU_GW_200} from 'constant/seo'

const PROFESSIONAL_SITE_PRODUCT_TYPE = 6
const LOCK_SHORT_GW_PRICE = 3000 * 100
const lockMessage = `短期官网仅支持本次充值${LOCK_SHORT_GW_PRICE/100}元及以上推广资金的用户购买`

const SEO_BALANCE = 7

const allProducts = [
  {
    id: 1,
    productType: SEO_BALANCE,
    price: 2400 * 100
  }, {
    id: 2,
    productType: SEO_BALANCE,
    price: 4800 * 100
  }, {
    id: 3,
    productType: SEO_BALANCE,
    price: 9600 * 100
  }, {
    id: 4,
    productType: SEO_BALANCE,
    editable: true,
    price: 0
  }, 
  {
    id: 5,
    productType: PROFESSIONAL_SITE_PRODUCT_TYPE,
    websiteSkuId: SKU_GW_100, // 官网sku id
    price: 600 * 100,
    discountExecPriceFunc:[
      'p >= 0 ? 30000 : false'
    ],
    isFixedPrice:true, //固定价格不参与满减
    name: '精品官网：100天【专业版】',
    productTime:'100天',
    isPro: true,
    isHot: false
  },
  {
    id: 6,
    productType: PROFESSIONAL_SITE_PRODUCT_TYPE,
    websiteSkuId: SKU_GW_200,
    price: 1200 * 100,
    discountExecPriceFunc:[
      'p >= 0 ? 60000 : false'
    ],
    isFixedPrice:true, //固定价格不参与满减
    name: '精品官网：200天【专业版】',
    productTime:'200天',
    isPro: true,
    isHot: false
  },
  {
    id: 7,
    productType: PROFESSIONAL_SITE_PRODUCT_TYPE,
    websiteSkuId: SKU_GW,
    price: 1800 * 100,
    discountExecPriceFunc: [
      'p >= 0 && p < 240000 ? 0 : false',
      'p >= 240000 && p < 480000 ? 60000 : false',
      'p >= 480000 && p < 960000 ? 90000 : false',
      'p >= 960000 ? 150000 : false'
    ],
    name: '精品官网一年送一年【专业版】',
    isPro: true,
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
    BaxStep,
    FlatBtn,
  },
  fromMobx: {
    allDiscounts: () => store.allDiscounts,
    products: () => store.products,
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    salesInfo: {
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
      showDiscount: true,
      actionTrackId: uuid(),
      allProducts,
      checkedProducts: [],
      fullCheckedProducts: [],

      salesIdLocked: false,
      displayUserMobile: '',
      displayBxSalesId: '',
      inputSalesId: '',
      orderPayUrl: '',

      payInProgress: false,
      payDialogVisible: false,

      showIntro: false,
      LOCK_SHORT_GW_PRICE,
      minInputPrice: 600 * 100,
      showGwWarnInfo: false
    }
  },
  computed: {
    promotionDiscount() {
      const charge = this.checkedProducts.find(p => p.productType === SEO_BALANCE)
      if (charge) {
        const siteProduct = this.fullCheckedProducts.find(({productType}) => productType === PROFESSIONAL_SITE_PRODUCT_TYPE)
        let isFixedPrice = siteProduct && this.checkedProducts.find(product=>product.id===siteProduct.id).isFixedPrice
        const siteDiscountPrice = siteProduct && centToYuan(siteProduct.originalPrice - siteProduct.discountPrice)

        return  (siteDiscountPrice && !isFixedPrice)
          ? `同时购买专业版精品官网（一年）立<span class="red">减</span> ${siteDiscountPrice} 元`
          : ''
      }
      return ''
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
    // 减去各选中产品对应的券金额
    finalPrice() {
      return this.totalPrice
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
    totalPrice() {
      const p = this.fullCheckedProducts.map(i => i.discountPrice)

      return p.reduce((a, b) => a + b, 0)
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
  },
  methods: {
    getGwPrice(product) {
      const gw = this.fullCheckedProducts.find(p => p.id === product.id)
      if (gw) {
        return centToYuan(gw.price)
      }
      return 0
    },
    toggleProduct (product) {
      const { productType, isFixedPrice, price } = product
      const chargeProduct = this.checkedProducts.find(p => p.productType === SEO_BALANCE)
      const gwProduct = this.checkedProducts.find(p => p.productType === PROFESSIONAL_SITE_PRODUCT_TYPE)
      const index = this.checkedProducts.indexOf(product)

      if (index > -1) { 
        if (productType === SEO_BALANCE && gwProduct && gwProduct.isFixedPrice) {
          // return this.$message.error(lockMessage)
          return this.showGwWarnInfo = true
        }
        this.showGwWarnInfo = false
        this.checkedProducts.splice(index, 1)
      } else {
        if (productType === PROFESSIONAL_SITE_PRODUCT_TYPE && isFixedPrice) {
          if (chargeProduct && chargeProduct.price < LOCK_SHORT_GW_PRICE || !chargeProduct){
            // return this.$message.error(lockMessage)
            return this.showGwWarnInfo = true
          } 
        }
        if (productType === SEO_BALANCE && price < LOCK_SHORT_GW_PRICE) {
          if (gwProduct && gwProduct.isFixedPrice) {
            // return this.$message.error(lockMessage)
            return this.showGwWarnInfo = true
          }
        }
        this.showGwWarnInfo = false
      
        if (chargeProduct && product.productType === SEO_BALANCE) {
          const index = this.checkedProducts.indexOf(chargeProduct)
          this.checkedProducts.splice(index, 1)
        }
        if (gwProduct && product.productType === PROFESSIONAL_SITE_PRODUCT_TYPE) {
          this.checkedProducts = this.checkedProducts.filter(({productType}) => productType !== PROFESSIONAL_SITE_PRODUCT_TYPE)
        }
        this.checkedProducts.push(product)
      }
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
        store.getProductDiscounts([SEO_BALANCE, PROFESSIONAL_SITE_PRODUCT_TYPE]), // 充值／新官网
        store.getProducts([SEO_BALANCE,PROFESSIONAL_SITE_PRODUCT_TYPE])
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
    async createPreOrder() {
      if (!this.$refs.contract.$data.isAgreement) {
        return this.$message.error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      // 校验
      const chargeProduct = this.checkedProducts.find(p => p.productType === SEO_BALANCE)
      const gwProduct = this.checkedProducts.find(p => p.productType === PROFESSIONAL_SITE_PRODUCT_TYPE && p.isFixedPrice)
      if (this.checkedProducts.length <= 0) {
        this.$message.error('商品为空')
        return
      }
      if (chargeProduct && chargeProduct.price < this.minInputPrice) {
        this.$message.error('充值金额最少为600元')
        return
      }
      if (gwProduct && ( !chargeProduct || (chargeProduct && chargeProduct.price < LOCK_SHORT_GW_PRICE))) {
        this.$message.error(lockMessage)
        return
      }
      const {salesId, userId} = this.salesInfo

      // balanceAmount, saleWithShopOrder, shopOrderAmount, targetUserId, salesId
      const charge = this.fullCheckedProducts.find(p => p.productType === SEO_BALANCE)
      const saleWithShopOrder = !!this.fullCheckedProducts.find(p => p.productType === PROFESSIONAL_SITE_PRODUCT_TYPE)
      const gw = this.fullCheckedProducts.find(p => p.productType === PROFESSIONAL_SITE_PRODUCT_TYPE)
      const preTradeId = await createPreOrder(
        charge ? charge.originalPrice: 0,
        saleWithShopOrder,
        1,
        gw ? gw.websiteSkuId: 0, //看二军需求
        userId,
        salesId
      )
      if (this.isBxUser) {
        location.href = `${orderServiceHost}/?appId=103&seq=${preTradeId}`
      } else if (this.isAgentAccounting) {
        location.href = `${orderServiceHost}/?appId=103&seq=${preTradeId}&agentId=${this.userInfo.id}`
      } else if (this.isBxSales) {
        this.orderPayUrl = `${orderServiceHost}/?appId=103&seq=${preTradeId}`
      }
    },
    filterProductName({productType, productTime}) {
      if( productType !== PROFESSIONAL_SITE_PRODUCT_TYPE ){
        return PRODUCT[productType]
      }
      return PRODUCT[productType] + (productTime ? `【${productTime}】` : '')
    },
    centToYuan,
  },
  watch: {
    checkedProducts: {
      deep: true,
      handler: function (checked) {
        const charge = checked.find(p => p.productType === SEO_BALANCE)
        const gw = checked.find(p => p.productType === PROFESSIONAL_SITE_PRODUCT_TYPE)

        if (charge && gw) {
          let gwPrice = gw.price
          const { discountExecPriceFunc, websiteSkuId} = gw
          gwPrice = gw.price - discountExecPriceFunc
            .map(execStr => new Function('p', 'return ' + execStr)(charge.price))
            .find(res => res !== false)
          this.fullCheckedProducts = checked.map(product => {
            const {id, productType, price} = product
            return {
              id,
              productType,
              name: this.filterProductName(product),
              price: productType === PROFESSIONAL_SITE_PRODUCT_TYPE ? gwPrice : price,
              originalPrice: price,
              websiteSkuId: product.websiteSkuId || 0, //看二军需求
              discountPrice: this.getDiscountPrice(productType, productType === PROFESSIONAL_SITE_PRODUCT_TYPE ? gwPrice : price)
            }
          })
        } else{
          this.fullCheckedProducts = checked.map(product => {
            let { id, productType, price:originalPrice } = product
            let price = originalPrice
            if( product.productType === PROFESSIONAL_SITE_PRODUCT_TYPE && product.isFixedPrice ){
              const { discountExecPriceFunc } = product
              let gwPrice = price - discountExecPriceFunc
               .map(execStr => new Function('p', 'return ' + execStr)(0))
               .find(res => res !== false)
               price = gwPrice
            }   
            return {
              id,
              productType,
              name: this.filterProductName(product),
              price: price,
              originalPrice: originalPrice,
              websiteSkuId: product.websiteSkuId || 0, // 看二军需求
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

    const key = 'seo-intro-time'
    const lastTs = localStorage.getItem(key)
    const now = Date.now()
    if (!lastTs || now - lastTs > 24 * 86400 * 1000) {
      this.showIntro = true
      localStorage.setItem(key, now)
    }
  }
}
</script>

<style lang="postcss">
.intro {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  z-index: 1000;
  background-color: rgba(0,0,0,.2);

  & > .content {
    width: 460px;
    position: relative;
    margin: 100px auto 50px;
    background-color: white;
    border-radius: 6px;

    & > .img {
      height: 132px;
      background-image: url('//file.baixing.net/201907/72c9added79381c68d23ef3a04089224.png');
    }
    & > .body {
      text-align: center;
      padding-bottom: 20px;

      & > h1 {
        font-size: 20px;
        font-weight: bold;
        margin: 25px 0;
      }
      & > p {
        color: gray;
        font-size: 14px;
      }
      & > p.highlight {
        color: #FF7533;
        font-size: 1.2em;
        margin-bottom: 20px;
        margin-top: 10px;
      }
      & > .round-btn {
        width: 50%;
        height: 40px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 20px;
        font-size: 14px;
        margin: auto;
        cursor: pointer;
        color: gray;
      }
    }
  }
}
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

.charge-info{
  color:#FF7533;
  font-size: 12px;
  margin-top: 10px;
}
.gw-warn-info{
  color: red;
  font-size : 14px;
  margin-top: 10px
}
</style>
