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
      <template v-if="!shAgent && relationAllow()">
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
import { relationAllow } from 'util/role'

export default {
  name: 'bw-dashboard-header',
  props: {
    shAgent: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: {
        show: 0,
        rank: 0
      },
      relationAllow
    }
  },
  async mounted () {
    const { query: { user_id: userId } } = this.$route
    const data = await getPromotionUserCollection({ promoteList: [], userId })
    this.data = data
  }
}
</script>

<style lang="scss" scoped>
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
