
<template>
  <div class="mvp-dashboard">
    <topbar :user-info="userInfo" :back="false"></topbar>
    <main>
      <step :step="1"></step>
      <header>

      </header>
      <data-trend></data-trend>
      <data-detail></data-detail>
      <download-dialog></download-dialog>
    </main>
  </div>
</template>

<script>
import DownloadDialog from './download-dialog'
import DataDetail from './data-detail'
import DataTrend from './data-trend'
import Topbar from 'com/topbar'
import Step from './step'

import { Message } from 'element-ui'
import { toTimestamp } from 'utils'

import {
  TIME_UNIT_DAY,
  DEVICE_PC,

  allTimeUnits,
  allDevices,
  timeTypes
} from 'constant/fengming-report'

import {
  semPlatformOpts
} from 'constant/fengming'

import store from './store'

export default {
  name: 'mvp-dashboard',
  components: {
    DownloadDialog,
    DataDetail,
    DataTrend,
    Topbar,
    Step
  },
  fromMobx: {
    statistics: () => store.statistics,
    summary: () => store.summary,
    offset: () => store.offset,
    limit: () => store.limit,
    total: () => store.total
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      downloadDialogVisible: false,

      semPlatformOpts,
      allTimeUnits,
      allDevices,
      timeTypes,

      query: {
        campaignIds: [],
        timeUnit: TIME_UNIT_DAY,
        device: DEVICE_PC,
        timeRange: []
      }
    }
  },
  methods: {
    async queryStatistics(opts = {}, action = 'query') {
      const offset = opts.offset || 0
      const { query } = this

      let startAt
      let endAt

      if (!query.checkedCampaigns.length) {
        store.clearStatistics()
        if (action === 'download') {
          Message.error('请选择查询条件')
        }
        return
      }

      if (query.timeType === 'custom') {
        startAt = toTimestamp(query.timeRange[0], 'YYYY-MM-DD')
        endAt = toTimestamp(query.timeRange[1], 'YYYY-MM-DD')
      } else {
        const t = timeTypes
          .find(t => t.value === query.timeType)
          .getTime()

        startAt = t.startAt
        endAt = t.endAt
      }

      const q = {
        campaignIds: query.checkedCampaigns.map(c => c.id),
        timeUnit: query.timeUnit,
        device: query.device,

        limit: 100,
        offset,
        startAt,
        endAt
      }

      if (action === 'download') {
        await store.downloadCsv(q)
        this.downloadDialogVisible = true
      } else {
        await store.getReport(q)
      }
    }
  },
  async mounted() {

  }
}
</script>

<style scoped>
.mvp-dashboard {
  width: 100%;
}
</style>
