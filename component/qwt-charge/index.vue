
<template>
  <div class="qwt-charge">
    <topbar :user-info="userInfo" :back="false">
      <el-tabs slot="title" type="card"
        @tab-click="onTabClick" :value="mode">
        <el-tab-pane label="全网通购买" name="buy-service" />
        <el-tab-pane label="推广资金充值" name="charge-only" />
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
            @click="checkPackage(i.id)" />
        </main>
      </div>
      <div class="charge-product">
        <header>
          推广资金充值金额：
        </header>
        <main>
          <qwt-pro-widget v-for="i of allProducts" :key="i.id"
            :price="i.price" :title="i.title" :editable="i.editable"
            :checked="chargeProductChecked(i.id)"
            @click="checkChargeProduct(i.id)"
            @set-money="setChargeMoney" />
        </main>
      </div>
    </section>
    <section>
      <div>
        <aside>价格信息：</aside>
        <span>
          <price-list :products="checkedProducts" />
        </span>
      </div>
      <div>
        <aside>服务编号：</aside>
        <span>
          <el-input placeholder="如有服务编号请您填写" />
        </span>
      </div>
      <div>
        <aside>百姓网余额需支付：</aside>
        <i>{{'￥' + centToYuan(totalPrice)}}</i>
      </div>
      <div>
        <el-button type="primary" @click="createOrder">
          确认购买
        </el-button>
        <span v-if="orderPayUrl">
          <label :title="orderPayUrl">
            {{ '付款链接: ' + orderPayUrl }}
          </label>
          <Clipboard :content="orderPayUrl" />
        </span>
      </div>
      <footer>
        <li>推广资金使用规则：</li>
        <li>1. 该资金充值后不可退款。</li>
        <li>2. 该资金自充值之日起有效期为一年，请在有效期内使用。</li>
        <li>3. 该资金只用于购买站外推广，不能购买其他付费产品，不能转入余额，不能转入一卡通。</li>
        <li>4. 推广下线后如有剩余预算，将于下线第二日自动转入站外推广资金。</li>
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
  allowGetOrderPayUrl
} from 'util/role'

import {
  getProductPackages,
  getOrderPayUrl,
  getProducts,
  createOrder
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

      checkedPackageId: 0,
      checkedChargeProductId: 0, // 注: 此 id 仅用于前端标记
      chargeMoney: 0,

      orderPayUrl: ''
    }
  },
  computed: {
    checkedProducts() {
      const {
        checkedChargeProductId,
        checkedPackageId,
        chargeMoney
      } = this

      const pkg = this.packages
        .filter(p => p.id === checkedPackageId)
        .pop()

      let products = []

      if (pkg) {
        products = pkg.products.map(p => {
          return {
            originalPrice: p.originalPrice,
            price: p.price,
            name: p.name
          }
        })
      }

      if (checkedChargeProductId &&
        chargeMoney) {
        products.push({
          originalPrice: chargeMoney,
          price: chargeMoney,
          name: '推广资金'
        })
      }

      return products
    },
    totalPrice() {
      const p = this.checkedProducts.map(i => i.price)

      return p.reduce((a, b) => a + b, 0)
    },
    productId() {
      // 目前: products.length === 1
      return this.products.map(p => p.id).pop()
    },
    mode() {
      // mode: charge-only, buy-service
      return this.$route.query.mode || 'buy-service'
    }
  },
  methods: {
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
      this.chargeMoney = v * 100
    },
    onTabClick({name}) {
      this.$router.push({
        name: 'qwt-charge',
        query: {
          mode: name
        }
      })
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
        checkedChargeProductId,
        checkedPackageId,
        chargeMoney,
        productId,
        userInfo
      } = this

      const newOrder = {
        userId: userInfo.id,
        salesId: 2
      }

      if (!checkedChargeProductId && !checkedPackageId) {
        return Message.error('请选择购买的产品 ~')
      }

      if (checkedChargeProductId) {
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

      const oids = await createOrder(newOrder)

      await this.getOrderPayUrl(oids)

      Message.success('创建订单成功')
    },
    centToYuan
  },
  async mounted() {
    await Promise.all([
      getProductPackages(1),
      getProducts(1)
    ])
  }
}

</script>

<style scoped>

@import "cssbase/mixin";

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

      & > i {
        font-size: 18px;
        color: #ff1f0e;
      }
    }

    & > div:first-child {
      display: flex;
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
      margin: 40px 0 50px;
      font-size: 13px;
      line-height: 1.62;
      color: #6a778c;
    }
  }
}

</style>
