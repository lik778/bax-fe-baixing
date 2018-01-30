
<template>
  <div :class="{'qwt-pkg-widget': true, checked}" @click="onClick">
    <header>
      {{ name }}
    </header>
    <main>
      <div>
        <span>精品官网365天</span>
        <span>1200元</span>
      </div>
      <div>
        <span>推广资金</span>
        <span>{{ chargePrice + '元' }}</span>
      </div>
    </main>
    <footer>
      <span>{{ salesPrice + '元' }}</span>
      <span>
        <p>{{ '原价' + (chargePrice + 1200) + '元' }}</p>
        <li />
      </span>
    </footer>
    <p>
      <bx-icon v-if="checked" type="check"></bx-icon>
    </p>
  </div>
</template>

<script>
import BxIcon from 'com/widget/icon'
import { centToYuan } from 'utils'

export default {
  name: 'qwt-pkg-widget',
  components: {
    BxIcon
  },
  props: {
    checked: Boolean,
    products: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    salesPrice() {
      const a = this.products.map(p => p.price)
      return centToYuan(a[0] + a[1])
    },
    chargePrice() {
      const p = this.products
        .filter(i => i.name === '推广资金')
        .pop()

      return p.amount
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

.qwt-pkg-widget {
  display: inline-flex;
  flex-flow: column;
  width: 280px;
  height: 160px;

  border-radius: 4px;
  border: solid 1px #ffb74d;
  cursor: pointer;

  & > header {
    @mixin center;
    height: 42px;
    border-bottom: 1px dotted #ffb74d;
    color: #333333;
  }

  & > main {
    padding: 15px 58px 10px;
    font-size: 14px;
    color: #666666;

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  & > footer {
    @mixin center;
    flex-grow: 1;
    color: white;
    background: #ffb74d;

    & > span:first-child {
      font-size: 18px;
      font-weight: 500;
    }

    & > span:last-child {
      margin-left: 12px;

      & > li {
        position: relative;
        top: -12px;
        border-bottom: 1px solid white;
      }
    }
  }
}

.qwt-pkg-widget.checked {
  border: solid 1px #ff7533;

  & > header {
    border-bottom: 1px dotted #ff7533;
  }

  & > footer {
    background: #ff7533;
  }

  & > p {
    position: relative;
    height: 0;
    width: 0;
    left: 288px;
    bottom: 10px;
  }

  & i.icon-check {
    @mixin center;
    float: right;
    width: 20px;
    height: 20px;
    font-size: 10px;
    font-weight: 600;
    border-radius: 50%;
    background: #ff7533;
    color: white;
    border: 2px solid white;
  }
}

</style>
