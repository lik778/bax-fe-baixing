<template>
  <div class="cpc-price">
    <span>关键词出价<cpc-price-tip /></span>
    <el-input :value="value"
              placeholder="默认为3"
              @input="handleInput"
              class="input"
              size="small" />元
    <span class="tip">（关键词出价区间为 [2, 999] 元）</span>
  </div>
</template>

<script>
import CpcPriceTip from 'com/widget/cpc-price-tip'

export default {
  name: 'mobile-price-ratio',
  props: {
    value: {
      type: [Number, String],
      required: true,
      default: 1
    }
  },
  methods: {
    handleInput (val) {
      if (isNaN(val)) return
      this.$emit('change', val)
    }
  },
  components: {
    CpcPriceTip
  }
}
</script>

<style lang="scss" scoped>
.cpc-price {
  display: flex;
  align-items: center;
  > span {
    flex: 0 0 120px;
  }
  > .input {
    flex: 0 0 240px;
    margin: 0 10px;
  }
  > .tip {
    font-size: 12px;
    flex: 1;
  }
}
.el-icon-question {
  cursor: pointer;
}
</style>
