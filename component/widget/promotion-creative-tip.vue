
<template>
  <header class="tip">
    <p>推广物料设置</p>
    <el-tooltip :content="tip" placement="top">
      <ul slot="content">
        <li v-for="(tip, i) in tips" :key="i">
          {{ tip }}
        </li>
      </ul>
      <el-button size="mini" type="primary">
        推广创意须知
      </el-button>
    </el-tooltip>
  </header>
</template>

<script>
import {
  campaignCreativeContentTooltip
} from '../../constant/tip'

export default {
  name: 'bax-promotion-creative-tip',
  data() {
    return {
      tips: campaignCreativeContentTooltip.split('\n')
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

.tip {
  display: flex;
  align-items: center;
  color: #6a778c;
}
</style>
