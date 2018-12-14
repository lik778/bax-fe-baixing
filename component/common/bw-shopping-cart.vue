<template>
  <div class="cart" :class="{expand}">
    <div class="handle" @click="onHandleClick">
      <i class="el-icon-edit"></i><p>关键词购物车({{localItems.length}})</p>
    </div>
    <div class="main"
      v-loading="loading" element-loading-text="价格刷新中..."
      v-if="localItems.length">
      <div class="items">
        <div class="item" :class="{'sold': item.isSold}" v-for="(item, index) in localItems" :key="index">
          <div>
            <h3 class="keyword">{{item.word}}{{item.isSold ? '（已售出）': ''}}</h3><div @click="remove(index)"><i class="el-icon-close"></i></div>
          </div>
          <div>
            <p><label>平台：</label>{{item.device}}</p>
            <p><label>时长：</label>{{item.days}}</p>
          </div>
          <div>
            <p><label>价格：</label><span class="item-price">{{f2y(item.price)}}</span>元</p>
            <p><label>城市：</label>{{item.cities.join(',')}}</p>
          </div>
        </div>
      </div>
      <div class="gw">
        <el-checkbox v-model="gwSelected">精品官网{{f2y(gwPrice)}}元（原价：1200元）</el-checkbox>
      </div>
      <div class="footer">
        <p>总计：<span class="price">{{f2y(totalPrice)}}</span>元</p>
        <el-button class="checkout" @click="checkout">购买</el-button>
      </div>
    </div>
    <div v-else class="main empty">购物车空空如也~</div>
  </div>
</template>

<script>
  import clone from 'clone'
  import {f2y} from 'util'
  import {refreshKeywordPrice, createPreOrder} from 'api/biaowang'

  const storageKey = 'bw-shopping-cart'

  export default {
    name: 'bw-shopping-cart',
    data() {
      return {
        localItems: [],

        gwSelected: false,
        expand: false,
        loading: false,
        firstLoad: true
      }
    },
    computed: {
      gwPrice() {
        return 120000
      },
      totalPrice() {
        return this.localItems.reduce((a, b) => a + b.price , 0) + (this.gwSelected ? this.gwPrice : 0)
      }
    },
    mounted() {
      const stringValue = localStorage.getItem(storageKey)
      if (stringValue) {
        this.localItems = JSON.parse(stringValue)
      }
    },
    methods: {
      f2y,
      remove(index) {
        this.localItems.splice(index, 1)
      },
      async checkout() {
        console.log(this.localItems)
        const preTradeId = await createPreOrder(this.localItems, this.gwSelected)

        // 预订单创建后，清空购物车
        this.localItems = []
        location.href = `http://trade-dev.baixing.cn/?appId=101&seq=${preTradeId}`
      },
      onHandleClick() {
        this.expand = !this.expand
      },
      addToCart(items) {
        const newItems = items.filter(i => !this.localItems.some(j => j.word === i.word))
        if (newItems.length) {
          this.localItems.push(...clone(newItems))
        }
      }
    },
    watch: {
      localItems: {
        handler: function(local) {
          localStorage.setItem(storageKey, JSON.stringify(local))
          if (!this.firstLoad) {
            this.expand = true
          }
          if (this.firstLoad) {
            this.firstLoad = false
          }
        },
        deep: true
      },
      async expand(visible) {
        if (visible && this.localItems.length) {
          // 每次打开更新下关键词价格、是否已售卖
          console.log('check')
          this.loading = true
          // this.localItems = await refreshKeywordPrice(this.localItems)
          this.loading = false
        }
      }
    }
  }
</script>

<style lang="postcss" scoped>
@import '../../cssbase/var';

.cart {
  position: fixed;
  z-index: 1000;
  background-color: transparent;
  width: 390px;
  top: 10px;
  display: flex;
  transition: right .2s;

  & > .handle {
    width: 45px;
    height: 240px;
    background-color: var(--qwt-c-orange);
    color: #fff;
    border-radius: 8px 0 0 8px;
    font-size: 20px;
    padding: 10px 12px;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,.2);
    cursor: pointer;
  }

  & > .main {
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,.2);
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
        color: #999
      }

      & > div {
        display: flex;
        margin-bottom: 13px;

        &:first-of-type {
          justify-content: space-between;
        }
        & > p:first-of-type {
          width: 60%;
        }

        & >>> .el-icon-close {
          color: var(--qwt-c-orange);
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
</style>
