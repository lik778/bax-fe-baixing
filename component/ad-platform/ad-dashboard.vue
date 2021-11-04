<template>
    <section class="ad-platform-dashboard">
        <h3 class="title">资金概览</h3>
        <ul>
            <li>
                <span>今日消耗（元）</span>
                <span>88</span>
            </li>
            <li>
                <span>账户余额（元）</span>
                <span>88</span>
            </li>
            <li>
                <span>累计充值（元）</span>
                <span>88</span>
            </li>
        </ul>
        <h3 class="title">数据概览</h3>
        <DataRange @getDate="getDate" @searchData="changeDateRange"/>
    </section>
</template>
<script>
import { DataRange } from 'com/bw-plus/components'
export default {
  name: 'ad-dashboard',
  components: {
    DataRange
  },
  data () {
    return {
      daterange: []
    }
  },
  methods: {
    getDate (daterange) {
      this.daterange = daterange
    },
    changeDateRange () {}
  }
}
</script>
<style lang="scss" scoped>
    .ad-platform-dashboard{
        min-height: 100%;
        background: #fff;
        margin: 10px;
        box-sizing: border-box;
        .title{
            margin-bottom: 10px;
        }
        ul{
            padding: 0;
            display: flex;
            padding: 20px;
            background: #eee;
            margin-bottom: 30px;
            li{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                &:nth-child(2){
                    margin: 0 30px;
                }
                span:nth-child(1){
                    margin-bottom: 10px;
                }
                span:nth-child(2){
                    color: #ff4f49;
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }
    }
</style>
