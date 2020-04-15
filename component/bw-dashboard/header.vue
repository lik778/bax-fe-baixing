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
        <p>{{data.rank}}</p>
      </div>
      <template v-if="!allowNotSeeBwNewPrice">
        <div class="split"></div>
        <div>
          <router-link :to="{name: 'bw-query-price'}">
            <el-button type="primary"
                       icon="el-icon-plus">新建推广计划</el-button>
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getPromotionUserCollection } from 'api/biaowang'
import dayjs from 'dayjs'

export default {
  name: 'bw-dashboard-header',
  props: {
    allowNotSeeBwNewPrice: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      data: {
        show: 0,
        rank: 0
      },
    }
  },
  async mounted() {
    const data = await getPromotionUserCollection({promoteList: []})
    this.data = data
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