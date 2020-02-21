<template>
  <div class="charge-container">
    <section class="shadow">
      <step :step="0" />
    </section>
    <section class="product shadow panel">
      <header>
        1. 选择产品 | <span class="discount-btn">优惠细则</span>
      </header>
      <div class="discount-section"
           v-show="showDiscount">
        <p class="discount-info">充值更多，可享更多优惠！</p>
        <p class="discount-info"
           :key="index"
           v-for="(html, index) in discountInfoHTML"
           v-html="html" />
      </div>

      <div class="charge-section">
        <header>选择{{allProducts[FENGMING_SPU_ID].title}}：</header>
        <main>
          <section>
            <price-tag v-for="(product, index) in allProducts[FENGMING_SPU_ID].selection"
                       :key="index"
                       :editable="Number(product.maxQuantity) !== 1"
                       :price="product.realPrice"
                       :checked="checkedProducts.includes(product)"
                       @click="toggleProduct(product)"
                       @change="v => product.realPrice = v">
            </price-tag>
          </section>
        </main>

        <header>选择{{allProducts[SITE_SPU_ID].title}}：
          <span class="tip">具体官网搭售折扣及实付金额，请点击“确认购买”后前往订单确认页面查看</span>
        </header>
        <main>
          <section>
            <gw-pro-widget v-for="(product, index) of allProducts[SITE_SPU_ID].selection"
                           :key="index"
                           :title="product.title"
                           :desc="product.desc"
                           :is-hot="product.title.includes('专业版')"
                           :is-pro="product.title.includes('专业版')"
                           :price="centToYuan(product.realPrice)"
                           :checked="checkedProducts.includes(product)"
                           @click.native="toggleProduct(product)" />
          </section>
        </main>
      </div>
    </section>

    <section class="order shadow panel">
      <div class="info">
        <section class="sales-code">
          <aside>服务编号：</aside>
          <span v-if="salesIdLocked || isBxSales">
            {{ displayBxSalesId || userInfo.salesId }}
          </span>
          <span v-else>
            <el-input placeholder="如有服务编号请您填写"
                      v-model.trim="inputSalesId" />
            <i class="el-icon-check"
               title="检测服务编号"
               @click="checkInputSalesId" />
          </span>
        </section>
        <section v-if="displayUserMobile"
                 class="user-mobile">
          <aside>用户手机号：</aside>
          <span>
            {{ displayUserMobile }}
          </span>
        </section>
        <contract-ack type="contract"
                      ref="contract" />
        <promotion-area-limit-tip :all-areas="allAreas"
                                  page="charge" />
        <section class="pay-info">
          <button v-if="!isAgentSales"
                  class="pay-order"
                  :loading="payInProgress"
                  @click="createPreOrder">
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
</template>

<script>
import Step from 'com/charge/step'
import PriceTag from 'com/charge/price-tag'
import GwProWidget from 'com/charge/gw-pro'
import ContractAck from 'com/widget/contract-ack'
import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import Clipboard from 'com/widget/clipboard'

import { centToYuan } from 'utils'
import { normalizeRoles } from 'util/role'
import { allowGetOrderPayUrl } from 'util'
import { orderServiceHost } from 'config'
import track from 'util/track'
import uuid from 'uuid/v4'
import { getUserIdFromBxSalesId, queryUserInfo, getUserInfo } from 'api/account'
import { createOrder, getProductList } from 'api/fengming'
import { SPUIDS, VENDORIDS } from 'constant/product'

const { FENGMING_SPU_ID, SITE_SPU_ID, } = SPUIDS
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
const isGwProduct = function(spuId) {
  return spuId === SITE_SPU_ID
}
const isChargeProduct = function(spuId) {
  return spuId === FENGMING_SPU_ID
}

const allProducts = {
  "100001" : {
    id: FENGMING_SPU_ID,
    title: '充值推广资金包',
    desc: '',
    selection: [
      {
        id: '1',
        spuId: FENGMING_SPU_ID,
        title:'588',
        desc: '',
        originalPrice: 58800,
        realPrice: 58800,
        unit:'元',
        maxQuantity: 1,
        minQuantity: 1,
      },
      {
        id: '2',
        spuId: FENGMING_SPU_ID,
        title:'1088',
        desc: '',
        originalPrice: 108800,
        realPrice: 108800,
        unit:'元',
        maxQuantity: 1,
        minQuantity: 1,
      },
      {
        id: '3',
        spuId: FENGMING_SPU_ID,
        title:'3088',
        desc: '',
        originalPrice: 308800,
        realPrice: 308800,
        unit:'元',
        maxQuantity: 1,
        minQuantity: 1,
      },
      {
        id: '4',
        spuId: FENGMING_SPU_ID,
        title:'5088',
        desc: '',
        originalPrice: 508800,
        realPrice: 508800,
        unit:'元',
        maxQuantity: 1,
        minQuantity: 1,
      },
      {
        id: '5',
        spuId: FENGMING_SPU_ID,
        title:'10188',
        desc: '',
        originalPrice: 1018800,
        realPrice: 1018800,
        unit:'元',
        maxQuantity: 1,
        minQuantity: 1,
      },
      {
        id: '6',
        spuId: FENGMING_SPU_ID,
        title:'1',
        desc: '',
        originalPrice: 1,
        realPrice: 1,
        unit:'元',
        maxQuantity: 99999,
        minQuantity: 1,
      }
    ]
  },
  "100002" : {
    id: SITE_SPU_ID,
    title: '精品官网',
    desc: '',
    selection: [
      {
        id: '7',
        spuId: SITE_SPU_ID,
        title:'精品官网一年【标准版】',
        desc: '支持多端展示/支持微信分享/共享多渠道落地页/丰富媒体库',
        originalPrice: 120000,
        realPrice: 120000,
        unit:'',
        fixedQuality: ''
      },
      {
        id: '8',
        spuId: SITE_SPU_ID,
        title: '精品官网两年【送一年】',
        desc: '支持多端展示/支持微信分享/共享多渠道落地页/丰富媒体库',
        originalPrice: 360000,
        realPrice: 240000,
        unit:'',
        fixedQuality: ''
      },
      {
        id: '9',
        spuId: SITE_SPU_ID,
        title: '精品官网一年【专业版】',
        desc: '支持首页宝推广，让你的网站上百度首页/支持SEO优化等更多专业版官网建站功能',
        originalPrice: 180000,
        realPrice: 180000,
        unit:'',
        fixedQuality: ''
      }
    ]
  }
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
      showDiscount: true,
      actionTrackId: uuid(),
      discountInfoHTML,
      allProducts: allProducts,
      checkedProducts: [],

      salesIdLocked: false,
      displayBxSalesId: '',
      inputSalesId: '',
      displayUserMobile: '',
      orderPayUrl: '',

      payInProgress: false,
      payDialogVisible: false,

      FENGMING_SPU_ID,
      SITE_SPU_ID
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
    submitButtonText() {
      const { userInfo } = this
      if (this.isBxUser) {
        return '确认购买'
      }
      if (allowGetOrderPayUrl(userInfo.roles)) {
        return '生成链接'
      }
      return '确认购买'
    }
  },
  components: {
    Step,
    PriceTag,
    GwProWidget,
    ContractAck,
    PromotionAreaLimitTip,
    Clipboard
  },
  async mounted() {
    const { 
      sales_id: salesId,
      user_id: userId,
      select_gw: selectGw
    } = this.$route.query

    // const products = await getProductList()
    // this.allProducts = products

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

    if (selectGw === 'true' || Number(selectGw) === 1) {
      this.checkedProducts.push(this.allProducts[SITE_SPU_ID].selection[0])
    } else {
      this.checkedProducts.push(this.allProducts[FENGMING_SPU_ID].selection[0])
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
  },
  methods: {
    centToYuan,
    toggleProduct(product) {
      const index = this.checkedProducts.indexOf(product)
      if (index > -1) {
        this.checkedProducts.splice(index, 1)
      } else {
        const chargeProduct = this.checkedProducts.find(p => isChargeProduct(p.spuId))
        const gwProduct = this.checkedProducts.find(p => isGwProduct(p.spuId))
        if (chargeProduct && isChargeProduct(product.spuId)) {
          const index = this.checkedProducts.indexOf(chargeProduct)
          this.checkedProducts.splice(index, 1)
        }
        if (gwProduct && isGwProduct(product.spuId)) {
          const index = this.checkedProducts.indexOf(gwProduct)
          this.checkedProducts.splice(index, 1)
        }
        this.checkedProducts.push(product)
      }
    },
    async createPreOrder() {
      if (!this.$refs.contract.$data.isAgreement) {
        return this.$message.error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.checkedProducts.length <= 0) {
        return this.$message.error('请选择购买的产品 ~')
      }
      const chargeProduct = this.checkedProducts.find(p => isChargeProduct(p.spuId))
      if (chargeProduct && chargeProduct.realPrice < MIN_INPUT_PRICE) {
        return this.$message.error('最低充值金额500元')
      }

      const orderParams = {
        userId: await this.getFinalUserId(),
        skuList: this.checkedProducts.map(p => {
          return {
            id: p.id,
            quantity: Number(p.maxQuantity) === 1 ? 1 :  Math.floor(p.realPrice/100)
          }
        })
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
        const preTradeId = await createOrder(orderParams)
        track({
          roles: userInfo.roles.map(r => r.name).join(','),
          action: 'create order success',
          baixingId: userInfo.baixingId,
          time: Date.now() / 1000 | 0,
          oids: preTradeId.join(','),
          baxId: userInfo.id,
          actionTrackId
        })
      } catch (e) {
        console.error(e)
      } finally {
        this.payInProgress = false
      }

      if (this.isBxUser) {
        location.href = `${orderServiceHost}/?appId=105&seq=${preTradeId}`
      } else if (this.isAgentAccounting) {
        location.href = `${orderServiceHost}/?appId=105&seq=${preTradeId}&agentId=${userInfo.id}`
      } else if (this.isBxSales) {
        this.orderPayUrl = `${orderServiceHost}/?appId=105&seq=${preTradeId}`
      }
    },
    async getFinalSalesId() {
      const { sales_id: salesId } = this.$route.query
      if (salesId) {
        return salesId
      }
      const { inputSalesId, userInfo} = this
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
      const { userInfo, salesInfo } = this
      if (userId) {
        return userId
      }
      // 进入bax时带有销售身份信息，用户信息直接在salesInfo获取
      if (salesInfo.userId) {
        return salesInfo.userId
      }
      return userInfo.id
    },
    async checkInputSalesId() {
      const { inputSalesId } = this
      if (!inputSalesId) {
        return this.$message.error('请填写销售编号')
      }
      await getUserIdFromBxSalesId(inputSalesId)
      this.$message.success('销售编号可用')
    }
  }
}
</script>

<style lang="postcss" scoped>
@import "../../cssbase/var";
@import "cssbase/mixin";

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
        color: #FF7533;
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
</style>
