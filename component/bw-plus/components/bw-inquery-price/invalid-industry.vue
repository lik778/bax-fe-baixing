<template>
    <el-popover
        placement="right"
        width="400"
        trigger="hover">
        <ul>
            <li v-for="(item, index) in INVALID_INDUSTRY" :key="index">{{item}}</li>
        </ul>
        <span class="invalid-tips" slot="reference">禁售行业<i class="el-icon-warning-outline"></i></span>
    </el-popover>
</template>

<script>
import { INVALID_INDUSTRY } from 'constant/bw-plus'
export default {
  name: 'invalid-industry',
  data () {
    return {
      INVALID_INDUSTRY
    }
  }
}
</script>
<style lang="scss" scoped>
    .invalid-tips{
        color: #909399;
    }
    .el-icon-warning-outline{
        color: #F56C6C;
        margin-left: 4px;
    }
</style>
