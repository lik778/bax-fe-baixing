<template>
  <main>
    <dashboard-header :userInfo="userInfo" :salesInfo="salesInfo" />
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
      <el-select v-model="searchCampaigns" placeholder="请选择">
        <el-option
                v-for="item in campaignIds"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="query.dimension === DIMENSION_SEARCH_KEYWORD && item.value === 0" />
      </el-select>
    </section>
    <section v-if="query.dimension != DIMENSION_CAMPAIGN">
      <aside>单元ID：</aside>
      <el-select v-model="searchGroupId" placeholder="请选择">
        <el-option
                v-for="item in groupIds"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
      </el-select>
    </section>
    <data-detail
      :statistics="statistics"
      :summary="summary"
      :offset="offset"
      :total="total"
      :limit="limit"
      :userInfo="userInfo"
      :dimension="query.dimension"
      @switch-to-group-report="getGroupReport"
      @switch-to-keyword-report="getKeywordReport"
      @refresh="() => queryStatistics({ offset })"
      @current-change="queryStatistics"
      @sortChange="sortChange"
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
  groupFields,
  keywordFields
} from 'constant/fengming-report'
import { getCampaignIds, getGroupIds } from 'api/fengming-campaign'

import {
  SEM_PLATFORM_SHENMA,
  SEM_PLATFORM_BAIDU,
  semPlatformOpts
} from 'constant/fengming'

import store from './store'
const ORDER_TYPE_ASC = 0 // 升序
const ORDER_TYPE_DES = 1 // 降序
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
      DIMENSION_CAMPAIGN,
      DIMENSION_GROUP,
      DIMENSION_KEYWORD,
      DIMENSION_SEARCH_KEYWORD,
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

      sort: {
        orderType: '',
        sortType: ''
      },

      searchCampaigns: 0,
      searchGroupId: 0,
      campaignErrTip: false,
      campaignIds: [],
      groupIds: [
        {
          label: '全部',
          value: 0
        }
      ],
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
      return this.searchCampaigns === 0 ? [] : String(this.searchCampaigns).split(',')
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
    async sortChange ({ column, prop, order }) {
      const orderType = order === 'ascending' ? ORDER_TYPE_ASC : ORDER_TYPE_DES
      const sortType = prop
      this.sort = {
        orderType,
        sortType
      }
      await this.queryStatistics()
    },
    async queryStatistics (opts = {}) {
      const { dimension } = this.query
      const { checkedCampaignIds, sort } = this

      await store.clearStatistics()
      this.campaignErrTip = ''

      // 搜索词维度需要填写计划ID
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
        return await this._getReportByQueryWord({ ...opts, ...sort })
      }

      // 非搜索词维度，需要额外调获取计划总数据（总展现、总点击、总消费）接口
      if (
        this.searchCampaigns !== '' &&
        checkedCampaignIds.some((o) => isNaN(o))
      ) {
        this.campaignErrTip = true
        return
      }
      return await this._getReport({ ...opts, ...sort })
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
        groupId: this.searchGroupId || '',
        limit: this.limit,
        offset,
        ...opts
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

      const fields = {
        [DIMENSION_CAMPAIGN]: campaignFields,
        [DIMENSION_GROUP]: groupFields,
        [DIMENSION_KEYWORD]: keywordFields,
        [DIMENSION_SEARCH_KEYWORD]: keywordFields
      }[query.dimension]

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
        groupId: this.searchGroupId || '',
        offset,
        fields,
        ...opts
      }
      await store.fetchReport(q, campaignFields)
    },
    async getGroupReport (campaign) {
      this.query.channel = campaign.channel
      this.query.device = DEVICE_ALL
      this.query.dimension = DIMENSION_GROUP
      this.searchCampaigns = campaign.campaignId
    },
    async getKeywordReport ({ channel, campaignId }) {
      this.query.channel = channel
      this.query.dimension = DIMENSION_KEYWORD
      this.searchCampaigns = campaignId

      // // * for test suppose
      // this.searchCampaigns = '123321'
    }
  },
  watch: {
    query: {
      deep: true,
      handler: async function (newV) {
        // const { userId } = this.userInfo
        // const campaignId = this.searchCampaigns || ''
        if (newV.dimension === DIMENSION_SEARCH_KEYWORD) {
          this.searchCampaigns = this.campaignIds[1].value
        }
        await this.queryStatistics()
      }
    },
    searchCampaigns: {
      deep: true,
      handler: async function (newV, oldV) {
        const { query: { user_id: userId } } = this.$route
        await this.queryStatistics()
        const campaignId = newV
        if (campaignId) {
          const result = await getGroupIds({ userId, campaignId })
          this.groupIds = result
          this.searchGroupId = result[0].value
        } else {
          this.searchGroupId = 0
          this.groupIds = [{
            label: '全部',
            value: 0
          }]
        }
      }
    },
    searchGroupId: {
      deep: true,
      handler: async function (newV, oldV) {
        await this.queryStatistics()
      }
    }
  },
  async mounted () {
    const { userId } = this.salesInfo
    const result = await getCampaignIds({ userId })
    this.campaignIds = result
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
