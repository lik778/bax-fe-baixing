<template>
  <main>
    <dashboard-header :userInfo="userInfo" />
    <section>
      <p class="tip">
        <span v-if="query.dimension === DIMENSION_SEARCH_KEYWORD">
          搜狗和360渠道无法提供今天的数据；百度、神马渠道今天的数据存在一定延时，且最近1小时内的数据会存在波动
        </span>
        <span v-else>
          搜狗渠道无法提供今天的数据；百度、360和神马渠道今天的数据存在一定延时，且最近1小时内的展现数据会存在波动
        </span>
      </p>
      <aside>选择渠道:</aside>
      <span>
        <i
          class="badge"
          v-for="(t, i) in semPlatformOpts"
          :key="i"
          :aria-checked="query.channel === t.value"
          @click="query.channel = t.value"
        >
          {{ t.label }}
        </i>
      </span>
    </section>
    <section>
      <aside>推广日期:</aside>
      <span>
        <i
          class="badge"
          v-for="(t, i) in timeTypes"
          :key="i"
          :aria-checked="query.timeType === t.value"
          @click="query.timeType = t.value"
        >
          {{ t.label }}
        </i>
        <el-date-picker
          size="small"
          v-if="query.timeType === 'custom'"
          type="daterange"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          v-model="query.timeRange"
          :picker-options="triPickerOptions"
        >
        </el-date-picker>
      </span>
    </section>
    <section>
      <aside>推广设备:</aside>
      <span>
        <i
          class="badge"
          v-for="d of allDevices"
          :key="d.value"
          :aria-checked="query.device === d.value"
          @click="query.device = d.value"
        >
          {{ d.label }}
        </i>
      </span>
    </section>
    <section>
      <aside>数据维度:</aside>
      <span>
        <i
          class="badge"
          v-for="d of allDimensions"
          :key="d.value"
          :aria-checked="query.dimension === d.value"
          @click="query.dimension = d.value"
        >
          {{ d.label }}
        </i>
      </span>
    </section>
    <section>
      <aside>计划ID：</aside>
      <el-input
        v-model.trim="searchCampaigns"
        size="mini"
        ref="campaignInput"
        class="search"
        placeholder="输入计划ID，多个计划使用英文逗号分隔"
      />
      <span v-if="campaignErrTip" class="err-tip">
        <b v-if="query.dimension === DIMENSION_SEARCH_KEYWORD"
          >请输入计划ID, 搜索词报告计划ID只能单个查询</b
        >
        <b v-else>请输入数字类型的计划ID</b>
      </span>
    </section>
    <data-detail
      :statistics="statistics"
      :summary="summary"
      :offset="offset"
      :total="total"
      :limit="limit"
      :dimension="query.dimension"
      @switch-to-group-report="getGroupReport"
      @switch-to-campaign-report="getCampaignReport"
      @refresh-keyword-list="queryStatistics({ offset })"
      @current-change="queryStatistics"
    >
    </data-detail>
  </main>
</template>

<script>
import DashboardHeader from './dashboard-header'
import DataDetail from './data-detail'
import dayjs from 'dayjs'

import { toTimestamp } from 'utils'

import {
  DIMENSION_CAMPAIGN,
  DIMENSION_GROUP,
  DIMENSION_KEYWORD,
  DIMENSION_SEARCH_KEYWORD,
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

import store from './store'

export default {
  name: 'SummaryData',
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
  data () {
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

      searchCampaigns: '',
      campaignErrTip: false,
      DIMENSION_SEARCH_KEYWORD,
      triPickerOptions: {
        disabledDate (time) {
          const timestamp = new Date(time).getTime()
          const today = dayjs().startOf(1, 'day').valueOf()
          const lastYear = dayjs().subtract(1, 'year').valueOf()
          return timestamp > today || timestamp < lastYear
        }
      }
    }
  },
  computed: {
    checkedCampaignIds () {
      return String(this.searchCampaigns).split(',')
    },
    normalUserId () {
      return this.salesInfo.userId || this.userInfo.id
    },
    allDevices () {
      if (this.query.channel === SEM_PLATFORM_SHENMA) {
        return allDevices.filter((d) => d.value === DEVICE_ALL)
      }

      return allDevices
    }
  },
  methods: {
    async queryStatistics (opts = {}) {
      const { dimension } = this.query
      const { checkedCampaignIds } = this

      await store.clearStatistics()
      this.campaignErrTip = ''

      if (dimension === DIMENSION_SEARCH_KEYWORD) {
        if (
          this.searchCampaigns === '' ||
          checkedCampaignIds.length > 1 ||
          checkedCampaignIds.some((o) => isNaN(o))
        ) {
          this.$refs.campaignInput.focus()
          this.campaignErrTip = true
          return
        }
        return await this._getReportByQueryWord(opts)
      }
      if (
        this.searchCampaigns !== '' &&
        checkedCampaignIds.some((o) => isNaN(o))
      ) {
        this.campaignErrTip = true
        return
      }
      return await this._getReport(opts)
    },
    async _getReportByQueryWord (opts = {}) {
      const offset = opts.offset || 0
      const { query, checkedCampaignIds } = this
      const { userId, salesId } = this.salesInfo

      let startDate
      let endDate

      if (query.timeType === 'custom') {
        startDate = toTimestamp(query.timeRange[0], 'YYYY-MM-DD')
        endDate = toTimestamp(query.timeRange[1], 'YYYY-MM-DD')
      } else {
        const t = timeTypes.find((t) => t.value === query.timeType).getTime()

        startDate = t.startAt
        endDate = t.endAt
      }

      const q = {
        startDate,
        endDate,

        device: query.device,
        channel: query.channel,
        campaignIds: checkedCampaignIds,
        userId,
        salesId,

        limit: this.limit,
        offset
      }
      await store.fetchReportByQueryWord(q)
    },
    async _getReport (opts = {}) {
      const offset = opts.offset || 0
      const { query, checkedCampaignIds } = this
      const { userId, salesId } = this.salesInfo

      let startAt
      let endAt

      if (query.timeType === 'custom') {
        startAt = toTimestamp(query.timeRange[0], 'YYYY-MM-DD')
        endAt = toTimestamp(query.timeRange[1], 'YYYY-MM-DD')
      } else {
        const t = timeTypes.find((t) => t.value === query.timeType).getTime()

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
        userId,
        salesId,
        limit: this.limit,
        offset,
        fields: query.dimension === DIMENSION_CAMPAIGN
          ? campaignFields
          : keywordFields
      }
      await store.fetchReport(q)
    },
    async getGroupReport (campaign) {
      this.query.channel = campaign.channel
      this.query.device = DEVICE_ALL
      this.query.dimension = DIMENSION_GROUP
      this.searchCampaigns = campaign.campaignId
    },
    async getCampaignReport (campaign) {
      this.query.channel = campaign.channel
      this.query.device = DEVICE_ALL
      this.query.dimension = DIMENSION_KEYWORD
      this.searchCampaigns = campaign.campaignId
    }
  },
  watch: {
    query: {
      deep: true,
      handler: async function () {
        await this.queryStatistics()
      }
    },
    searchCampaigns () {
      this.queryStatistics()
    }
  },
  async mounted () {
    await this.queryStatistics()
  }
}
</script>

<style lang="scss" scoped>
.add-campaign-btn {
  @include center;
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
  color: #717d91;
  margin-bottom: 20px;
}

.badge {
  @include center;
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

  &[aria-checked='true'] {
    background: $qwt-c-orange !important;
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

.err-tip {
  margin-left: 8px;
  color: #ff8273;
  font-size: 12px;
}

main {
  & > section {
    margin: 20px;
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
.search {
  width: 300px;
}
</style>
