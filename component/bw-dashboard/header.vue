<template>
  <div class="header">
    <h3>昨日数据</h3>
    <div>
      <div>
        <p>展现（次）</p>
        <p>{{data.show}}</p>
      </div>
      <div>
        <p>平均排名</p>
        <p>{{data.cpcRanking}}</p>
      </div>
      <div class="split"></div>
      <div>
        <router-link :to="{name: 'bw-query-price'}">
          <el-button type="primary"
                     icon="el-icon-plus">新建推广计划</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserRanking, getUserShow } from 'api/biaowang'
import dayjs from 'dayjs'

export default {
  name: 'bw-dashboard-header',
  data() {
    return {
      data: {
        show: 0,
        cpcRanking: 0
      },
    }
  },
  async mounted() {
    let options = {
      startTime: dayjs().subtract(1, 'day').unix(),
      endTime: dayjs().subtract(1, 'day').unix(),
      promoteList: []
    }
    let [cpcRankingObj, showObj] = await Promise.all([getUserRanking(options), getUserShow(options)])
    if (cpcRankingObj && cpcRankingObj.rankList) {
      this.data.cpcRanking = cpcRankingObj.rankList[0]
    }
    if (showObj && showObj.rankList) {
      this.data.show = showObj.rankList[0]
    }
  }
}
</script>

<style lang="postcss" scoped>
.header {
  color: #717d91;
  background-color: #eff2f7;
  font-size: 14px;
  padding: 30px;
  & > h3 {
    font-size: 16px;
    color: #000;
  }
  & > div {
    display: flex;
    align-items: center;
    height: 50px;
    & > div {
      margin-right: 30px;
      text-align: left;
      &.split {
        align-self: stretch;
        border: 1px solid #ddd;
      }
    }
  }
}
</style>