<template>
  <div class="coupon" :class="{selected, disabled}" @click="onClick">
    <div class="discount" v-if="coupon.config">
      <span class="discount-type"
        v-if="coupon.config[0].type !== CouponTypes.FULL_DISCOUNT">￥</span>
      {{formatCouponRule(coupon.config[0]).discountDisplay}}
      <span class="discount-type"
        v-if="coupon.config[0].type === CouponTypes.FULL_DISCOUNT">折</span>
    </div>
    <div class="detail">
      <div class="detail-info">
        <div class="name">{{coupon.name}}</div>
        <div class="date">
          有效期：{{formatTime(coupon.startTime)}}-{{formatTime(coupon.endTime)}}
        </div>
      </div>
      <div class="btn-container">
        <span class="rule-desc" v-if="coupon.config">
          {{formatCouponRule(coupon.config[0]).ruleDesc}}
        </span>
        <span class="btn" v-if="!selected">立即使用</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatCouponRule } from 'util/meta'
import { CouponTypes } from 'constant/coupon'
import dayjs from 'dayjs'

export default {
  name: 'coupon',
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
    }
  },
  data() {
    return {
      CouponTypes,
    }
  },
  methods: {
    formatCouponRule,
    formatTime(timestamp) {
      return dayjs(timestamp * 1000).format('YYYY.MM.DD')
    },
    onClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.coupon {
  display: flex;
  width: 280px;
  height: 100px;
  border: 1px solid #fbce75;
  border-left: 0;
  cursor: pointer;
  & > .discount {
    width: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(167deg, #ffe067 0%, #ff6c32 100%);
    color: #fff;
    font-size: 30px;
    font-weight: 500;
    & > .discount-type {
      font-size: 16px;
      font-weight: 400;
    }
  }
  & > .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 12px;
    color: #ec823a;
    background: #f9f3e5;
    padding: 10px 8px 0 8px;
    & > .detail-info {
      & > .name {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      & .date {
        margin-top: 6px;
      }
    }
    & > .btn-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px dotted #fbce75;
      text-align: right;
      padding: 6px 0;
      & > .btn {
        background: #f4d99a;
        border-radius: 11px;
        font-size: 12px;
        padding: 4px 0;
        width: 72px;
        text-align: center;
        color: #dc3800;
      }
    }
  }
}
.coupon.disabled {
  cursor: not-allowed;
  border-color: #d4d4d4;
  & > .discount {
    background-image: linear-gradient(167deg, #EAEAEA 0%, #898989 100%);
  }
  & > .detail {
    color: #999;
    border-color: #c6c6c6;
    & > .btn-container {
      border-color: #c6c6c6;
      & > .btn {
        color: #666;
        background: #d5d5d5;
      }
    }
  }
}
.coupon.selected {
  position: relative;
  border: 2px solid #FF1D62;
}
.coupon.selected::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-right: 10px solid #FF1D62;
  border-bottom: 10px solid #FF1D62;
  border-left: 10px solid transparent;
  border-top: 10px solid transparent;
}
.coupon.selected::before {
  position: absolute;
  right: 2px;
  bottom: 0px;
  width: 5px;
  height: 10px;
  border-style: solid;
  border-width: 0 2PX 2PX 0;
  content: " ";
  transform: rotate(45deg);
  z-index: 999;
  color: #fff;
}
</style>
