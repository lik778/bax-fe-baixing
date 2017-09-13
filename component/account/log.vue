
<template>
  <div>
    <section-header>账户查询</section-header>
    <label>选择查询项目</label>
    <el-select v-model="type" clearable placeholder="请选择">
      <el-option
        v-for="item in logTypeOpts"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-radio-group v-model="range" class="radio">
      <el-radio-button label="month">近一个月</el-radio-button>
      <el-radio-button label="quarter">近三个月</el-radio-button>
      <el-radio-button label="year">近一年</el-radio-button>
    </el-radio-group>

    <el-table
      class="log-table"
      :data="pagedLogs"
      style="width: 100%">
      <el-table-column
        prop="createdAt"
        label="日期"
        :formatter="dateFormatter"
        width="180">
      </el-table-column>
      <el-table-column
        prop="timelineType"
        label="类型"
        :formatter="logTypeFormatter"
        width="180">
      </el-table-column>
      <el-table-column
        prop="operatorIp"
        label="操作IP">
      </el-table-column>
      <el-table-column
        prop="relatedLog"
        label="操作内容">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="goto"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="logQuery.total">
    </el-pagination>
  </div>
</template>

<script>
import SectionHeader from 'com/common/section-header'

import { toHumanTime } from 'utils'
import moment from 'moment'

import { getLogs } from './action'
import store from './store'

import {
  logTypeOpts,
  logType
} from 'constant/user'

export default {
  name: 'account-log',
  store,
  components: {
    SectionHeader
  },
  data() {
    return {
      logTypeOpts,
      type: '',
      range: 'month',
      pageSize: 1,
      currentPage: 1
    }
  },
  computed: {
    pagedLogs() {
      const startIndex = this.pageSize * (this.currentPage - 1)
      return this.logs.slice(startIndex, startIndex + this.pageSize)
    }
  },
  watch: {
    type() {
      this.getCurrentLogs()
    },
    range() {
      this.getCurrentLogs()
    }
  },
  methods: {
    goto(pageNo) {
      this.currentPage = pageNo
    },
    async getCurrentLogs() {
      let time = moment()

      if (this.range === 'month') {
        time = moment().subtract(1, 'months')
      } else if (this.range === 'quarter') {
        time = moment().subtract(3, 'months')
      } else if (this.range === 'year') {
        time = moment().subtract(1, 'years')
      }

      await getLogs({
        type: this.type,
        time: time.unix()
      })
    },
    logTypeFormatter(row) {
      return logType[String(row.timelineType)]
    },
    dateFormatter(row) {
      return toHumanTime(row.createdAt, 'YYYY-MM-DD')
    }
  },
  async mounted() {
    await getLogs()
  }
}
</script>

<style scoped>
  .log-table {
    margin-top: 40px;
    margin-bottom: 20px;
  }
  .radio {
    margin-left: 50px;
  }
</style>
