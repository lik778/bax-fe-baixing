
<template>
  <header class="notice">
    <p>推广物料设置</p>
    <el-tooltip placement="right">
      <ul slot="content">
        <li v-for="(tip, i) in tips" :key="i">
          {{ tip }}
        </li>
      </ul>
      <i class="el-icon-question"></i>
    </el-tooltip>
  </header>
</template>

<script>
import {
  campaignCreativeTooltip
} from '../../constant/tip'

export default {
  name: 'bax-promotion-creative-tip',
  data() {
    return {
      tips: campaignCreativeTooltip.split('\n')
    }
  }
}
</script>

<style scoped>
.el-button--primary {
  margin-left: 10px;
  background-color: unset;
  color: #20a0ff;
}
i {
  margin-left: 10px;
}
.notice {
  display: flex;
  align-items: center;
  color: #6a778c;
}
</style>
