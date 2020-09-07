<template>
  <div>
    <el-tabs class="product-tab" v-model="productTabMchCode" @tab-click="changeProductMchCodeTab">
      <el-tab-pane :key="FENG_MING_MERCHANT_CODE"  label="站外推广" :name="FENG_MING_MERCHANT_CODE"></el-tab-pane>
      <el-tab-pane v-if="!shAgent"  :key="PHOENIXS_MERCHANT_CODE"  label="标王" :name="PHOENIXS_MERCHANT_CODE"></el-tab-pane>
    </el-tabs>
    <div class="charge-container" v-loading.fullscreen.lock="fetchLoading">
      <section class="product shadow panel">
        <header v-show="showDiscount">
          <span class="discount-btn">优惠细则</span>
        </header>
        <div class="discount-section" v-show="showDiscount">
          <p class="discount-info">充值更多，可享更多优惠！</p>
          <p class="discount-info" :key="index"
            v-for="(html, index) in discountInfoHTML" v-html="html" />
        </div>

        <div class="charge-section">
          <template v-if="chargeSpu">
            <header>选择{{chargeSpu.title}}：</header>
            <main>
              <section>
                <price-tag v-for="(product, index) in chargeSpu.selection"
                  :key="index"
                  :editable="Number(product.maxQuantity) !== Number(product.minQuantity)"
                  :price="centToYuan(product.price)" :min-input-price="centToYuan(product.minQuantity)"
                  :max-input-price="centToYuan(product.maxQuantity)"
                  :checked="checkedProducts.includes(product)"
                  @click="toggleCharge(product)"
                  @change="v => handlePriceChange(product, v)">
                </price-tag>
              </section>
            </main>
          </template>

          <template v-if="siteSpu">
            <header>选择{{siteSpu.title}}：
              <span class="tip">具体官网搭售折扣及实付金额，请点击“确认购买”后前往订单确认页面查看</span>
            </header>
            <main>
              <section>
                <gw-pro-widget v-for="(product, index) of siteSpu.selection"
                  :key="index" :title="product.title" :desc="product.desc"
                  :is-hot="product.tags.includes('hot')"
                  :price="centToYuan(product.realPrice)"
                  :checked="checkedProducts.includes(product)"
                  @click.native="toggleSite(product)" />
              </section>
            </main>
          </template>
        </div>
      </section>

      <section class="order shadow panel">
        <div class="info">
          <!-- <section class="sales-code" v-if="salesIdLocked || isBxSales">
            <aside>服务编号：</aside>
            <span>
              {{ displayBxSalesId || userInfo.salesId }}
            </span>
          </section> -->
          <section v-if="displayUserMobile" class="user-mobile">
            <aside>用户手机号：</aside>
            <span>
              {{ displayUserMobile }}
            </span>
          </section>
          <section class="agreement">
            <div v-for="agreement in agreementList" :key="agreement.id">
              <contract :isAgreement="agreement.checked" :href="agreement.link"
                @click="() => agreement.checked = !agreement.checked"
                :title="agreement.title" />
            </div>
          </section>
          <promotion-area-limit-tip :all-areas="allAreas" page="charge" />
          <section class="pay-info">
            <button v-if="!isAgentSales" class="pay-order"
              :loading="payInProgress" @click="createPreOrder">
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
    </div>
  </div>
</template>

<script>
import PriceTag from 'com/charge/price-tag'
import GwProWidget from 'com/charge/gw-pro'
import Contract from 'com/charge/contract'
import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import Clipboard from 'com/widget/clipboard'

import { centToYuan } from 'utils'
import { normalizeRoles, isSelfHelpUser } from 'util/role'
import { allowGetOrderPayUrl } from 'util'
import { orderServiceHost } from 'config'
import track from 'util/track'
import uuid from 'uuid/v4'
import { queryUserInfo, getUserInfo } from 'api/account'
import { getProductsByMchCodes } from 'api/common'
import { createPreOrder } from 'api/order'
import { SPUCODES, MERCHANTS } from 'constant/product'
import { getUniqueAgreementList } from 'util/charge'

const { WHOLE_SPU_CODE, GUAN_WANG_SPU_CODE, BIAO_WANG_SPU_CODE } = SPUCODES
const { FENG_MING_MERCHANT_CODE, PHOENIXS_MERCHANT_CODE } = MERCHANTS
const MIN_INPUT_PRICE = 50000
const discountInfo = [
  [588, 200, 600, 600],
  [1088, 200, 600, 600],
  [3088, 200, 600, 600],
  [5088, 600, 1200, 900],
  [10188, 1000, 1400, 1500]
]
const discountInfoHTML = discountInfo.map((item, index) => {
  return `满<span style="min-width:40px">${item[0]}</span>元：
          同时购买精品官网（1年）官网<span class="red">减</span>立减 ${item[1]} 元；
          购买精品官网2年【送一年】官网<span class="red">减</span>立减 ${item[2]} 元；
          购买精品官网专业版1年（支持首页宝推广）官网<span class="red">减</span> ${item[3]}元；</p>`
})

const biaowangDiscountInfoHTML = [`<div class="notice">
  <p><span><i class="red">满</i>500-4999元，</span>购买精品官网1年立<i class="red">减</i>200元；购买精品官网2年（送一年）官网<i class="red">减</i>600元；购买精品官网专业版1年（支持首页宝推广）官网<i class="red">减</i>600元；</p>
<p><span><i class="red">满</i>5000-9999元，</span>购买精品官网1年立<i class="red">减</i>600元；购买精品官网2年（送一年）官网<i class="red">减</i>1200元；购买精品官网专业版1年（支持首页宝推广）官网<i class="red">减</i>900元；</p>
<p><span><i class="red">满</i>10000元及以上，</span>购买精品官网1年立<i class="red">减</i>1000元；购买精品官网2年（送一年）官网<i class="red">减</i>1400元；购买精品官网专业版1年（支持首页宝推广）官网<i class="red">减</i>1500元；</p>
</div>`]

const isGwProduct = function(spuCode) {
  return spuCode === GUAN_WANG_SPU_CODE
}

const isChargeProduct = function(spuCode) {
  return [WHOLE_SPU_CODE, BIAO_WANG_SPU_CODE].includes(spuCode)
}


export default {
  name: 'charge-container',
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
  data () {
    return {
      productTabMchCode: FENG_MING_MERCHANT_CODE,
      FENG_MING_MERCHANT_CODE,
      PHOENIXS_MERCHANT_CODE,
      fetchLoading: true,
      showDiscount: true,
      actionTrackId: uuid(),
      discountInfoHTML,
      siteSpu: null,
      chargeSpu: null,
      checkedProducts: [],

      salesIdLocked: false,
      displayBxSalesId: '',
      displayUserMobile: '',
      orderPayUrl: '',

      payInProgress: false,
      agreementList:[],

      productCacheList: []
    }
  },
  computed: {
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
    shAgent() {
      return isSelfHelpUser(this.userInfo.roles)
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
    checkedSkuList() {
      return this.checkedProducts.map(sku => {
        return {
          id: sku.skuVendorId,
          quantity: sku.quantity
        }
      })
    },
    hasUnCheckedAgreement() {
     return this.agreementList.length ? this.agreementList.some(agreement => !agreement.checked) : true
    }
  },
  components: {
    PriceTag,
    GwProWidget,
    Contract,
    PromotionAreaLimitTip,
    Clipboard
  },
  async mounted() {
    const {
        sales_id: salesId,
        user_id: userId,
        select_gw: selectGw
    } = this.$route.query

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
    this.obtainProductByMchCode()

  },
  methods: {
    centToYuan,
    changeProductMchCodeTab() {
      this.siteSpu = null
      this.chargeSpu = null
      this.checkedProducts = []
      this.discountInfoHTML = this.productTabMchCode === PHOENIXS_MERCHANT_CODE ?
        biaowangDiscountInfoHTML : discountInfoHTML
      this.obtainProductByMchCode()
    },
    async obtainProductByMchCode() {
      const {
        sales_id: salesId,
        user_id: userId,
        select_gw: selectGw
      } = this.$route.query

      this.fetchLoading = true
      try {
        let products = [];
        let targetList = [];
        if (this.productCacheList.length === 0) {
          targetList = this.productCacheList = await getProductsByMchCodes([FENG_MING_MERCHANT_CODE, PHOENIXS_MERCHANT_CODE])
        } else {
          targetList = this.productCacheList
        }
        let item = targetList.find(x => x.vendorCode === this.productTabMchCode)
        products = item && item.products || []

        products.forEach(spu =>
          spu.selection.forEach(sku => {
            sku.quantity = sku.minQuantity === sku.maxQuantity ? sku.minQuantity: 0
            sku.price = sku.minQuantity === sku.maxQuantity ?  Math.floor(sku.minQuantity * sku.realPrice): 0,
            sku.spuCode = spu.spuCode
          })
        )
        this.siteSpu = products.find(p => isGwProduct(p.spuCode))
        this.chargeSpu = products.find(p => isChargeProduct(p.spuCode))

        this.agreementList = getUniqueAgreementList(products)
        this.checkedProducts = []
      } catch (e) {
        console.error(e)
      } finally {
        this.fetchLoading = false
      }

      if (selectGw === 'true' || Number(selectGw) === 1) {
        const initSiteSku = this.siteSpu.selection.find(sku => sku.tags.includes('hot'))
        if (initSiteSku) this.checkedProducts.push(initSiteSku)
      } else {
        const initChargeSku = this.chargeSpu &&  this.chargeSpu.selection.find(sku => sku.tags.includes('selected'))
        if (initChargeSku) this.checkedProducts.push(initChargeSku)
      }

    },
    handlePriceChange(product, v) {
      product.price = v
      product.quantity = Math.floor(v / product.realPrice)
    },
    toggleProduct(product, judgeProduct) {
      const index = this.checkedProducts.findIndex(p => p.skuVendorId === product.skuVendorId)
      if (index > -1) {
        this.checkedProducts.splice(index, 1)
      } else {
        const cIdx = this.checkedProducts.findIndex(p => judgeProduct(p.spuCode))
        if (cIdx > -1) {
          this.checkedProducts.splice(cIdx, 1)
        }
        this.checkedProducts.push(product)
      }
    },
    toggleCharge(product) {
      this.toggleProduct(product, isChargeProduct)
    },
    toggleSite(product) {
      this.toggleProduct(product, isGwProduct)
    },
    async createPreOrder() {
      if (this.hasUnCheckedAgreement) {
        return this.$message.error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.checkedProducts.length <= 0) {
        return this.$message.error('请选择购买的产品 ~')
      }
      const chargeProduct = this.checkedProducts.find(p => isChargeProduct(p.spuCode))
      if (chargeProduct) {
        const { quantity, minQuantity, maxQuantity } = chargeProduct
        if (quantity < minQuantity) {
          return this.$message.error(`最低充值金额：${minQuantity}`)
        }
        if (quantity > maxQuantity) {
          return this.$message.error(`最高充值金额：${maxQuantity}`)
        }
      }

      const orderParams = {
        merchant: this.productTabMchCode,
        userId: await this.getFinalUserId(),
        skuList: this.checkedSkuList
      }
      const sid = await this.getFinalSalesId()
      if (sid) {
        orderParams.salesId = sid
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

      const { actionTrackId, userInfo } = this
      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'click-button: charge',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId
      })

      this.payInProgress = true

      try {
        const preTradeId = await createPreOrder(orderParams)
        track({
          roles: userInfo.roles.map(r => r.name).join(','),
          action: 'create order success',
          baixingId: userInfo.baixingId,
          time: Date.now() / 1000 | 0,
          oids: preTradeId,
          baxId: userInfo.id,
          actionTrackId
        })

        if (this.isBxUser) {
          location.href = `${orderServiceHost}/?appId=105&seq=${preTradeId}`
        } else if (this.isAgentAccounting) {
          location.href = `${orderServiceHost}/?appId=105&seq=${preTradeId}&agentId=${userInfo.id}`
        } else if (this.isBxSales) {
          this.orderPayUrl = `${orderServiceHost}/?appId=105&seq=${preTradeId}`
        }

      } catch (e) {
        console.error(e)
      } finally {
        this.payInProgress = false
      }
    },
    async getFinalSalesId() {
      const { sales_id: salesId } = this.$route.query
      if (salesId) {
        return salesId
      }
      const { userInfo} = this

      if (this.isBxUser) {
        return
      }
      return userInfo.id
    },
    async getFinalUserId() {
      const { user_id: userId } = this.$route.query
      const { userInfo, salesInfo } = this
      if (userId) {
        return userId
      }
      // 进入bax时带有销售身份信息，用户信息直接在salesInfo获取
      if (salesInfo.userId) {
        return salesInfo.userId
      }
      return userInfo.id
    }
  }
}
</script>

<style lang="postcss" scoped>
@import '../../cssbase/var';
@import 'cssbase/mixin';

.product-tab {
  background: #fff;
  padding-left: 20px;
  box-sizing: border-box;
}

.charge-container {
  & > .shadow {
    box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, 0.1);
  }
  & > .panel {
    margin-top: 10px;
    padding: 20px 0 10px 20px;
    border-radius: 4px;
    background: #fff;
  }
}
.product {
  & > header {
    font-weight: 600;
    font-size: 14px;
    color: #333333;
    & .discount-btn {
      color: #ff3c3c;
      cursor: pointer;
      & > i {
        margin-left: 5px;
        font-size: 16px;
      }
    }
  }
  & > .discount-section {
    font-size: 12px;
    background-color: #f5f5f5;
    padding: 20px;
    margin-top: 10px;
  }
  & > .charge-section {
    margin-top: 10px;
    & > header {
      font-size: 14px;
      line-height: 1.5;
      color: #666666;
      & .tip {
        color: #ff7533;
        font-size: 12px;
      }
    }
    & > main {
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0;
      flex-flow: column;
      & > section {
        display: flex;
      }
    }
  }
}
.order {
  & > .info {
    display: flex;
    flex-flow: column;
    align-items: flex-end;
    justify-content: center;
    width: 820px;
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
</style>

<style lang="postcss">
.discount-info {
  font-size: 12px;
  margin-bottom: 10px;
  & > span {
    text-align: center;
  }

  & > span.red {
    background-color: #ff3c3c;
    color: white;
    padding: 1px 4px;
    margin: 0 5px;
    border-radius: 2px;
  }
  & > .mute {
    color: #fff;
  }
}
.notice {
  font-size: 13px;
  margin-bottom: 20px;
  & > p {
      margin-bottom: 5px;

  & > span {
      width: 145px;
    }

  & .red {
      background-color: #ff3c3c;
      color: white;
      padding: 1px 4px;
      margin: 0 5px;
      border-radius: 2px;
    }
  }
}
</style>
