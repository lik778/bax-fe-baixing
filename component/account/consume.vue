<template>
  <div class="consume">
    <section-header>消耗查询</section-header>
    <content>
      <div>
        <el-date-picker type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="-"
          v-model="daterange" />
      </div>
      <main style="width: 720px">
        <el-table :data="consumeLogs">
          <el-table-column label="日期" prop="reportDate" />
          <el-table-column label="计划" prop="campaignId" />
          <el-table-column label="类型"
            :formatter="r => fmtLogType(r.logType)" />
          <el-table-column label="消费金额"
            :formatter="r => (r.consume / 100).toFixed(2) + '元'" />
        </el-table>
        <bax-pagination :options="consumeQuery"
          @current-change="onCurrentChange">
        </bax-pagination>
      </main>
    </content>
  </div>
</template>

<script>
import SectionHeader from 'com/common/section-header'
import BaxPagination from 'com/common/pagination'

import { toHumanTime, toTimestamp } from 'utils'
import { changeLogType } from 'constant/log'
import track from 'util/track'
import moment from 'moment'

import store from './store'

export default {
  name: 'qwt-account-consume',
  components: {
    SectionHeader,
    BaxPagination
  },
  fromMobx: {
    consumeQuery: () => store.consumeQuery,
    consumeLogs: () => store.consumeLogs
  },
  data() {
    return {
      daterange: [
        moment().startOf('day').toDate(),
        moment().toDate()
      ]
    }
  },
  methods: {
    async onCurrentChange({offset}) {
      await store.getConsumeLogs({offset})
    },
    async queryLogs(q) {
      await store.getConsumeLogs(q)
    },
    fmtLogType(n) {
      return changeLogType[String(n)]
    },
    toHumanTime
  },
  watch: {
    async daterange(v) {
      if (!(v && v.length === 2)) {
        return store.clearConsumeLogs()
      }

      const fromDate = toTimestamp(v[0])
      const toDate = toTimestamp(v[1])
      await this.queryLogs({
        fromDate,
        toDate
      })

      track({
        action: 'account: consume log - change daterange'
      })
    }
  },
  async mounted() {
    await this.queryLogs({
      fromDate: moment().startOf('day').unix(),
      toDate: moment().unix()
    })
  }
}
</script>

<style scoped>
.consume {
  & > content {
    & > div {
      margin-bottom: 15px;
    }
  }
}
</style>
