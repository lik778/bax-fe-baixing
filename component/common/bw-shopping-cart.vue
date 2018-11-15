<template>
  <div class="cart" :class="{show}">
    <div class="handle" @click="onHandleClick">
      <i class="el-icon-edit"></i><p>关键词购物车</p>
    </div>
    <div class="main">
      <div class="items">
        <div class="item" v-for="(item, index) in localItems" :key="index">
          <div>
            <h3 class="keyword">{{item.word}}</h3><div @click="remove(index)"><i class="el-icon-close"></i></div>
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
  </div>
</template>

<script>
  import clone from 'clone'
  import {f2y} from 'util'

  export default {
    name: 'bw-shopping-cart',
    props: {
      items: Array
    },
    data() {
      return {
        localItems: clone(this.items),

        gwSelected: false,
        show: true
      }
    },
    computed: {
      gwPrice() {
        return 12000
      },
      totalPrice() {
        return this.localItems.reduce((a, b) => a + b.price , 0) + (this.gwSelected ? this.gwPrice : 0)
      }
    },
    methods: {
      f2y,
      remove(index) {
        this.localItems.splice(index, 1)
      },
      checkout() {

      },
      onHandleClick() {
        this.show = !this.show
      }
    },
    watch: {
      items(items) {
        const newItems = items.filter(i => !this.localItems.includes(i))
        this.localItems.push(...newItems)
      }
    }
  }
</script>

<style lang="postcss" scoped>
@import '../../cssbase/var';

.cart {
  position: fixed;
  width: 390px;
  top: 0px;
  display: flex;
  transition: right .2s;

  & > .handle {
    width: 45px;
    height: 240px;
    background-color: var(--qwt-c-orange);
    color: #fff;
    border-radius: 8px 0 0 8px;
    font-size: 20px;
    padding: 20px 12px;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,.2);
    cursor: pointer;
  }

  & > .main {
    padding: 10px;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,.2);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
    & > .items {
      width: 100%;
    }
    & > .items > .item {
      margin-bottom: 15px;
      border-bottom: 1px solid #e9e9e9;
      display: flex;
      flex-direction: column;

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
.cart.show {
  right: 0;
}
</style>
