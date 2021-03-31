<template>
  <div class="mobile-price-ratio">
    移动端出价比例
    <el-tooltip placement="top-start">
      <div slot="content">
        <div>移动端最高出价 = 电脑端CPC最高出价 * 移动端出价比例</div>
        <div>
          示例：若某关键词电脑端出价设为1.00元，移动出价比例为2，则该关键词在移动设备上的出价为2.00元
        </div>
      </div>
      <i class="el-icon-question" />
    </el-tooltip>
    <el-input
      class="input"
      size="small"
      :value="value"
      @input="changeMobilePriceRatio"
      placeholder="默认为1"
    />
    <span class="tip">（请输入0.1-9.9之间的数字）</span>
  </div>
</template>

<script>
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
    changeMobilePriceRatio (val) {
      if (isNaN(val)) return
      if (val < 0) return
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-price-ratio {
  > .input {
    width: 240px;
    margin: 0 10px;
  }
  > .tip {
    font-size: 12px;
  }
}
.el-icon-question {
  cursor: pointer;
}
</style>
