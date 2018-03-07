
<template>
  <div class="mvp-dashboard">
    <topbar :user-info="userInfo" :back="false"></topbar>
    <main>
      <step :step="1"></step>
      <header>
        <div class="step">
          <i class="c-badge">1</i>
          <label>选择数据纬度：</label>
        </div>
        <section>
          <label>选择渠道：</label>
          <span>
            <i class="badge" v-for="(p, i) in semPlatformOpts" :key="i"
              :aria-checked="query.source === p.value"
              @click="query.source = p.value">
              {{ p.label }}
            </i>
          </span>
        </section>
        <section>
          <label>推广日期：</label>
          <span>
            <i class="badge" v-for="(t, i) in timeTypes" :key="i"
              :aria-checked="query.timeType === t.value"
              @click="query.timeType = t.value">
              {{ t.label }}
            </i>
            <el-date-picker v-if="query.timeType === 'custom'"
              size="mini" type="daterange" placeholder="选择日期"
              format="yyyy-MM-dd" v-model="query.timeRange">
            </el-date-picker>
          </span>
        </section>
        <section>
          <label>推广设备：</label>
          <span>
            <i class="badge" v-for="(d, i) in allDevices" :key="i"
              :aria-checked="query.device === d.value"
              @click="query.device = d.value">
              {{ d.label }}
            </i>
          </span>
        </section>
        <section>
          <label>时间单位：</label>
          <span>
            <i class="badge" v-for="t of allTimeUnits" :key="t.value"
              :aria-checked="query.timeUnit === t.value"
              @click="query.timeUnit = t.value">
              {{ t.label }}
            </i>
          </span>
        </section>
        <section>
          <label>计划筛选：</label>
          <span>
            <bax-select clearable multiple
            :options="campaignOpts"
            @change="v => query.campaignIds = v" />
          </span>
        </section>
      </header>
      <section>
        <div class="step">
          <i class="c-badge">2</i>
          <label>数据走势图：</label>
        </div>
        <data-trend :statistics="statistics">
        </data-trend>
      </section>
      <section>
        <div class="step">
          <i class="c-badge">3</i>
          <label>数据详情：</label>
        </div>
        <data-detail :statistics="statistics" :summary="summary"
          :offset="offset" :limit="limit" :total="total"
          @current-change="queryStatistics"
          @download="() => queryStatistics({}, 'download')">
        </data-detail>
      </section>
      <download-dialog
        :visible="downloadDialogVisible"
        @ok="downloadDialogVisible = false">
      </download-dialog>
    </main>
  </div>
</template>

<script>
import DownloadDialog from './download-dialog'
import BaxSelect from 'com/common/select'
import DataDetail from './data-detail'
import DataTrend from './data-trend'
import Topbar from 'com/topbar'
import Step from './step'

import { Message } from 'element-ui'
import { toTimestamp } from 'utils'

import {
  DIMENSION_CAMPAIGN,
  TIME_UNIT_DAY,
  DEVICE_WAP,

  allTimeUnits,
  allDevices,
  timeTypes
} from 'constant/fengming-report'

import {
  SEM_PLATFORM_BAIDU,
  semPlatformOpts
} from 'constant/fengming'

import store from './store'

export default {
  name: 'mvp-dashboard',
  components: {
    DownloadDialog,
    DataDetail,
    DataTrend,
    BaxSelect,
    Topbar,
    Step
  },
  fromMobx: {
    allCampaigns: () => store.allCampaigns,
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

      allTimeUnits,
      timeTypes,

      query: {
        timeType: timeTypes[0].value,
        source: SEM_PLATFORM_BAIDU,
        timeUnit: TIME_UNIT_DAY,
        device: DEVICE_WAP,
        campaignIds: [],
        timeRange: []
      }
    }
  },
  computed: {
    semPlatformOpts() {
      return semPlatformOpts.filter(s => s.value === SEM_PLATFORM_BAIDU)
    },
    campaignOpts() {
      return this.allCampaigns.map(c => ({
        label: 'ID:' + c.id,
        value: c.id
      }))
    },
    allDevices() {
      return allDevices.filter(d => d.value === DEVICE_WAP)
    }
  },
  methods: {
    async queryStatistics(opts = {}, action = 'query') {
      const offset = opts.offset || 0
      const { query } = this

      let startAt
      let endAt

      if (!query.campaignIds.length) {
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
        dataDimension: DIMENSION_CAMPAIGN,
        campaignIds: query.campaignIds,
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
  watch: {
    query: {
      deep: true,
      handler: async function() {
        await this.queryStatistics()
      }
    },
    'query.channel': function() {
      this.query.campaignIds = []
    }
  },
  async mounted() {
    const { source } = this.query
    await store.queryCampaigns({
      sources: [source]
    })
  }
}
</script>

<style scoped>
@import '../../cssbase/var';
@import 'cssbase/mixin';

.c-badge {
  @mixin center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  line-height: 1.5;
  background: var(--qwt-c-blue);
}

.badge {
  @mixin center;
  height: 26px;
  min-width: 72px;
  margin-right: 8px;
  padding: 0 10px;
  cursor: pointer;
  border-radius: 4px;
  background: #f3f3f3;
  font-size: 13px;
  color: #666666;

  &[aria-checked="true"] {
    background: var(--qwt-c-blue) !important;
    color: white !important;
  }
}

.mvp-dashboard {
  width: 100%;

  & .step {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #666666;

    & > label {
      margin-left: 14px;
    }
  }

  & > main {
    padding: 10px 10px 80px;
    background: var(--qwt-c-gray);

    & > header {
      margin-top: 10px;
      padding: 20px 16px;
      background: white;

      & > section {
        display: flex;
        margin-top: 20px;
        padding-left: 36px;

        & > label {
          margin-right: 10px;
          font-weight: 500;
          line-height: 1.31;
          color: #666666;
        }

        & > span {
          display: flex;
          align-items: center;
        }
      }
    }

    & > section {
      margin-top: 10px;
      padding: 10px;
      background: white;
    }
  }
}
</style>
