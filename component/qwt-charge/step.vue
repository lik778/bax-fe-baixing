<template>
  <div class="step">
    <label>
      {{ mode === 'buy-service' ? '套餐购买' : '资金充值' }}
    </label>
    <span
      class="buy-service-step">
      <i :class="getIconClass(1)">
        {{ getIconContent(1) }}
      </i>
      <label>选择产品</label>
      <strong></strong>
      <i :class="getIconClass(2)">
        {{ getIconContent(2) }}
      </i>
      <label>核对订单</label>
      <strong></strong>
      <i :class="getIconClass(3)">
        {{ getIconContent(3) }}
      </i>
      <label>确认购买</label>
    </span>
  </div>
</template>

<script>
export default {
  name: 'qwt-charge-step',
  props: {
    mode: {
      type: String,
      required: true
    },
    step: {
      type: Number,
      required: true
    }
  },
  methods: {
    getIconClass(n) {
      const { step } = this

      if (n < step) {
        return 'iconfont icon-check'
      }

      if (n === step) {
        return 'ing'
      }

      return ''
    },
    getIconContent(n) {
      const { step } = this

      if (n >= step) {
        return n
      }

      return ''
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/mixin';
@import '../../cssbase/var';

.step {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  width: 100%;
  padding: 0 20px;
  background: white;

  & > label {
    font-weight: 600;
    color: #666666;
  }
}

.buy-service-step {
  display: flex;
  align-items: center;

  & > i {
    @mixin center;
    width: 23px;
    height: 23px;
    margin-right: 20px;
    border-radius: 50%;
    border: 1px solid #999999;
    font-size: 12px;
    color: #999999;
  }

  & .iconfont.icon-check {
    color: var(--qwt-c-blue);
    border-color: var(--qwt-c-blue);
    padding-top: 3px;
  }

  & .ing {
    background: var(--qwt-c-blue);
    border-color: white;
    color: white;
  }

  & > label {
    font-size: 14px;
    color: #666666;
  }

  & > strong {
    width: 46px;
    height: 1px;
    margin: 0 12px;
    border-bottom: 1px dotted var(--qwt-c-blue);
  }
}
</style>
