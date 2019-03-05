
<template>
  <div class="qwt-dashboard">
    <main>
      <dashboard-header />
      <section>
        <p class="tip">搜狗渠道无法提供今天的数据；百度、360和神马渠道今天的数据存在一定延时，且最近1小时内的展现数据会存在波动。</p>
        <aside>选择渠道:</aside>
        <span>
          <i class="badge" v-for="(t, i) in semPlatformOpts" :key="i"
            :aria-checked="query.channel === t.value"
            @click="query.channel = t.value">
            {{ t.label }}
          </i>
        </span>
      </section>

      <section>
        <aside>推广日期:</aside>
        <span>
          <i class="badge" v-for="(t, i) in timeTypes" :key="i"
            :aria-checked="query.timeType === t.value"
            @click="query.timeType = t.value">
            {{ t.label }}
          </i>
          <el-date-picker size="small" v-if="query.timeType === 'custom'"
            type="daterange" placeholder="选择日期"
            format="yyyy-MM-dd" v-model="query.timeRange">
          </el-date-picker>
        </span>
      </section>

      <section>
        <aside>推广设备:</aside>
        <span>
          <i class="badge"
            v-for="d of allDevices" :key="d.value"
            :aria-checked="query.device === d.value"
            @click="query.device = d.value">
            {{ d.label }}
          </i>
        </span>
      </section>

      <section>
        <aside>数据维度:</aside>
        <span>
          <i class="badge" v-for="d of allDimensions" :key="d.value"
            :aria-checked="query.dimension === d.value"
            @click="query.dimension = d.value">
            {{ d.label }}
          </i>
        </span>
      </section>

      <section>
        <aside>计划ID：</aside>
        <el-input v-model.trim="searchCampaigns" size="mini" class="search" placeholder="输入计划ID，多个计划使用英文逗号分隔">

        </el-input>
      </section>

      <data-detail :statistics="statistics" :summary="summary"
        :offset="offset" :total="total" :limit="limit"
        :dimension="query.dimension"
        @switch-to-campaign-report="getCampaignReport"
        @current-change="queryStatistics">
      </data-detail>

    </main>
  </div>
</template>

<script>
import DashboardHeader from './dashboard-header'
import DataDetail from './data-detail'

import { toTimestamp } from 'utils'

import {
  DIMENSION_CAMPAIGN,
  DIMENSION_KEYWORD,
  TIME_UNIT_DAY,
  DEVICE_ALL,
  DEVICE_WAP,

  allDimensions,
  allTimeUnits,
  allDevices,
  timeTypes,
  campaignFields,
  keywordFields
} from 'constant/fengming-report'

import {
  SEM_PLATFORM_SHENMA,
  SEM_PLATFORM_BAIDU,
  semPlatformOpts
} from 'constant/fengming'

import {
  getCampaignInfo
} from 'api/fengming'

import track from 'util/track'

import store from './store'

export default {
  name: 'qwt-dashboard',
  components: {
    DataDetail,
    DashboardHeader
  },
  fromMobx: {
    statistics: () => store.statistics,
    summary: () => store.summary,
    offset: () => store.offset,
    limit: () => store.limit,
    total: () => store.total
  },
  props: {
    userInfo: Object,
    salesInfo: Object
  },
  data() {
    return {
      SEM_PLATFORM_SHENMA,
      DEVICE_WAP,

      semPlatformOpts,
      allDimensions,
      allTimeUnits,
      timeTypes,

      query: {
        timeType: timeTypes[0].value,
        timeRange: [Date.now(), Date.now()],
        dimension: DIMENSION_CAMPAIGN,
        channel: SEM_PLATFORM_BAIDU,
        timeUnit: TIME_UNIT_DAY,
        device: DEVICE_ALL
      },

      searchCampaigns: ''
    }
  },
  computed: {
    checkedCampaignIds() {
      return String(this.searchCampaigns).split(',')
    },
    normalUserId() {
      return this.salesInfo.userId || this.userInfo.id
    },
    allDevices() {
      if (this.query.channel === SEM_PLATFORM_SHENMA) {
        return allDevices.filter(d => d.value === DEVICE_ALL)
      }

      return allDevices
    }
  },
  methods: {
    async queryStatistics(opts = {}) {
      const offset = opts.offset || 0
      const { query, checkedCampaignIds } = this

      let startAt
      let endAt

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
        startAt,
        endAt,

        dataDimension: query.dimension,
        timeUnit: query.timeUnit,
        device: query.device,
        channel: query.channel,
        campaignIds: checkedCampaignIds,

        limit: 100,
        offset,

        fields: query.dimension === DIMENSION_CAMPAIGN
          ? campaignFields
          : keywordFields
      }


      await store.getReport(q)
    },
    async getCampaignReport(campaign) {
      this.query.channel = campaign.channel
      this.query.device = DEVICE_ALL
      this.query.dimension = DIMENSION_KEYWORD
      this.searchCampaigns = campaign.campaignId
    },
  },
  watch: {
    query: {
      deep: true,
      handler: async function(v) {
        await this.queryStatistics()
      }
    },
    searchCampaigns () {
      this.queryStatistics()
    }
  },
  async mounted() {
    await this.queryStatistics()

    setTimeout(() => {
      const { userInfo } = this

      track({
        action: 'qwt-dashboard: enter page',
        baixingId: userInfo.baixingId,
        baxId: userInfo.id
      })
    }, 1200)
  }
}
</script>

<style lang="postcss" scoped>
@import '../../cssbase/var';
@import 'cssbase/mixin';

.add-campaign-btn {
  @mixin center;
  display: inline-flex;
  width: 84px;
  height: 22px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.67;
  color: #666666;
  border-radius: 4px;
  border: dashed 1px #d9d9d9;
  background: white;
  cursor: pointer;

  & > i {
    margin-right: 8px;
    font-size: 10px;
  }
}

.tip {
  font-size: 12px;
  color: var(--c-tip-gray);
  margin-bottom: 20px;
}

.badge {
  @mixin center;
  height: 24px;
  min-width: 74px;
  margin-right: 30px;
  padding: 0 10px;
  cursor: pointer;
  border-radius: 4px;
  background: #eff2f7;
  font-size: 13px;
  line-height: 1.08;
  text-align: center;
  color: #6a778c;

  &[aria-checked="true"] {
    background: var(--qwt-c-orange) !important;
    color: white !important;
  }
}

.el-icon-plus {
  cursor: pointer;
}

.el-tag {
  margin: 5px 5px 0 0;
}

.kw-list {
  display: flex;
  flex-flow: column;
  max-width: 620px;
}

.qwt-dashboard {
  width: 100%;
  & > main {
    background-color: #fff;
    border-radius: 4px;
    padding: 20px 35px;
    & > section {
      margin: 20px 0;

      & > aside {
        font-size: 14px;
        color: #6a778c;
        min-width: 90px;
      }

      & > span {
        display: inline-flex;
        align-items: center;
      }
    }

    & > section:last-child {
      & > aside {
        width: 135px;
        min-width: 135px;
      }
    }
  }
}
.search {
  width: 300px;
}
</style>
