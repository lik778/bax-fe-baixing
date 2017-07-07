
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
        </span>
      </section>
      <section>
        <aside>数据维度:</aside>
        <span>
          <i v-for="d of allDimensions" :key="d.value"
            :aria-checked="query.dimension === d.value"
            @click="query.dimension = d.value">
            {{ d.label }}
          </i>
        </span>
      </section>
      <section>
        <aside>推广日期:</aside>
        <span>
          <i :aria-checked="query.timeType === 'last-7-days'"
            @click="query.timeType = 'last-7-days'">
            近7天
          </i>
          <i :aria-checked="query.timeType === 'last-month'"
            @click="query.timeType = 'last-month'">
            近1个月
          </i>
          <i v-if="query.timeType !== 'custom'"
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
          <i v-for="d of allDevices" :key="d.value"
            :aria-checked="query.device === d.value"
            @click="query.device = d.value">
            {{ d.label }}
          </i>
        </span>
      </section>
      <section>
        <aside>时间单位:</aside>
        <span>
          <i v-for="d of allTimeUnits" :key="d.value"
            :aria-checked="query.timeUnit === d.value"
            @click="setTimeUnit(d.value)">
            {{ d.label }}
          </i>
        </span>
      </section>
      <section>
        <aside>计划/关键词筛选:</aside>
        <span>
          <plan-keyword-selector multiple
            :channel="query.channel"
            :dimension="query.dimension"
            v-model="query.keywordsAndPlans">
          </plan-keyword-selector>
        </span>
      </section>
      <data-trend :statistics="statistics"></data-trend>
      <data-detail :statistics="statistics" :csv-download-url="csvDownloadUrl">
      </data-detail>
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
import { Message } from 'element-ui'
import moment from 'moment'
import clone from 'clone'

import {
  semPlatformOpts
} from 'constant/fengming'

import {
  getCsvDownloadUrl,
  getStatistics
} from './action'

import store from './store'

const allDimensions = [{
  label: '计划维度',
  value: 0
}, {
  label: '关键词维度',
  value: 1
}]

const allDevices = [{
  label: '全部',
  value: '0,1'
}, {
  label: 'PC',
  value: 0
}, {
  label: 'WAP',
  value: 1
}]

const allTimeUnits = [{
  label: '每日',
  value: 1
}, {
  label: '每周',
  value: 2
}, {
  label: '每月',
  value: 3
}]

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
      semPlatformOpts,
      allDimensions,
      allTimeUnits,
      allDevices,

      query: {
        timeType: 'last-7-days', // 'last-7-days', 'last-month', 'custom'
        keywordsAndPlans: [],
        timeRange: [],

        dimension: 0,
        timeUnit: 1,
        channel: 5,
        device: 0
      }
    }
  },
  methods: {
    setTimeUnit(v) {
      if (v !== 1) {
        return Message.warning('暂不支持, 程序员哥哥们会尽快支持哟 ~ 么么哒 !')
      }

      this.query.timeUnit = v
    },
    async queryStatistics() {
      const q = {
        ...clone(this.query),
        dataDimension: this.query.dimension
      }

      if (q.timeType === 'custom') {
        q.timeRange = [
          toTimestamp(q.timeRange[0], 'YYYY-MM-DD'),
          toTimestamp(q.timeRange[1], 'YYYY-MM-DD')
        ]
      } else if (q.timeType === 'last-month') {
        q.timeRange = [
          moment().subtract('1', 'month').unix(),
          moment().unix()
        ]
      } else {
        // 7 days
        q.timeRange = [
          moment().subtract('7', 'days').unix(),
          moment().unix()
        ]
      }

      if (!q.keywordsAndPlans.length) {
        return
      }

      q.keywords = q.keywordsAndPlans
        .filter(i => i.startsWith('k-'))
        .map(i => i.replace('k-', ''))
        .join(',')

      q.plans = q.keywordsAndPlans
        .filter(i => i.startsWith('p-'))
        .map(i => i.replace('p-', ''))
        .join(',')

      await getCsvDownloadUrl(q)
      await getStatistics(q)
    }
  },
  watch: {
    'query': {
      deep: true,
      handler: async function() {
        await this.queryStatistics()
      }
    }
  },
  async mounted() {
    // await this.queryStatistics()
  }
}

</script>

<style scoped>

@import 'cssbase/mixin';

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

        & i {
          @mixin center;
          height: 22px;
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
