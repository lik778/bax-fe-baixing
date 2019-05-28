
<template>
  <div class="gw-charge">
    <content>
      <step :step="step" />
      <section class="gw-product">
        <header>
          1. 选择产品
        </header>
        <main>
          <gw-pro-widget
            :title="i.name"
            v-for="i of realProducts" :key="i.id"
            :original-price="i.showPrice | centToYuan"
            :price="i.price | centToYuan"
            :checked="productChecked(i.id)"
            @click="checkProduct(i.id)"
          />
      </main>
      </section>
      <section class="gw-order">
        <header>
          2. 核对订单
        </header>
        <main>
          <div>
            <price-list
              :products="checkedProducts"
              :has-discount="!!checkedProductDiscounts.length"
              :percentage="discountPercentage"
            />
          </div>

          <div class="info">
            <section>
              <aside>服务编号:</aside>
              <span v-if="salesIdLocked || isBxSales">
                {{ displayBxSalesId || userInfo.salesId }}
              </span>
              <span v-else>
                <el-input v-model.trim="inputSalesId"
                  placeholder="如有服务编号请您填写" />
                </span>
            </section>
            <section v-if="!isBxUser">
              <aside>{{ userIdLocked ? '用户手机号:' : '用户ID:' }}</aside>
              <span>
                <span v-if="userIdLocked">
                {{ displayUserMobile }}
                </span>
                <el-input v-else
                  v-model.trim="inputUserId"
                  placeholder="用户 ID"
                />
              </span>
            </section>
            <section class="price">
              <aside>百姓网余额需支付:</aside>
              <span>{{ '￥' + (totalPrice / 100).toFixed(2) }}</span>
            </section>
            <section class="terms">
              <el-checkbox :value="true" />
              <label>我已阅读并同意遵守</label>
              <a download="百姓网精品官网入驻协议.docx"
                v-bind:href="contractDocx">
                《百姓网精品官网入驻协议》
              </a>
            </section>
            <section class="submit">
              <button
                v-if="!isAgentSales"
                class="buy-btn"
                @click="createOrder"
              >
                {{ submitButtonText }}
              </button>
            </section>
            <section
              v-if="orderPayUrl"
              class="pay-url"
            >
              <label :title="orderPayUrl">
                {{ '付款链接：' + orderPayUrl }}
              </label>
              <Clipboard :content="orderPayUrl" />
            </section>
          </div>
          <div class="rules">
            <p>精品官网使用规则：</p>
            <li>1. 该产品购买后，精品官网不可退款，如有疑问请致电客服400-036-3650；</li>
            <li>2. 该精品官网自购买之日起有效期为365天，请在有效期内使用；</li>
            <li>3. 详细推广记录请在【全网通】-【数据报表】查看。</li>
          </div>
        </main>
      </section>
    </content>
  </div>
</template>

<script>
import Clipboard from 'com/widget/clipboard'
import GwProWidget from 'com/widget/gw-pro'
import PriceList from './price-list'
import Topbar from 'com/topbar'
import Step from './step'

import { Message } from 'element-ui'

import { centToYuan } from 'utils'

import { assetHost } from 'config'

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

import {
  allowBuyYoucaigouSite,
  allowGetOrderPayUrl,
  allowUseKaPackage,
  allowSeeOldGw,
  allowPayOrder
} from 'util'

import {
  normalizeRoles
} from 'util/role'

import store from './store' 

/**
 * 备注说明:
 *   1. 新官网单独售卖, 价格 1200
 *   2. 原有的个别渠道, 优米帮, 康品汇 1000 元
 *   3. 为了实现一个产品, 不同价格, 个别渠道通过 套餐包 购买
 */

export default {
  name: 'gw-charge',
  components: {
    GwProWidget,
    Clipboard,
    PriceList,
    Topbar,
    Step
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  fromMobx: {
    allDiscounts: () => store.allDiscounts,

    packages: () => store.packages,
    products: () => store.products
  },
  data() {
    return {
      contractDocx: assetHost + 'baixing-custom-website-contract.docx',

      checkedProductId: 4,
      orderPayUrl: '',

      salesIdLocked: false,
      displayUserMobile: '',
      displayBxSalesId: '',
      userIdLocked: false,
      displayUserId: '',
      inputSalesId: '',
      inputUserId: '',

      step: 1
    }
  },
  filters: {
    centToYuan
  },
  computed: {
    realProducts() {
      if (this.isNiubiUser) {
        return this.products.map(p => {
          if (p.id === 4) {
            return {
              ...p,
              price: 100000
            }
          } else if (this.allowSeeYoucaigouSite && p.id === 5) {
            return {
              ...p,
              name: '精品官网聚合页（优采购）'
            }
          }
          return p
        })
      }

      return this.products
    },
    isAgentSales() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('AGENT_SALES')
    },
    isNiubiUser() {
      const roles = normalizeRoles(this.userInfo.roles)
      const { id } = this.userInfo
      return allowUseKaPackage(roles, id)
    },
    isBxUser() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('BAIXING_USER')
    },
    isBxSales() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('BAIXING_SALES')
    },
    allowSeeYoucaigouSite() {
      return allowBuyYoucaigouSite(this.userInfo.id)
    },
    allowDiscount() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('AGENT_ACCOUNTING')
    },
    checkedProductDiscounts() {
      if (!this.allowDiscount) {
        return []
      }

      const types = this.checkedProducts.map(p => p.productType)

      return this.allDiscounts
        .filter(d => types.includes(d.productType))
    },
    discountPercentage() {
      let p = 100

      try {
        p = this.checkedProductDiscounts[0].percentage
      } catch (err) {
        // ignore
      }

      return p
    },
    checkedProducts() {
      return this.realProducts.filter(p => p.id === this.checkedProductId)
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
      const p = this.checkedProducts
        .map(p => p.price * (this.discountPercentage / 100))
        .pop()
      return p
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

      if (this.isBxUser) {
        setTimeout(() => {
          location.href = url
        }, 800)
      }
    },
    async createOrder() {
      this.step = 2

      const {
        checkedProductId: id
      } = this

      if (!id) {
        return Message.error('请先选择产品')
      }

      const order = {
        userId: await this.getFinalUserId()
      }

      if (id === 4 && this.isNiubiUser) {
        order.packages = [{
          id: this.packages[0].id
        }]
      } else {
        order.products = [{
          id
        }]
      }

      const sid = await this.getFinalSalesId()
      if (sid) {
        order.salesId = sid
      }

      const codes = this.checkedProductDiscounts.map(d => d.code)
      if (codes.length) {
        order.discountCodes = codes
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

      const oids = await createOrder(order)

      await this.getOrderPayUrl(oids)

      await this.payOrders(oids)

      Message.success('创建订单成功')
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

      const info = await queryUserInfo(userId)
      if (info.mobile) {
        this.displayUserMobile = info.mobile
      }
    }

    await Promise.all([
      store.getProductDiscounts(),
      store.getProductPackages(1),
      store.getProducts()
    ])
  }
}
</script>

<style lang="postcss" scoped>
@import "../../cssbase/var";
@import "cssbase/mixin";

.buy-btn {
  @mixin center;
  width: 110px;
  height: 35px;
  margin-top: 20px;
  border-radius: 4px;
  background: #ff7533;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.gw-charge {
  width: 100%;

  & > content {
    display: block;
    width: 100%;
    min-height: calc(100% - 50px);
    padding: 10px 10px 30px;
    background: var(--qwt-c-gray);
  }
}

.gw-product, .gw-order {
  margin-top: 10px;
  padding: 20px 0 10px 20px;
  border-radius: 4px;
  background: white;

  & > header {
    font-weight: 600;
    font-size: 14px;
    color: #333333;
  }

  & > main {
    margin-top: 20px;
  }
}

.gw-product {
  padding-bottom: 30px;

  & > main > div:not(:last-child) {
    margin-right: 20px;
  }
}

.gw-order {
  & > main {
    width: 610px;
  }
}

.gw-order .info {
  display: flex;
  flex-flow: column;
  align-items: flex-end;
  justify-content: center;
  margin-top: 30px;
  width: 610px;
  padding-right: 35px;
  padding-bottom: 34px;
  border-bottom: solid 1px #e6e6e6;

  & > section {
    margin-bottom: 10px;

    & > aside, & > label, & > a {
      font-size: 14px;
      color: #666666;
    }
  }

  & > section.terms {
    & > a {
      color: var(--qwt-c-blue);
    }
  }

  & > section.price {
    & > span {
      font-size: 22px;
      font-weight: 500;
      color: var(--qwt-c-orange);
    }
  }
}

.gw-order .rules {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: #999999;

  & > li {
    padding-left: 1em;
    font-size: 12px;
    line-height: 1.86;
  }
}

.pay-url {
  display: flex;
  justify-content: flex-end;
  width: 420px;
  font-size: 12px;

  & > label {
    @mixin wordline;
    width: 280px;
  }
}
</style>
