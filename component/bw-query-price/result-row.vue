<template>
  <el-radio-group :value="selectedValues" @input="v => $emit('change', v)">
    <el-radio v-for="(option, index) in priceList" :key="index"
            class="option" :label="option">{{format(option)}}</el-radio>
  </el-radio-group>
</template>

<script>
import { f2y } from 'util'
import { DEVICE } from 'constant/biaowang'

export default {
  name: 'result-row',
  props: {
    priceList: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      required: true
    }
  },
  computed: {
    // eslint-disable-next-line
    selectedValues () {
      for (let i = 0; i < this.priceList.length; i++) {
        if (this.selected.includes(this.priceList[i])) {
          return this.priceList[i]
        }
      }
    }
  },
  methods: {
    format (option) {
      return `${f2y(option.price)} 元 (${option.days}天、${DEVICE[option.device]})`
    }
  }
}
</script>

<style lang="scss" scoped>
.option {
  min-width: 200px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
