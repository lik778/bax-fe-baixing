
<template>
  <span class="gw-charge-price-list">
    <header>
      <p>购买的产品</p>
      <p>原价</p>
      <p>现价</p>
    </header>
    <main>
      <div v-for="p of products" :key="p.id">
        <p>{{ p.name }}</p>
        <p>{{ (p.showPrice / 100).toFixed(2) + '元' }}</p>
        <p>{{ (p.price / 100).toFixed(2) + '元' }}</p>
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
export default {
  name: 'gw-charge-price-list',
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  computed: {
    total() {
      const p = this.products.map(i => i.price)
      return p.reduce((a, b) => a + b, 0)
    },
    originTotal() {
      const p = this.products.map(i => i.showPrice)
      return p.reduce((a, b) => a + b, 0)
    }
  },
  methods: {
  }
}
</script>

<style scoped>
@import "../../cssbase/var";

.gw-charge-price-list {
  display: flex;
  flex-flow: column;
  width: 610px;
  border: solid 1px #e6e6e6;

  & > header, & > main > div {
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

  & > header {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 35px 0 30px;
    font-size: 14px;
    font-weight: 600;
    color: #666666;
    background: #f2f2f2;
  }

  & > main {
    padding: 0 35px 0 30px;
    font-size: 14px;
    color: #666666;

    & > div {
      display: flex;
      align-items: center;
      height: 45px;
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
        color: var(--qwt-c-orange);
      }
    }
  }
}
</style>
