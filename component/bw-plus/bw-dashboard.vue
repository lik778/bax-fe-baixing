<template>
    <div class="bw-plus-dashboard">
        <h2>昨日数据</h2>
        <p>展现（次)<br/>199</p>
        <el-tabs v-model="activeName">
            <el-tab-pane label="计划维度" name="promote"></el-tab-pane>
            <el-tab-pane label="关键词维度" name="keyword"></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
  name: 'bw-plus-dashboard',
  data () {
    return {
      activeName: 'promote'
    }
  }
}
</script>
