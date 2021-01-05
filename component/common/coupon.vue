<template>
  <div class="coupon" :class="{selected, disabled}" @click="onClick">
    <div class="brief">
      <h2 v-if="coupon.discountRatio">{{coupon.discountRatio / 10}} 折</h2>
      <h2 v-else>￥{{coupon.money}}</h2>
      <small class="desc">{{coupon.text}}</small>
    </div>
    <div class="detail">
      <div class="type">{{coupon.products}}</div>
      <div class="type">{{coupon.packages}}</div>
      <div class="date">有效期：{{coupon.expire}}</div>
      <div class="btn-use" v-if="!disabled && showBtn">立即使用</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bax-coupon',
  props: {
    coupon: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border: 2px solid transparent;
  cursor: pointer;

  & > .brief {
    min-width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-image: url("//s.baixing.net/img/refashion/coupon_background.png");
    background-size: cover;
    background-color: #fec435;
    text-align: center;
    color: white;
    position: relative;

    & > h2 {
      margin: 0;
      font-size: 1.5em;
    }

    & > .desc {
      font-size: 0.8em;
    }
  }

  & > .detail {
    border: 1px solid #fec435;
    border-left: 2px dashed #fec435;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    flex-grow: 1;
    & > .type {
      font-size: 1em;
      margin: 2px;
    }
    & > .date {
      font-size: 0.8em;
      color: gray;
    }
    & > .btn-use {
      font-size: 0.8em;
      color: #fdb335;
      padding: 0 10px;
      border: 1px solid #fdb335;
      border-radius: 30px;
      margin: 5px auto;
    }
  }
}
.coupon.selected {
  border: 2px solid #bd8d04;

  & > .detail {
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
}
.coupon.selected::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-right: 10px solid #bd8d04;
  border-bottom: 10px solid #bd8d04;
  border-left: 10px solid transparent;
  border-top: 10px solid transparent;
}
.coupon.selected::before {
  content: "√";
  position: absolute;
  right: 2px;
  bottom: -4px;
  color: white;
  z-index: 1;
  font-family: cursive;
  font-size: 13px;
}

.coupon.disabled {
  cursor: not-allowed;

  & > .brief {
    background-image: none;
    background-color: #cfcfcf;
  }
  & > .detail {
    color: #cfcfcf;
    border: 1px solid;
    border-left: 2px dashed;
  }
}
</style>
