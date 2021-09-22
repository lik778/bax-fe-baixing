<template>
    <section class="bw-plus-dashboard">
        <h2>昨日数据</h2>
        <p>展现（次)<br/>199</p>
        <el-tabs v-model="activeName">
            <el-tab-pane label="计划维度" name="promote"></el-tab-pane>
            <el-tab-pane label="关键词维度" name="keyword"></el-tab-pane>
        </el-tabs>
        <DataRange @searchData="searchData"/>
    </section>
</template>
<script>
import { DataRange } from './components'
export default {
  name: 'bw-plus-dashboard',
  components: { DataRange },
  data () {
    return {
      activeName: 'promote'
    }
  },
  methods: {
    searchData (daterange) {
      console.log(daterange)
    }
  }
}
</script>
<style lang="scss" scoped>
   .bw-plus-dashboard{
        min-height: 100%;
        background: #fff;
        margin: 10px;
        box-sizing: border-box;
   }
</style>
