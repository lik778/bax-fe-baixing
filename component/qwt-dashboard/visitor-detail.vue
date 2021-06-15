<template>
  <div class="visitor-detail">
    <div class="info">近7天访客明细</div>
    <el-table :data="data" style="width: 100%" class="visitor-detail-table">
      <el-table-column
        label="日期"
        prop="date"
        :formatter="({ eventDate }) => formatterTimestamp(eventDate * 1000)"
      />
      <el-table-column
        label="来源"
        prop="source"
        :formatter="({ source }) => getVisitorLabel(source)"
      />
      <el-table-column
        label="进行时刻"
        prop="time"
        :formatter="
          ({ eventDate }) => formatterTimestamp(eventDate * 1000, false)
        "
      />
      <el-table-column
        label="IP地址"
        prop="ipAddress"
        :formatter="({ ipAddress }) => formatterIP(ipAddress)"
      />
      <el-table-column
        label="访问界面"
        prop="websiteUrl"
        min-width="200"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <a class="link" :href="row.websiteUrl" target="_blank">{{
            row.websiteUrl
          }}</a>
        </template>
      </el-table-column>
      <el-table-column label="扣费" prop="cost" min-width="140">
        <template slot-scope="{ row }">
          <span
            v-if="Number(row.costStatus) === INVALID_VISITOR_STATUS"
            class="red"
            >重复点击（不扣费）</span
          >
          <span v-else>{{ $formatter.f2y(row.cost) }}元</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container clearfix"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getDeductDetail } from 'api/fengming-campaign'
import dayjs from 'dayjs'
import {
  VISITOR_SOURCES,
  getVisitorLabel,
  INVALID_VISITOR_STATUS
} from 'constant/fengming-report'

export default {
  name: 'VisitorDetail',
  props: {
    campaignId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      data: null,
      offset: 0,
      limit: 10,
      total: 0,

      VISITOR_SOURCES,
      INVALID_VISITOR_STATUS
    }
  },
  computed: {
    currentPage () {
      const { offset, limit } = this
      return Math.floor(offset / limit) + 1
    }
  },
  methods: {
    getVisitorLabel,
    formatterIP (ip) {
      return `${ip.split('.').slice(0, -1).join('.')}.*`
    },
    formatterTimestamp (timestamp, date = true) {
      if (!timestamp) return 0
      if (date) {
        return dayjs(timestamp).format('YYYY-MM-DD')
      }
      return dayjs(timestamp).format('HH:mm')
    },
    async handleDeductDetail () {
      const { query: { user_id: userId } } = this.$route
      const { rows, total } = await getDeductDetail({
        campaignId: this.campaignId,
        offset: this.offset,
        limit: this.limit,
        startDate: dayjs().subtract(8, 'day').startOf('date').unix(),
        endDate: dayjs().subtract(1, 'day').endOf('date').unix(),
        userId
      })
      this.data = rows
      this.total = total
    },
    handleSizeChange (val) {
      this.offset = 0
      this.limit = val
      this.handleDeductDetail()
    },
    handleCurrentChange (val) {
      this.offset = this.limit * (val - 1)
      this.handleDeductDetail()
    }
  },
  watch: {
    campaignId: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.handleDeductDetail()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.visitor-detail {
  margin-left: 18px;
  & > .info {
    padding: 0 0 18px 18px;
  }
  & > .pagination-container {
    margin-top: 26px;
  }
  & .link {
    display: block;
    color: #35a5e4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  & .red {
    color: #ff6350;
  }
}
</style>

<style lang="scss">
.visitor-detail {
  & th,
  & td {
    & .cell {
      padding: 0 18px !important;
    }
  }
}
</style>
