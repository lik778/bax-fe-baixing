
<template>
  <el-tooltip placement="right">
    <ul slot="content">
      <li v-for="(tip, i) in tips" :key="i">
        {{ tip }}
      </li>
    </ul>
    <i class="el-icon-question" />
  </el-tooltip>
</template>

<script>
import { campaignCreativeTooltip } from '../../../constant/tip'

export default {
  name: 'creative-tip',
  data () {
    return {
      tips: campaignCreativeTooltip.split('\n')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-question {
  margin-left: 10px;
  cursor: pointer;
}
</style>
