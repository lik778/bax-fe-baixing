
<template>
  <div class="qwt-dashboard">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 数据报表</label>
    </topbar>
    <main>
      <section>
        <aside>选择渠道:</aside>
        <span>
          <bax-select :options="semPlatformOpts" :clearable="false"
            v-model="query.channel">
          </bax-select>
          <label class="tip">
            搜狗渠道无法提供今天的数据；百度和360渠道今天的数据存在一定延时，且最近1小时内的展现数据会存在波动。
          </label>
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
          <el-date-picker v-if="query.timeType === 'custom'"
            type="daterange" placeholder="选择日期"
            format="yyyy-MM-dd" v-model="query.timeRange">
          </el-date-picker>
        </span>
      </section>
      <section>
        <aside>推广设备:</aside>
        <span>
          <i class="badge" v-for="d of allDevices" :key="d.value"
            :aria-checked="query.device === d.value"
            @click="query.device = d.value">
            {{ d.label }}
          </i>
        </span>
      </section>
      <section>
        <aside>时间单位:</aside>
        <span>
          <i class="badge" v-for="d of allTimeUnits" :key="d.value"
            :aria-checked="query.timeUnit === d.value"
            @click="query.timeUnit = d.value">
            {{ d.label }}
          </i>
        </span>
      </section>
      <section>
        <aside>数据维度:</aside>
        <span>
          <i class="badge" v-for="d of allDimensions" :key="d.value"
            :aria-checked="query.dimension === d.value"
            @click="changeDimension(d.value)">
            {{ d.label }}
          </i>
        </span>
      </section>
      <section>
        <aside>计划/关键词筛选:</aside>
        <span class="kw-list">
          <div>
            <el-tag v-for="c in displayCheckedCampaigns" closable
              type="success" :key="'c-' + c.id"
              @close="removeCampaign(c)">
              {{ '计划：' + c.id }}
            </el-tag>
            <el-tag v-for="k in displayCheckedKeywords" closable
              type="success" :key="'k-' + k.id"
              @close="removeKeyword(k)">
              {{ k.word }}
            </el-tag>
            <i class="el-icon-plus"
              @click="pksDialogVisible = true">
            </i>
          </div>
          <div class="switch"
            v-if="kwListTotalSize > kwListLimitSize">
            <p v-if="!kwListExpand" @click="kwListExpand = true">
              展开
            </p>
            <p v-if="kwListExpand" @click="kwListExpand = false">
              合起
            </p>
          </div>
        </span>
      </section>
      <data-trend :statistics="statistics"></data-trend>
      <data-detail :statistics="statistics" :summary="summary"
        :offset="offset" :total="total" :limit="limit"
        :dimension="query.dimension"
        @download="() => queryStatistics({}, 'download')"
        @current-change="queryStatistics">
      </data-detail>
      <plan-keyword-selector
        :visible="pksDialogVisible"
        :channel="query.channel"
        :dimension="query.dimension"
        :userId="userId"
        :campaign-ids="query.checkedCampaigns.map(c => c.id)"
        :keyword-ids="query.checkedKeywords.map(k => k.id)"
        @ok="pksDialogVisible = false"
        @clear="clearCheckedKeywordsAndCampaigns"
        @select-campaign="selectCampaign"
        @remove-campaign="removeCampaign"
        @select-keyword="k => query.checkedKeywords.push(k)"
        @remove-keyword="removeKeyword">
      </plan-keyword-selector>
      <download-dialog
        :visible="downloadDialogVisible"
        @ok="downloadDialogVisible = false">
      </download-dialog>
    </main>
  </div>
</template>

<script>
import PlanKeywordSelector from 'com/common/plan-keyword-selector'
import BaxSelect from 'com/common/select'
import Topbar from 'com/topbar'

import DownloadDialog from './download-dialog'
import DataDetail from './data-detail'
import DataTrend from './data-trend'

import { Message } from 'element-ui'
import { toTimestamp } from 'utils'
import moment from 'moment'

import {
  DIMENSION_CAMPAIGN,
  DIMENSION_KEYWORD,
  TIME_UNIT_DAY,
  DEVICE_ALL,

  allDimensions,
  allTimeUnits,
  allDevices,
  fields
} from 'constant/fengming-report'

import {
  SEM_PLATFORM_BAIDU,

  semPlatformOpts
} from 'constant/fengming'

import {
  clearStatistics,
  getCampaignInfo,
  downloadCsv,
  getReport
} from './action'

import store from './store'

const timeTypes = [{
  label: '今日',
  value: 'today',
  getTime: () => ({
    startAt: moment().subtract('1', 'days').unix(),
    endAt: moment().unix()
  })
}, {
  label: '昨日',
  value: 'yesterday',
  getTime: () => ({
    startAt: moment().subtract('2', 'days').unix(),
    endAt: moment().subtract('1', 'days').unix()
  })
}, {
  label: '近7天',
  value: 'last-7-days',
  getTime: () => ({
    startAt: moment().subtract('7', 'days').unix(),
    endAt: moment().unix()

  })
}, {
  label: '本月',
  value: 'this-month',
  getTime: () => ({
    startAt: moment().startOf('month').unix(),
    endAt: moment().unix()
  })
}, {
  label: '上月',
  value: 'last-month',
  getTime: () => ({
    startAt: moment().subtract(1, 'month').startOf('month').unix(),
    endAt: moment().subtract(1, 'month').endOf('month').unix()
  })
}, {
  label: '自定义',
  value: 'custom'
}]

export default {
  name: 'qwt-dashboard',
  store,
  components: {
    PlanKeywordSelector,
    DownloadDialog,
    DataDetail,
    DataTrend,
    BaxSelect,
    Topbar
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
      pksDialogVisible: false,
      kwListExpand: false,
      kwListLimitSize: 15,

      semPlatformOpts,
      allDimensions,
      allTimeUnits,
      allDevices,
      timeTypes,

      query: {
        timeType: timeTypes[0].value,
        timeRange: [],

        checkedCampaigns: [],
        checkedKeywords: [],

        dimension: DIMENSION_CAMPAIGN,
        channel: SEM_PLATFORM_BAIDU,
        timeUnit: TIME_UNIT_DAY,
        device: DEVICE_ALL
      }
    }
  },
  computed: {
    displayCheckedCampaigns() {
      const { kwListExpand, kwListLimitSize, query } = this

      if (kwListExpand) {
        return query.checkedCampaigns
      }

      return query.checkedCampaigns.slice(0, kwListLimitSize)
    },
    displayCheckedKeywords() {
      const { kwListExpand, kwListLimitSize, query } = this

      if (kwListExpand) {
        return query.checkedKeywords
      }

      if (query.checkedCampaigns.length >= kwListLimitSize) {
        return []
      }

      return query.checkedKeywords
        .slice(0, kwListLimitSize - query.checkedCampaigns.length)
    },
    kwListTotalSize() {
      const { query } = this
      return query.checkedCampaigns.length + query.checkedKeywords.length
    },
    userId() {
      return this.$route.query.userId || this.userInfo.id
    }
  },
  methods: {
    async queryStatistics(opts = {}, action = 'query') {
      const offset = opts.offset || 0
      const { query } = this

      let startAt
      let endAt

      if (!(query.checkedCampaigns.length + query.checkedKeywords.length)) {
        clearStatistics()
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
        startAt,
        endAt,

        dataDimension: query.dimension,
        timeUnit: query.timeUnit,
        device: query.device,

        limit: 100,
        offset,

        fields
      }

      if (query.checkedCampaigns.length) {
        q.campaignIds = query.checkedCampaigns.map(c => c.id)
      }

      if (query.checkedKeywords.length) {
        q.keywordIds = query.checkedKeywords.map(k => k.id)
      }

      if (action === 'download') {
        await downloadCsv(q)
        this.downloadDialogVisible = true
      } else {
        await getReport(q)
      }
    },
    async changeDimension(value) {
      // if (this.query.checkedKeywords.length &&
      //   value === DIMENSION_CAMPAIGN) {
      //   return Message.error('你当前选择了关键词，不能按计划维度查询数据')
      // }

      await this.clearCheckedKeywordsAndCampaigns()

      this.query.dimension = value
    },
    selectCampaign(campaign) {
      const ids = this.query.checkedCampaigns.map(c => c.id)
      if (ids.includes(campaign.id)) {
        return
      }

      this.query.checkedCampaigns.push(campaign)
    },
    removeCampaign(campaign) {
      this.query.checkedCampaigns = this.query.checkedCampaigns
        .filter(c => c.id !== campaign.id)
    },
    selectKeyword(keyword) {
      const ids = this.query.checkedKeywords.map(k => k.id)
      if (ids.includes(keyword.id)) {
        return
      }

      this.query.checkedKeywords.push(keyword)
    },
    removeKeyword(keyword) {
      this.query.checkedKeywords = this.query.checkedKeywords
        .filter(k => k.id !== keyword.id)
    },
    async clearCheckedKeywordsAndCampaigns() {
      this.query.checkedCampaigns = []
      this.query.checkedKeywords = []
      await clearStatistics()
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
      this.query.checkedCampaigns = []
      this.query.checkedKeywords = []
    },
    'query.dimension': async function() {
      await this.clearCheckedKeywordsAndCampaigns()
    },
    'query.checkedKeywords': function(kws) {
      if (kws.length) {
        this.query.dimension = DIMENSION_KEYWORD
      }
    }
  },
  async mounted() {
    const { query } = this.$route
    if (query.campaignId) {
      const campaign = await getCampaignInfo(query.campaignId)
      this.query.checkedKeywords = campaign.keywords
      this.query.channel = campaign.source
      this.query.timeType = timeTypes[0].value
      this.query.device = DEVICE_ALL
      this.query.timeUnit = TIME_UNIT_DAY
      this.query.dimension = DIMENSION_KEYWORD
    }
  }
}
</script>

<style scoped>

@import '../../cssbase/var';
@import 'cssbase/mixin';

.tip {
  margin-left: 5px;
  font-size: 12px;
  color: var(--c-tip-gray);
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
    background: #009cff !important;
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

  & > .switch {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
    padding-top: 5px;
    border-top: 1px solid #dde1e6;
    font-size: 13px;
    color: #6a778c;
    cursor: pointer;
  }
}

.qwt-dashboard {
  padding: 0 35px;
  width: 100%;

  & > main {
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

</style>
