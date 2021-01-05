
<template>
  <el-tooltip placement="right">
    <ul slot="content">
      <li v-for="(tip, i) in tips" :key="i">
        {{ tip }}
      </li>
    </ul>
    <i class="el-icon-question"></i>
  </el-tooltip>
</template>

<script>
import {
  cpcPriceTip
} from 'constant/tip'

export default {
  name: 'bax-cpc-price-tip',
  data() {
    return {
      tips: cpcPriceTip.split('\n')
    }
  }
}
</script>

<style lang="scss" scoped>
i {
  margin-left: 10px;
  cursor: pointer;
}
</style>
