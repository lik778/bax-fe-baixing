
<template>
  <div class="qwt-dashboard">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 数据报表</label>
    </topbar>
    <main>
      <section>
        <aside>选择渠道:</aside>
        <span>
          <bax-select :options="semPlatformOpts"
            :clearable="false"
            :value="query.channel"
            @change="onChangeChannel">
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
        <aside>选择计划</aside>
        <span class="kw-list">
          <div>
            <el-tag v-for="c in query.checkedCampaigns" closable
              type="success" :key="'c-' + c.id"
              @close="removeCampaign(c)">
              {{ '计划：' + c.id }}
            </el-tag>
            <button class="add-campaign-btn"
              @click="openCampaignSelector">
              <i class="el-icon-plus" />
              添加计划
            </button>
          </div>
        </span>
      </section>
      <section>
        <aside>数据维度:</aside>
        <span>
          <i class="badge" v-for="d of allDimensions" :key="d.value"
            :aria-checked="query.dimension === d.value"
            @click="onChangeDimension(d.value)">
            {{ d.label }}
          </i>
        </span>
      </section>
      <data-detail :statistics="statistics" :summary="summary"
        :offset="offset" :total="total" :limit="limit"
        :dimension="query.dimension"
        @download="() => queryStatistics({}, 'download')"
        @switch-to-campaign-report="({campaignId}) => getCampaignReport(campaignId)"
        @current-change="queryStatistics">
      </data-detail>
      <campaign-selector
        :visible="campaignDialogVisible"
        :channel="query.channel"
        :userId="userId"
        :campaign-ids="query.checkedCampaigns.map(c => c.id)"
        @ok="campaignDialogVisible = false"
        @select-campaign="selectCampaign"
        @remove-campaign="removeCampaign"
        @clear="clearCheckedCampaigns" />
    </main>
  </div>
</template>

<script>
import CampaignSelector from 'com/common/campaign-selector'
import BaxSelect from 'com/common/select'
import Topbar from 'com/topbar'

import DataDetail from './data-detail'

import { toTimestamp } from 'utils'

import {
  DIMENSION_CAMPAIGN,
  DIMENSION_KEYWORD,
  TIME_UNIT_DAY,
  DEVICE_ALL,

  allDimensions,
  allTimeUnits,
  allDevices,
  timeTypes,
  fields
} from 'constant/fengming-report'

import {
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
    CampaignSelector,
    DataDetail,
    BaxSelect,
    Topbar
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
      campaignDialogVisible: false,
      hasOperated: false, // 用户已经操作过

      semPlatformOpts,
      allDimensions,
      allTimeUnits,
      allDevices,
      timeTypes,

      query: {
        timeType: timeTypes[0].value,
        timeRange: [],

        checkedCampaigns: [],

        dimension: DIMENSION_CAMPAIGN,
        channel: SEM_PLATFORM_BAIDU,
        timeUnit: TIME_UNIT_DAY,
        device: DEVICE_ALL
      }
    }
  },
  computed: {
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
      } else {
        q.campaignIds = undefined
      }

      // 特事特办
      if (this.$route.query.source === 'qwt-promotion-list' &&
        this.$route.query.campaignId &&
        !this.hasOperated) {
        q.campaignIds = [this.$route.query.campaignId | 0]
      }

      if (action === 'download') {
        await store.downloadCsv(q)
      } else {
        await store.getReport(q)
      }
    },
    async getCampaignReport(campaignId) {
      const campaign = await getCampaignInfo(campaignId)
      this.query.channel = campaign.source
      this.query.timeType = timeTypes[0].value
      this.query.device = DEVICE_ALL
      this.query.timeUnit = TIME_UNIT_DAY
      this.query.dimension = DIMENSION_KEYWORD
      this.query.checkedCampaigns = [campaign]
    },
    openCampaignSelector() {
      this.campaignDialogVisible = true
      track({
        action: 'qwt-dashboard: click campaign selector'
      })
    },
    async onChangeChannel(v) {
      this.hasOperated = true
      await this.clearCheckedCampaigns()
      this.query.channel = v
      track({
        action: 'qwt-dashboard: click channel'
      })
    },
    onChangeDimension(v) {
      this.hasOperated = true
      this.query.dimension = v
      track({
        action: 'qwt-dashboard: click dimension'
      })
    },
    selectCampaign(campaign) {
      this.hasOperated = true
      const ids = this.query.checkedCampaigns.map(c => c.id)
      if (ids.includes(campaign.id)) {
        return
      }

      this.query.checkedCampaigns.push(campaign)
    },
    removeCampaign(campaign) {
      this.hasOperated = true
      this.query.checkedCampaigns = this.query.checkedCampaigns
        .filter(c => c.id !== campaign.id)
    },
    async clearCheckedCampaigns() {
      this.query.checkedCampaigns = []
      await store.clearStatistics()
    }
  },
  watch: {
    query: {
      deep: true,
      handler: async function() {
        await this.queryStatistics()
      }
    },
    'query.timeType': () => {
      track({
        action: 'qwt-dashboard: click time range'
      })
    },
    'query.timeUnit': () => {
      track({
        action: 'qwt-dashboard: click time unit'
      })
    },
    'query.device': () => {
      track({
        action: 'qwt-dashboard: click device'
      })
    }
  },
  async mounted() {
    const { query } = this.$route
    if (query.campaignId) {
      await this.getCampaignReport(query.campaignId)
    }

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

<style scoped>
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
