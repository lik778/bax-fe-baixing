<template>
  <div class="charge layout-container">
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
          <el-table-column label="日期" prop="createdTime" width="240"
            :formatter="r => toHumanTime(r.createdTime, 'YYYY-MM-DD HH:mm')" />
          <el-table-column label="充值金额" prop="dealPrice"
            :formatter="r => (r.dealPrice) / 100 + '元'" />
        </el-table>
        <el-pagination small class="pagniation" layout="prev, pager, next"
          :total="chargeQuery.total" :page-size="chargeQuery.size"
          :current-page="chargeQuery.pageNo"
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
  name: 'qwt-account-charge',
  components: {
    SectionHeader
  },
  fromMobx: {
    chargeQuery: () => store.chargeQuery,
    chargeLogs: () => store.chargeLogs
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
    async handleCurrentChange({pageNo}) {
      await this.queryLogs({ pageNo })
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
      const startDate = dayjs(v[0]).startOf('day').unix()
      const endDate = dayjs(v[1]).endOf('day').unix()
      await this.queryLogs({
        startDate,
        endDate
      })

      track({
        action: 'account: charge log - change daterange'
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
.charge {
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

