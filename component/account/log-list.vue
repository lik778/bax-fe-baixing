<template>
  <div class="layout-container">
    <section-header>历史操作记录</section-header>
    <label>选择查询项目</label>
    <bax-select v-model="type"
      :clearable="false"
      placeholder="请选择"
      :options="logTypeOpts"
      @click.native="onClickLogType">
    </bax-select>
    <el-radio-group v-model="range" class="radio"
      @click.native="onClickRange">
      <el-radio-button label="month">近一个月</el-radio-button>
      <el-radio-button label="quarter">近三个月</el-radio-button>
      <el-radio-button label="year">近一年</el-radio-button>
    </el-radio-group>

    <el-table class="log-table"
      :data="logs"
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
        :formatter="logDescFormatter"
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
import BaxSelect from 'com/common/select'

import { toHumanTime } from 'utils'
import moment from 'moment'

import { getLogDesc } from 'util/log'
import track from 'util/track'

import store from './store'

import {
  LOG_TYPE_CAMPAIGN,
  logTypeOpts,
  logType
} from 'constant/log'

export default {
  name: 'qwt-operastion-log-list',
  components: {
    SectionHeader,
    BaxSelect
  },
  fromMobx: {
    logQuery: () => store.logQuery,
    logs: () => store.logs
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      logTypeOpts,

      range: 'month',
      type: String(LOG_TYPE_CAMPAIGN),

      currentPage: 1,
      pageSize: 20
    }
  },
  computed: {
    startTime() {
      let time = moment()

      if (this.range === 'month') {
        time = moment().subtract(1, 'months')
      } else if (this.range === 'quarter') {
        time = moment().subtract(3, 'months')
      } else if (this.range === 'year') {
        time = moment().subtract(1, 'years')
      }
      return time.unix()
    }
  },
  methods: {
    onClickLogType() {
      track({
        action: 'operation-log: click log type'
      })
    },
    onClickRange() {
      track({
        action: 'operation-log: click log range'
      })
    },
    async load() {
      await store.getLogs({
        pageSize: this.pageSize,
        offset: this.pageSize * (this.currentPage - 1),
        type: this.type,
        time: this.startTime
      })
    },
    goto(pageNo) {
      this.currentPage = pageNo
      this.load()
    },
    logDescFormatter(row) {
      const { allAreas } = this

      if (!row.relatedLog) {
        return getLogDesc(row, { allAreas })
      }

      return row.relatedLog
    },
    logTypeFormatter(row) {
      return logType[String(row.timelineType)]
    },
    dateFormatter(row) {
      return toHumanTime(row.createdAt, 'YYYY-MM-DD HH:mm')
    }
  },
  watch: {
    type() {
      this.currentPage = 1
      this.load()
    },
    range() {
      this.currentPage = 1
      this.load()
    }
  },
  async mounted() {
    await this.load()
  }
}
</script>

<style lang="postcss" scoped>
.log-table {
  margin: 40px 0 20px;
}
.radio {
  margin-left: 50px;
}
</style>
