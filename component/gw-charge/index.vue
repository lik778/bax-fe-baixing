
<template>
  <div class="gw-charge" v-loading.fullscreen.lock="fetchLoading">
    <content>
      <step :step="step" />
      <section class="gw-product">
        <header>选择产品:
          <span class="tip">具体实付金额，请点击“确认购买”后前往订单确认页面查看</span>
        </header>
        <main>
          <gw-pro-widget v-for="(product) of products" :key="product.skuId"
            :title="product.title" :desc="product.desc"
            :price="product.realPrice | centToYuan"
            :checked="product.skuVendorId === checkedSkuId"
            @click.native="checkedSkuId = product.skuVendorId" />
        </main>
      </section>
      <section class="gw-order">
        <main>
          <div class="info">
            <section class="sales-code" v-if="salesIdLocked || isBxSales">
              <aside>服务编号:</aside>
              <span>
                {{ displayBxSalesId || userInfo.salesId }}
              </span>
            </section>
            <section v-if="!isBxUser">
              <aside>{{ userIdLocked ? '用户手机号:' : '用户ID:' }}
              </aside>
              <span>
                <span v-if="userIdLocked">{{ displayUserMobile }}</span>
                <el-input v-else v-model.trim="inputUserId"
                  placeholder="用户 ID" />
              </span>
            </section>
            <section class="agreement">
              <div v-for="agreement in agreementList" :key="agreement.id">
                <contract :isAgreement="agreement.checked"
                  :href="agreement.link"
                  @click="()=> agreement.checked = !agreement.checked"
                  :title="agreement.title" />
              </div>
            </section>
            <section class="submit">
              <button v-if="!isAgentSales" class="buy-btn" @click="createOrder">
                {{ submitButtonText }}
              </button>
            </section>
            <section v-if="orderPayUrl" class="pay-url">
              <label :title="orderPayUrl">{{ '付款链接：' + orderPayUrl }}</label>
              <Clipboard :content="orderPayUrl" />
            </section>
          </div>
          <div class="rules">
            <p>精品官网使用规则：</p>
            <li>1. 该产品购买后，精品官网不可退款，如有疑问请致电客服400-036-3650； </li>
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
import GwProWidget from 'com/charge/gw-pro'
import Contract from 'com/charge/contract'
import Step from './step'

import { centToYuan } from 'utils'
import { assetHost, orderServiceHost } from 'config'
import { getProductsByMchCode } from 'api/fengming'
import { createPreOrder } from 'api/order'
import { getUserIdFromBxSalesId, queryUserInfo, getUserInfo } from 'api/account'
import { allowBuyYoucaigouSite, allowGetOrderPayUrl } from 'util'
import { normalizeRoles } from 'util/role'
import { MERCHANTS } from 'constant/product'
import { getUniqueAgreementList } from 'util/charge'

const { WEBSITE_MERCHANT_CODE } = MERCHANTS

export default {
  name: 'gw-charge',
  components: {
    GwProWidget,
    Clipboard,
    Step,
    Contract,
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      products: [],
      checkedSkuId: '',
      orderPayUrl: '',

      salesIdLocked: false,
      displayUserMobile: '',
      displayBxSalesId: '',
      userIdLocked: false,
      displayUserId: '',
      inputUserId: '',

      step: 1,
      fetchLoading: true,
      agreementList:[]
    }
  },
  filters: {
    centToYuan
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
    },
    hasUnCheckedAgreement() {
     return this.agreementList.length ? this.agreementList.some(agreement => !agreement.checked) : true
    }
  },
  methods: {
    async getFinalSalesId() {
      const { sales_id: salesId } = this.$route.query
      if (salesId) {
        return salesId
      }

      const { userInfo } = this

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
    async createOrder() {
      this.step = 1
      if (this.hasUnCheckedAgreement) {
        return this.$message.error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      const { checkedSkuId: id } = this
      if (!id) {
        return this.$message.error('请先选择产品')
      }

      const order = {
        merchant: WEBSITE_MERCHANT_CODE,
        userId: await this.getFinalUserId(),
        skuList: [{
          id,
          quantity: 1
        }]
      }

      const sid = await this.getFinalSalesId()
      if (sid) {
        order.salesId = sid
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

      const preTradeId = await createPreOrder(order)
      if (this.isBxUser) {
        location.href = `${orderServiceHost}/?appId=105&seq=${preTradeId}`
      } else if (this.isAgentAccounting) {
        location.href = `${orderServiceHost}/?appId=105&seq=${preTradeId}&agentId=${userInfo.id}`
      } else if (this.isBxSales) {
        this.orderPayUrl = `${orderServiceHost}/?appId=105&seq=${preTradeId}`
      }
      this.$message.success('创建订单成功')
    }
  },
  async mounted() {
    const { sales_id: salesId, user_id: userId } = this.$route.query

    this.fetchLoading = true
    try {
      let websiteSpuList = await getProductsByMchCode(WEBSITE_MERCHANT_CODE)
      this.products = websiteSpuList[0].selection
      const initSelectedSku = this.products.find(sku => sku.tags.includes('selected'))
      if (initSelectedSku) {
        this.checkedSkuId = initSelectedSku.skuVendorId 
      }

      // 此处有坑，常理不应该用title做判断，后期通过商品聚合页更改
      if (!allowBuyYoucaigouSite(this.userInfo.id)) {
        let index = this.products.findIndex(o => o.title.indexOf('优采购') > -1)
        this.products.splice(index, 1)
      }
      
      this.agreementList = getUniqueAgreementList(websiteSpuList)
    } catch (e) {
      console.error(e)
    } finally {
      this.fetchLoading = false
    }

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
  }
}
</script>

<style lang="scss" scoped>
.buy-btn {
  @include center;
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
    background: $qwt-c-gray;
  }
}

.gw-product,
.gw-order {
  margin-top: 10px;
  padding: 20px 0 10px 20px;
  border-radius: 4px;
  background: white;

  & > header {
    font-weight: 600;
    font-size: 14px;
    color: #333333;
    display: flex;
    align-items: center;
    & .tip {
      color: #ff7533;
      font-size: 12px;
      font-weight: 400;
      margin-left: 8px;
    }
  }
}

.gw-product {
  padding-bottom: 30px;
  & > main {
    margin-top: 20px;
  }
  & > main > div:not(:last-child) {
    margin-right: 20px;
  }
}

.gw-order {
  & > main {
    width: 820px;
  }
}

.gw-order .info {
  display: flex;
  flex-flow: column;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 34px;
  border-bottom: solid 1px #e6e6e6;

  & > .sales-code {
    display: flex;
    align-items: center;
    /* margin-top: 20px; */
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

  & > section {
    margin-bottom: 10px;

    & > aside,
    & > label,
    & > a {
      font-size: 14px;
      color: #666666;
    }
  }

  & > section.terms {
    & > a {
      color: $qwt-c-blue;
    }
  }

  & > section.price {
    & > span {
      font-size: 22px;
      font-weight: 500;
      color: $qwt-c-orange;
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
    @include wordline;
    width: 280px;
  }
}
</style>
