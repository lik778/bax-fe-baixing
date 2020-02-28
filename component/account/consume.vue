<template>
  <div class="consume layout-container">
    <section-header>消耗查询</section-header>
    <content>
      <div>
        <el-date-picker type="daterange" start-placeholder="开始日期"
          end-placeholder="结束日期" range-separator="-" v-model="daterange" />
      </div>
      <main style="width: 720px">
        <el-table :data="consumeLogs">
          <el-table-column label="日期" prop="createdTime" 
            :formatter="r => toHumanTime(r.createdTime, 'YYYY-MM-DD HH:mm')" />
          <el-table-column label="计划" prop="businessId" />
          <!-- tip: 先写死，百年大计二期上线首页宝和标王之后更改 -->
          <el-table-column label="类型" :formatter="r => '广告投放'" />
          <el-table-column label="消费金额"
            :formatter="r => (r.dealPrice / 100).toFixed(2) + '元'" />
        </el-table>
        <el-pagination class="pagniation" small layout="prev, pager, next"
          :total="consumeQuery.total" :page-size="consumeQuery.size"
          :current-page="consumeQuery.pageNo"
          @current-change="handleCurrentChange">
        </el-pagination>
      </main>
    </content>
  </div>
</template>

<script>
import SectionHeader from 'com/common/section-header'

import { toHumanTime } from 'utils'
import track from 'util/track'
import dayjs from 'dayjs'
import store from './store'

export default {
  name: 'qwt-account-consume',
  components: {
    SectionHeader
  },
  fromMobx: {
    consumeQuery: () => store.consumeQuery,
    consumeLogs: () => store.consumeLogs
  },
  data() {
    return {
      daterange: [
        dayjs().startOf('day').toDate(),
        dayjs().toDate()
      ]
    }
  },
  methods: {
    async handleCurrentChange(pageNo) {
      await this.queryLogs({ pageNo })
    },
    async queryLogs(q) {
      await store.getConsumeLogs(q)
    },
    toHumanTime
  },
  watch: {
    async daterange(v) {
      if (!(v && v.length === 2)) {
        return store.clearConsumeLogs()
      }
      const startDate = dayjs(v[0]).startOf('day').unix()
      const endDate = dayjs(v[1]).endOf('day').unix()
      await this.queryLogs({
        startDate,
        endDate
      })

      track({
        action: 'account: consume log - change daterange'
      })
    }
  },
  async mounted() {
    await this.queryLogs({
      startDate: dayjs().startOf('day').unix(),
      endDate: dayjs().endOf('day').unix()
    })
  }
}
</script>

<style lang="postcss" scoped>
.consume {
  & > content {
    & > div {
      margin-bottom: 15px;
    }
  }
  & .pagniation {
    margin-top: 10px;
  }
}
</style>
