
<template>
  <div class="qwt-charge">
    <topbar :user-info="userInfo" :back="false">
      <el-tabs slot="title" type="card"
        @tab-click="onTabClick" :value="mode">
        <el-tab-pane label="全网通购买" name="buy-service"></el-tab-pane>
        <el-tab-pane label="资金充值" name="charge-only"></el-tab-pane>
      </el-tabs>
    </topbar>
    <section>
      <div v-if="mode === 'buy-service'" class="qwt-package">
        <header>
          请选择您需要的全网通版本：
        </header>
        <main>
          <qwt-pkg-widget v-for="i of packages" :key="i.id"
            :name="i.name" :products="i.products"
            :checked="packageChecked(i.id)"
            @click="checkPackage(i.id)">
          </qwt-pkg-widget>
        </main>
      </div>
      <div class="charge-product">
        <header>
          推广资金充值金额：
        </header>
        <main>
          <qwt-pro-widget v-for="i of allProducts" :key="mode + i.id"
            :price="i.price" :title="i.title" :editable="i.editable"
            :checked="chargeProductChecked(i.id)"
            @click="checkChargeProduct(i.id)"
            @set-money="setChargeMoney">
          </qwt-pro-widget>
        </main>
      </div>
    </section>
    <section>
      <div>
        <aside>价格信息：</aside>
        <span class="price-list">
          <price-list :products="checkedProducts"
            :has-discount="!!checkedProductDiscounts.length">
          </price-list>
          <label v-if="mode === 'buy-service' && checkedProducts.length"
            class="tip">
            该推广资金目前只能购买百度站外推广，九月下旬百度迁入广告系统后，该资金可以全渠道通用。
          </label>
        </span>
      </div>
      <div>
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
      </div>
      <div v-if="displayUserMobile">
        <aside>用户手机号：</aside>
        <span>
          {{ displayUserMobile }}
        </span>
      </div>
      <div>
        <aside>百姓网余额需支付：</aside>
        <i>{{'￥' + (totalPrice / 100).toFixed(2)}}</i>
      </div>
      <div class="pay-info">
        <el-button v-if="!isAgentSales"
          type="primary" @click="createOrder">
          {{ submitButtonText }}
        </el-button>
        <span v-if="orderPayUrl">
          <label :title="orderPayUrl">
            {{ '付款链接: ' + orderPayUrl }}
          </label>
          <Clipboard :content="orderPayUrl"></Clipboard>
        </span>
      </div>
      <footer>
        <li>推广资金使用规则：</li>
        <li>1. 该产品购买后，精品官网及推广资金不可退款；</li>
        <li>2. 该精品官网及推广资金自购买之日起有效期为365天，请在有效期内使用；</li>
        <li>3. 该推广资金目前只能用于购买百度站外推广，不能购买其他付费产品，不能转入余额，不能转入一卡通；</li>
        <li>4. 推广下线后如有剩余预算，将于下线第二日自动转入站外推广资金；</li>
        <li>5. 详细推广记录请在【账户】-【账户明细】-【消费记录】查看。</li>
      </footer>
    </section>
  </div>
</template>

<script>
import QwtPkgWidget from 'com/widget/qwt-pkg'
import QwtProWidget from 'com/widget/qwt-pro'
import Clipboard from 'com/widget/clipboard'
import PriceList from './price-list'
import Topbar from 'com/topbar'

import { Message } from 'element-ui'

import { centToYuan } from 'utils'

import store from './store'

import {
  allowGetOrderPayUrl,
  allowPayOrder
} from 'util/fengming-role'

import {
  normalizeRoles
} from 'util/role'

import {
  getUserIdFromBxSalesId,
  getProductDiscounts,
  getProductPackages,
  getOrderPayUrl,
  queryUserInfo,
  getProducts,
  createOrder,
  getUserInfo,
  payOrders
} from './action'

/**
 * 关于推广资金的产品说明:
 *   1. 推广资金的产品只有 1 个, 客户自由定价
 *   2. 前端展示多个产品
 */

const allProducts = [{
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
  title: '其他金额',
  editable: true
}, {
  id: 0,
  title: '暂不充值'
}]

export default {
  name: 'qwt-charge',
  store,
  components: {
    QwtPkgWidget,
    QwtProWidget,
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
      allProducts,

      salesIdLocked: false,
      displayUserMobile: '',
      displayBxSalesId: '',
      inputSalesId: '',

      orderPayUrl: '',
      checkedPackageId: 0,
      checkedChargeProductId: 0, // 注: 此 id 仅用于前端标记
      chargeMoney: 0
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

      return this.mode === 'charge-only' ? `搜狗推广资金：${h3}元`
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
    empty() {
      this.orderPayUrl = ''
      this.checkedPackageId = 0
      this.checkedChargeProductId = 0
      this.chargeMoney = 0
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
    async onTabClick({name}) {
      this.empty()

      const q = this.$route.query

      this.$router.push({
        name: 'qwt-charge',
        query: {
          ...q,
          mode: name
        }
      })
      // TODO: warning - 此处依赖 query mode
      await this.getProducts()
    },
    async getProducts() {
      const type = this.mode === 'buy-service' ? 1 : 3
      await getProducts(type)
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
        location.href = url
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
        chargeMoney,
        productId
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

      const oids = await createOrder(newOrder)
      const summary = this.checkedProductDesc

      await this.getOrderPayUrl(oids, summary)

      await this.payOrders(oids)

      Message.success('创建订单成功')
    },
    centToYuan
  },
  async mounted() {
    const {
      sales_id: salesId,
      user_id: userId
    } = this.$route.query

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

    await Promise.all([
      getProductDiscounts([1, 2, 3]),
      getProductPackages(1),
      this.getProducts()
    ])
  }
}
</script>

<style scoped>

@import "../../cssbase/var";
@import "cssbase/mixin";

.tip {
  margin-bottom: 10px;
  margin-left: 5px;
  font-size: 12px;
  color: var(--c-tip-gray);
}

.qwt-charge {
  padding: 0 35px;
  width: 100%;

  & > section:nth-child(2) {
    & > div {
      & > header {
        font-size: 14px;
        color: #6a778c;
      }

      & > main {
        display: flex;
        margin-top: 25px;

        & > div {
          margin-right: 10px;
        }
      }
    }

    & > div.qwt-package {
      margin-bottom: 30px;
    }
  }

  & > section:nth-child(3) {
    margin-top: 35px;
    border-top: dashed 1px #979797;

    & > div {
      margin-top: 20px;

      & > aside {
        font-size: 14px;
        min-width: 80px;
        color: #6a778c;
      }

      & > span.price-list {
        align-items: flex-end;
      }

      & > span {
        display: inline-flex;
        align-items: center;

        & > i {
          margin-left: 8px;
          font-size: 18px;
          color: gray;
          cursor: pointer;
        }
      }

      & > i {
        font-size: 18px;
        color: #ff1f0e;
      }
    }

    & > div:first-child {
      display: flex;
    }

    & > div.pay-info {
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
      margin: 40px 0 50px;
      font-size: 13px;
      line-height: 1.62;
      color: #6a778c;
    }
  }
}

</style>
