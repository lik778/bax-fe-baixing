
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
        <aside>推广日期:</aside>
        <span>
          <i class="badge" :aria-checked="query.timeType === 'last-7-days'"
            @click="query.timeType = 'last-7-days'">
            近7天
          </i>
          <i class="badge" :aria-checked="query.timeType === 'last-month'"
            @click="query.timeType = 'last-month'">
            近1个月
          </i>
          <i class="badge" v-if="query.timeType !== 'custom'"
            @click="query.timeType = 'custom'">
            自定义
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
        <aside>计划/关键词筛选:</aside>
        <span class="kw-list">
          <el-tag v-for="c in query.checkedCampaigns" closable
            type="success" :key="'c-' + c.id"
            @close="removeCampaign(c)">
            {{ '计划：' + c.id }}
          </el-tag>
          <el-tag v-for="k in query.checkedKeywords" closable
            type="success" :key="'k-' + k.id"
            @close="removeKeyword(k)">
            {{ k.word }}
          </el-tag>
          <i class="el-icon-plus"
            @click="pksDialogVisible = true">
          </i>
        </span>
      </section>
      <data-trend :statistics="statistics"></data-trend>
      <data-detail :statistics="statistics" :csv-download-url="csvDownloadUrl">
      </data-detail>
      <plan-keyword-selector
        :visible="pksDialogVisible"
        :channel="query.channel"
        :userId="userId"
        :campaign-ids="query.checkedCampaigns.map(c => c.id)"
        :keyword-ids="query.checkedKeywords.map(k => k.id)"
        @ok="pksDialogVisible = false"
        @select-campaign="selectCampaign"
        @remove-campaign="removeCampaign"
        @select-keyword="k => query.checkedKeywords.push(k)"
        @remove-keyword="removeKeyword">
      </plan-keyword-selector>
    </main>
  </div>
</template>

<script>
import PlanKeywordSelector from 'com/common/plan-keyword-selector'
import BaxSelect from 'com/common/select'
import DataDetail from './data-detail'
import DataTrend from './data-trend'
import Topbar from 'com/topbar'

import { toTimestamp } from 'utils'
import moment from 'moment'
import clone from 'clone'

import {
  allDimensions,
  allTimeUnits,
  allDevices,
  fields
} from 'constant/fengming-report'

import {
  semPlatformOpts
} from 'constant/fengming'

import {
  getCsvDownloadUrl,
  clearStatistics,
  getReport
} from './action'

import store from './store'

export default {
  name: 'qwt-dashboard',
  store,
  components: {
    PlanKeywordSelector,
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
      pksDialogVisible: false,

      semPlatformOpts,
      allDimensions,
      allTimeUnits,
      allDevices,

      query: {
        timeType: 'last-7-days', // 'last-7-days', 'last-month', 'custom'
        timeRange: [],

        checkedCampaigns: [],
        checkedKeywords: [],

        dimension: 0,
        timeUnit: 1,
        channel: 5,
        device: 0
      }
    }
  },
  computed: {
    userId() {
      return this.$route.query.userId || this.userInfo.id
    }
  },
  methods: {
    async queryStatistics() {
      const { query } = this

      let startAt
      let endAt

      if (!(query.checkedCampaigns.length + query.checkedKeywords.length)) {
        clearStatistics()
        return
      }

      if (query.timeType === 'custom') {
        startAt = toTimestamp(query.timeRange[0], 'YYYY-MM-DD')
        endAt = toTimestamp(query.timeRange[1], 'YYYY-MM-DD')
      } else if (query.timeType === 'last-month') {
        startAt = moment().subtract('1', 'month').unix()
        endAt = moment().unix()
      } else {
        // 7 days
        startAt = moment().subtract('7', 'days').unix()
        endAt = moment().unix()
      }

      const q = {
        startAt,
        endAt,

        dataDimension: query.dimension,
        timeUnit: query.timeUnit,
        device: query.device,

        offset: 0,
        limit: 100,

        fields
      }

      if (query.checkedCampaigns.length) {
        q.campaignIds = query.checkedCampaigns.map(c => c.id)
      }

      if (query.checkedKeywords.length) {
        q.keywordIds = query.checkedKeywords.map(k => k.id)
      }

      await Promise.all([
        getCsvDownloadUrl(q),
        getReport(q)
      ])
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
  align-items: center;
  flex-wrap: wrap;
  max-width: 620px;
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
