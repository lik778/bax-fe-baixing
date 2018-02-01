
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
        {{ '已优惠' + ((originTotal - total) / 100).toFixed(2) + '元' }}
      </span>
      <span>
        <label>总计：</label>
        <strong>{{ (total / 100).toFixed(2) + '元' }}</strong>
      </span>
    </footer>
  </span>
</template>

<script>
import { centToYuan } from 'utils'

export default {
  name: 'qwt-charge-price-list',
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
    total() {
      const p = this.products.map(i => i.discountPrice)
      return p.reduce((a, b) => a + b, 0)
    },
    originTotal() {
      const p = this.products.map(i => i.originalPrice)
      return p.reduce((a, b) => a + b, 0)
    }
  },
  methods: {
    centToYuan
  }
}
</script>

<style scoped>
.qwt-charge-price-list {
  display: flex;
  flex-flow: column;
  width: 610px;
  border: solid 1px #e6e6e6;

  & > header {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 35px 0 30px;
    font-size: 14px;
    font-weight: 600;
    color: #666666;
    background: #f2f2f2;

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
    color: #666666;

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
      border-bottom: dotted 1px #e6e6e6;
    }

    border-bottom: solid 1px #e6e6e6;
  }

  & > footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 35px;
    height: 48px;

    & > span:first-child {
      margin-right: 10px;
      font-size: 14px;
      color: #999999;
    }

    & > span:last-child {
      & > label {
        color: #666666;
      }

      & > strong {
        color: #ff7533;
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
