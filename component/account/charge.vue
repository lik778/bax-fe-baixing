<template>
  <div class="charge layout-container">
    <section-header>充值查询</section-header>
    <content>
      <div>
        <el-date-picker type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="-"
          v-model="query.dateRange" />
      </div>
      <main style="width: 560px">
        <el-table :data="data">
          <el-table-column label="日期" prop="createdTime" width="240"
            :formatter="r => toHumanTime(r.createdTime, 'YYYY-MM-DD HH:mm')" />
          <el-table-column label="充值金额" prop="dealPrice"
            :formatter="r => (r.dealPrice) / 100 + '元'" />
        </el-table>
        <el-pagination small class="pagniation" layout="prev, pager, next"
          :total="total" :page-size="query.size"
          :current-page="pageNo"
          @current-change="handleCurrentPage">
        </el-pagination>
      </main>
    </content>
  </div>
</template>

<script>
import SectionHeader from 'com/common/section-header'
import { toHumanTime } from 'utils'
import dayjs from 'dayjs'
import { MERCHANTS } from 'constant/product'
import * as api from 'api/fengming'

const { FENG_MING_MERCHANT_CODE, WEBSITE_MERCHANT_CODE} = MERCHANTS
const DEFAULT_DATE_RANGE = [
  dayjs().startOf('day').toDate(),
  dayjs().endOf('day').toDate()
]

export default {
  name: 'qwt-account-charge',
  components: {
    SectionHeader
  },
  data() {
    return {
      query: {
        merchantList:[FENG_MING_MERCHANT_CODE, WEBSITE_MERCHANT_CODE],
        size: 10,
        dateRange: DEFAULT_DATE_RANGE,
      },
      total: 0,
      pageNo: 1,
      data: null
    }
  },
  methods: {
    async fetchData(isResetPageNo) {
      if (isResetPageNo) this.pageNo = 1
      const { dateRange, ...otherParams } = this.query
      let queryParmas = {
        pageNo: this.pageNo,
        ...otherParams
      }
      if (dateRange) {
        const startDate = dayjs(dateRange[0]).startOf('day').unix()
        const endDate = dayjs(dateRange[1]).endOf('day').unix()
        queryParmas = {
          startDate,
          endDate,
          ...queryParmas
        }
      } 
      const { total, logs } = await api.getChargeLogs(queryParmas)
      this.data = logs
      this.total = total
    },
    handleCurrentPage(val) {
      this.pageNo = val
      this.fetchData()
    },
    toHumanTime
  },
  watch: {
    query: {
      deep: true,
      immediate: true,
      handler() {
        this.fetchData(true)
      }
    }
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

