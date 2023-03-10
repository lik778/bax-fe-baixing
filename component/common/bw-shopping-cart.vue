<template>
  <div class="cart bw" :class="{expand}">
    <div class="handle" @click="onHandleClick">
      <i class="el-icon-edit"></i><p>关键词购物车({{localItems.length}})</p>
    </div>
    <div class="main"
      v-loading="loading" element-loading-text="价格刷新中..."
      v-if="localItems.length">
      <div class="items">
        <div class="item" :class="{'sold': item.isSold}" v-for="(item, index) in localItems" :key="index">
          <div>
            <h3 class="keyword">{{keywordTitle(item)}}</h3><div @click="remove(index)"><i class="el-icon-close"></i></div>
          </div>
          <div>
            <p><label>平台：</label>{{DEVICE[item.device]}}</p>
            <p><label>时长：</label>{{item.days}}天</p>
          </div>
          <div>
            <p><label>价格：</label><span class="item-price">{{f2y(item.price)}}</span>元</p>
            <p :title="cityFormatter(item.cities, 400)"><label>城市：</label>{{cityFormatter(item.cities, 2)}}</p>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>总计：<span class="price">{{f2y(totalPrice)}}</span>元</p>
        <el-button v-if="this.relationAllow()" class="checkout" type="primary" @click="checkout">{{payText}}</el-button>
        <div v-if="payUrl" class="payurl">
          <label :title="payUrl">
            {{ '付款链接: ' + payUrl }}
          </label>
          <Clipboard :content="payUrl" @success="onCopy"></Clipboard>
        </div>
      </div>
    </div>
    <div v-else class="main empty">购物车空空如也~</div>
  </div>
</template>

<script>
import clone from 'clone'
import { f2y } from 'util'
import { createPreOrder, refreshKeywordPriceNew } from 'api/biaowang'
import { normalizeRoles, relationAllow } from 'util/role'
import Clipboard from 'com/widget/clipboard'
import { getCnName } from 'util/meta'
import { DEVICE } from 'constant/biaowang'
import { orderServiceHost, preKeywordPath } from 'config'

const storageKeyPrefix = 'bw-shopping-cart-'

export default {
  name: 'bw-shopping-cart',
  props: {
    userInfo: Object,
    salesInfo: Object,
    allAreas: Array
  },
  components: {
    Clipboard
  },
  data () {
    return {
      localItems: [],
      payUrl: '',
      DEVICE,
      relationAllow,
      expand: false,
      loading: false,
      firstLoad: false,
      storageKey: storageKeyPrefix + this.userInfo.id
    }
  },
  computed: {
    totalPrice () {
      return this.localItems.reduce((a, b) => a + b.price, 0)
    },
    payText () {
      return this.isUser('BAIXING_SALES') ? '生成支付链接' : '去支付'
    }
  },
  mounted () {
    if (this.isUser('BAIXING_USER')) {
      const stringValue = localStorage.getItem(this.storageKey)
      if (stringValue) {
        this.localItems = JSON.parse(stringValue)
        this.firstLoad = true
      }
    }
  },
  methods: {
    getFinalUserId () {
      const { user_id: userId } = this.$route.query
      if (userId) {
        return userId
      }
      const { userInfo } = this
      return userInfo.id
    },
    keywordTitle (word) {
      return word.word + (word.xufei ? '(续费)' : (word.isSold ? '(已售出)' : ''))
    },
    cityFormatter (cities, max) {
      return cities.slice(0, max).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > max ? `等${cities.length}个城市` : '')
    },
    f2y,
    isUser (roleString) {
      return normalizeRoles(this.userInfo.roles).includes(roleString)
    },
    remove (index) {
      this.localItems.splice(index, 1)
    },
    async checkout () {
      // 角色：普通用户跳转支付
      // 代理商跳转支付，url带上
      // 百姓网销售显示链接
      const {
        salesInfo,
        localItems
      } = this
      const { salesId, userId } = salesInfo
      const createOrderArgs = [localItems, userId, salesId]

      // items, targetUserId, salesId
      const preTradeId = await createPreOrder(...createOrderArgs)
      if (this.isUser('BAIXING_USER')) {
        this.localItems = []
        location.href = `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}`
      } else if (this.isUser('AGENT_ACCOUNTING')) {
        this.localItems = []
        location.href = `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}&agentId=${this.userInfo.id}`
      } else if (this.isUser('BAIXING_SALES')) {
        this.payUrl = `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}`
      }
    },
    onHandleClick () {
      this.expand = !this.expand
    },
    addToCart (items) {
      const newItems = items.filter(i => !this.localItems.some(j => j.word === i.word && j.device === i.device))
      if (newItems.length) {
        this.localItems.push(...clone(newItems))
      }
    },
    onCopy () {
      this.localItems = []
    }
  },
  watch: {
    localItems: {
      handler: function (local) {
        normalizeRoles(this.userInfo.roles)
        // 销售会代不同的用户操作，所以不读取本地购物车数据
        if (this.isUser('BAIXING_USER')) {
          localStorage.setItem(this.storageKey, JSON.stringify(local))
        }
        if (!this.firstLoad) {
          this.expand = true
        }
        this.firstLoad = false
      },
      deep: true
    },
    async expand (visible) {
      if (visible && this.localItems.length) {
        // 每次打开更新下关键词价格、是否已售卖
        this.loading = true
        const items = await refreshKeywordPriceNew(this.localItems, {
          userId: this.getFinalUserId()
        })
        // 保留字段 xufei
        this.localItems = items.map(i => {
          const one = this.localItems.find(li => li.word === i.word && li.device === i.device)
          if (one) {
            return Object.assign({}, one, i)
          }
          return undefined
        })
        this.loading = false
      }
    },
    loading (val) {
      this.$bus.$emit('shoppingCartLoading', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.cart.bw {
  & /deep/ .el-checkbox {
    & + .el-checkbox {
      margin-top: 8px;
    }
    display: flex;
    align-items: center;
  }
  & /deep/ .el-checkbox__label {
    white-space: normal;
  }
}

.cart {
  position: fixed;
  z-index: 1000;
  background-color: transparent;
  width: 390px;
  top: 55px;
  display: flex;
  transition: right 0.2s;

  & > .handle {
    width: 45px;
    height: 240px;
    background-color: $qwt-c-orange;
    color: #fff;
    border-radius: 8px 0 0 8px;
    font-size: 20px;
    padding: 10px 12px;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  & > .main {
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    height: 500px;

    & > .items {
      width: 100%;
    }
    & > .items > .item {
      margin-bottom: 15px;
      border-bottom: 1px solid #e9e9e9;
      display: flex;
      flex-direction: column;

      &.sold > div > .keyword {
        color: #999;
      }

      & > div {
        display: flex;
        margin-bottom: 13px;

        &:first-of-type {
          justify-content: space-between;
        }
        & > p:first-of-type {
          width: 120px;
        }

        & /deep/ .el-icon-close {
          color: $qwt-c-orange;
          cursor: pointer;
        }
        & > p > label {
          color: #999;
        }
        & > p > .item-price {
          color: red;
        }

        & > .keyword {
          font-weight: bold;
        }
      }
    }
    & > .gw {
      margin-bottom: 20px;
    }
    & > .footer {
      align-self: flex-end;
      & > p > .price {
        margin-bottom: 15px;
        color: red;
        font-size: 1.5em;
      }
      & > .checkout {
        float: right;
      }
    }
  }
}
.cart {
  right: -345px;
}
.cart.expand {
  right: 0;
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: gray;
}
.payurl {
  font-size: 14px;
  margin-top: 10px;
}
.checkbox {
  margin: 0;
}
</style>
