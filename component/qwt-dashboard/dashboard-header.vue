<template>
  <div class="header">
    <h3>今日数据</h3>
    <div>
      <div>
        <p>展现（次）</p>
        <p>1</p>
      </div>
      <div>
        <p>点击（次）</p>
        <p>2</p>
      </div>
      <div>
        <p>消费（元）</p>
        <p>3</p>
      </div>
      <div class="split"></div>
      <div>
        <p>站外推广余额：<span class="highlight">{{data.balance}}</span>元</p>
        <p>预计可消耗：<span class="highlight"></span>天</p>
      </div>
      <div>
        <router-link :to="{name: 'qwt-charge'}"><el-button type="primary" plain="">充值</el-button></router-link>
        <router-link :to="{name: 'qwt-create-promotion'}"><el-button type="primary" icon="el-icon-plus">新建站外推广</el-button></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from 'api/fengming'

export default {
  name: 'dashboard-header',
  data() {
    return {
      data: {
      }
    }
  },
  async mounted() {
    this.data = await api.getDashboardHeader()
  },
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
    color: black;
  }

  & > div {
    display: flex;
    align-items: center;
    height: 50px;

    & > div {
      margin-right: 30px;
      text-align: center;

      &.split {
        align-self: stretch;
        border: 1px solid #ddd;
      }
    }

  }
}
.highlight {
  color: #ff8273;
}
</style>
