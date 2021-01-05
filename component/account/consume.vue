<template>
  <div class="consume layout-container">
    <section-header>消耗查询</section-header>
    <content>
      <div>
        <el-date-picker type="daterange" start-placeholder="开始日期"
          end-placeholder="结束日期" range-separator="-" v-model="query.dateRange" />
      </div>
      <main style="width: 720px">
        <el-table :data="data">
          <el-table-column label="日期" prop="createdTime" 
            :formatter="r => formatDate(r.date)" />
          <el-table-column label="计划" prop="campaignId" />
          <!-- tip: 先写死，百年大计二期上线首页宝和标王之后更改 -->
          <el-table-column label="类型" :formatter="r => '广告投放'" />
          <el-table-column label="消费金额"
            :formatter="r => (r.cost / 100).toFixed(2) + '元'" />
        </el-table>
        <el-pagination class="pagniation" small layout="prev, pager, next"
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
import track from 'util/track'
import dayjs from 'dayjs'
import * as api from 'api/fengming'

const DEFAULT_DATE_RANGE = [
  dayjs().startOf('day').toDate(),
  dayjs().endOf('day').toDate()
]

export default {
  name: 'qwt-account-consume',
  components: {
    SectionHeader
  },
  data() {
    return {
      query: {
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
        pageNo: this.pageNo || 1,
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
      const { total, logs } = await api.getChangeLogs(queryParmas)
      this.data = logs
      this.total = total
    },
    handleCurrentPage(val) {
      this.pageNo = val
      this.fetchData()
    },
    formatDate(timestamp) {
      return dayjs(timestamp * 1000).format("YYYY-MM-DD")
    }
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

<style lang="scss" scoped>
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
