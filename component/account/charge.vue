<template>
  <div class="charge">
    <section-header>充值查询</section-header>
    <content>
      <div>
        <el-date-picker type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="-"
          v-model="daterange" />
      </div>
      <main style="width: 560px">
        <el-table :data="chargeLogs">
          <el-table-column label="日期" prop="id" width="240"
            :formatter="r => toHumanTime(r.createdAt, 'YYYY-MM-DD HH:mm')" />
          <el-table-column label="充值金额" prop="id"
            :formatter="r => r.remark + '：' + ((r.deltaMoney + r.deltaPoint) / 100) + '元'" />
        </el-table>
        <bax-pagination :options="chargeQuery"
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
import track from 'util/track'
import moment from 'moment'

import store from './store'

export default {
  name: 'qwt-account-charge',
  components: {
    SectionHeader,
    BaxPagination
  },
  fromMobx: {
    chargeQuery: () => store.chargeQuery,
    chargeLogs: () => store.chargeLogs
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
      await store.getChargeLogs({offset})
    },
    async queryLogs(q) {
      await store.getChargeLogs(q)
    },
    toHumanTime
  },
  watch: {
    async daterange(v) {
      if (!(v && v.length === 2)) {
        return store.clearChargeLogs()
      }

      const fromDate = toTimestamp(v[0])
      const toDate = toTimestamp(v[1])
      await this.queryLogs({
        fromDate,
        toDate
      })

      track({
        action: 'account: charge log - change daterange'
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

<style lang="postcss" scoped>
.charge {
  & > content {
    & > div {
      margin-bottom: 15px;
    }
  }
}
</style>

