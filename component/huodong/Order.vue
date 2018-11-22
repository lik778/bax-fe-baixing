
<template>
  <span :class="{'qwt-charge-price-list': true, 'has-discount': hasDiscount}">
    <header>
      <p>购买的产品</p>
      <p>原价</p>
      <p>现价</p>
      <p v-if="hasDiscount">提单价</p>
    </header>
    <main>
      <div v-for="(p, i) of products" :key="i">
        <p>{{ p.name }}</p>
        <p>{{ centToYuan(p.originalPrice) + '元' }}</p>
        <p>{{ centToYuan(p.price) + '元' }}</p>
        <p v-if="hasDiscount">
          {{ (p.discountPrice / 100).toFixed(2) + '元' }}
        </p>
      </div>
    </main>
    <footer v-if="products.length">
      <span>
        <slot></slot>
      </span>
      <span v-if="youhui > 0">
        <label>已优惠：</label>{{ (youhui / 100).toFixed(2) + '元' }}
      </span>
      <span>
        <label>总计：</label><strong>{{ (discountTotal / 100).toFixed(2) + '元' }}</strong>
      </span>
    </footer>
  </span>
</template>

<script>
import { centToYuan } from 'utils'

export default {
  name: 'order',
  props: {
    products: {
      type: Array,
      required: true
    },
    hasDiscount: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    originalTotal() {
      return this.products.reduce((a, b) => a + b.originalPrice, 0)
    },
    priceTotal() {
      const total = this.products.reduce((a, b) => a + b.price, 0)
      this.$emit('price-total', total)
      return total
    },
    discountTotal() {
      const total = this.products.reduce((a, b) => a + b.discountPrice, 0)
      this.$emit('discount-total', total)
      return total
    },
    youhui() {
      return this.originalTotal - this.priceTotal
    }
  },
  methods: {
    centToYuan
  }
}
</script>

<style lang="postcss" scoped>
.qwt-charge-price-list {
  display: flex;
  flex-flow: column;
  width: 610px;
  border: solid 1px #C5007A;
  font-weight: lighter;

  & > header {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 35px 0 30px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border-bottom: 1px dashed #C5007A;

    & > p {
      display: flex;
      align-items: center;
    }

    & > p:first-child {
      width: 260px;
    }

    & > p:not(:first-child) {
      flex-grow: 0.5;
    }

    & > p:last-child {
      justify-content: flex-end;
    }
  }

  & > main {
    padding: 0 35px 0 30px;
    font-size: 14px;
    color: #fff;

    & > div {
      display: flex;
      align-items: center;
      height: 45px;

      & > p {
        display: flex;
        align-items: center;
      }

      & > p:first-child {
        width: 260px;
      }

      & > p:not(:first-child) {
        flex-grow: 0.5;
      }

      & > p:last-child {
        justify-content: flex-end;
      }
    }

    & > div:not(:last-child) {
      border-bottom: dashed 1px #C5007A;
    }

    border-bottom: solid 1px #C5007A;
  }

  & > footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px 0 10px;

    & > span {
      margin-right: 10px;
      font-size: 14px;

      & > p {
        color: #fff;
        font-size: 12px;
        & >>> strong {
          color: #FFD500;
        }
        & >>> strong.tag {
          margin-right: 5px;
          display: inline-block;
          width: 32px;
          text-align: center;
          display: inline-block;
          border-radius: 8px;
          background-color: #FFD500;
          color: #AE3A09;
        }
      }
      & > strong {
        color: #FFD500;
      }
    }
  }
}

.qwt-charge-price-list.has-discount {
  & > header {
    & > p:first-child {
      width: 210px;
    }

    & > p:not(:first-child) {
      flex-grow: 0.5;
    }

    & > p:last-child {
      flex-grow: 0;
    }
  }

  & > main {
    & > div {
      & > p:first-child {
        width: 210px;
      }

      & > p:not(:first-child) {
        flex-grow: 0.5;
      }

      & > p:last-child {
        flex-grow: 0;
      }
    }
  }
}
</style>
<style>
.mute {
  color: #949292;
}
</style>
