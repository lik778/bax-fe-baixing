<template>
  <div class="header">
    <h3>今日数据</h3>
    <div>
      <div>
        <p>展现（次）</p>
        <p class="bold">{{data.shows}}</p>
      </div>
      <div>
        <p>点击（次）</p>
        <p class="bold">{{data.clicks}}</p>
      </div>
      <div>
        <p>消费（元）</p>
        <p class="bold">{{f2y(data.consume)}}</p>
      </div>
      <div class="split"></div>
      <div>
        <p>站外推广余额：<span class="highlight">{{f2y(data.balance)}}</span>元</p>
        <p v-if="data.budget !== 0">预计还可消耗：<span class="highlight">{{Math.floor(data.balance/data.budget)}}</span>天</p>
        <p v-else>当前账户无消耗</p>
      </div>
      <div>
        <router-link v-if="userInfo.allowFmRecharge" :to="{name: 'qwt-charge'}"><el-button type="primary" plain="">充值</el-button></router-link>
        <router-link :to="{name: 'qwt-create-promotion'}"><el-button type="primary" icon="el-icon-plus">新建站外推广</el-button></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from 'api/fengming'
import {f2y} from 'util'

export default {
  name: 'dashboard-header',
  props: ['userInfo'],
  data() {
    return {
      data: {
      }
    }
  },
  methods: {
    f2y
  },
  async mounted() {
    this.data = await api.getDashboardHeader()
    console.log(this.data)
  },
}
</script>

<style lang="postcss" scoped>
.header {
  color: #717d91;
  background-color: #eff2f7;
  font-size: 14px;
  padding: 30px;
  margin-bottom: 30px;

  & > h3 {
    font-size: 16px;
    color: black;
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
.highlight {
  color: #ff8273;
  margin: 5px;
}
.bold {
  font-weight: bold;
  margin-top: 5px;
}
</style>
