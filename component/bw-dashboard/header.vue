<template>
  <div class="header">
    <h3>今日数据</h3>
    <div>
      <!-- <div>
        <p>展现（次）</p>
        <p>0</p>
      </div> -->
      <div>
        <p>平均排名</p>
        <p>{{todayRanking}}</p>
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
import { getUserRanking } from 'api/biaowang'
import dayjs from 'dayjs'

export default {
  name: 'bw-dashboard-header',
  data() {
    return {
      data: null,
    }
  },
  computed: {
    todayRanking() {
      if (!this.data) return 0
      return this.data.rankList[0]
    }
  },
  mounted() {
    getUserRanking({
      startTime: dayjs().unix(),
      endTime: dayjs().unix(),
      promoteList: []
    }).then(res => {
      this.data = res
    })
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