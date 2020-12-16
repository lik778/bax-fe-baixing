
<template>
  <header class="ad-header">
    <section>
      <span>
        <bax-input placeholder="请输入订单号" icon="el-icon-search"
          type="number" v-model="query.orderId">
        </bax-input>
        <el-button @click="switchShowMoreFilters">
          更多筛选<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </span>
    </section>
    <section v-if="showMoreFilters">
      <div>
        <span class="filter-item">
          <label>上线时间</label>
          <el-date-picker type="daterange" placeholder="选择日期"
            format="yyyy-MM-dd"
            v-model="timeRange">
          </el-date-picker>
        </span>
        <span class="filter-item">
          <label>广告位</label>
          <bax-select placeholder='选择广告位'
            :options="adOpts" clearable
            v-model="query.adId">
          </bax-select>
        </span>
      </div>
      <div>
        <span class="filter-item">
          <label>投放状态</label>
          <bax-select placeholder='选择投放状态'
            :options="adStatusOpts" clearable
            v-model="query.status">
          </bax-select>
        </span>
        <span class="filter-item">
          <label>客户</label>
          <user-selector placeholder='选择客户' clearable
            v-model="query.customerId">
          </user-selector>
        </span>
      </div>
    </section>
  </header>
</template>

<script>
import UserSelector from 'com/common/user-selector'
import BaxSelect from 'com/common/select'
import BaxInput from 'com/common/input'

import {
  adStatus
} from 'constant/ad'

import {
  toHumanTime,
  toTimestamp
} from 'utils'

import store from './store'

export default {
  name: 'ad-header',
  components: {
    UserSelector,
    BaxSelect,
    BaxInput
  },
  props: {
    showMoreFilters: {
      type: Boolean,
      required: true
    },
    query: {
      type: Object,
      required: true
    },
    ads: {
      type: Array,
      required: true
    }
  },
  data() {
    const range = this.query.timeRange || ''
    const [s, e] = range.split(',')

    if (s && e) {
      return {
        timeRange: [
          toHumanTime(s, 'YYYY-MM-DD'),
          toHumanTime(e, 'YYYY-MM-DD')
        ]
      }
    }

    return {
      timeRange: []
    }
  },
  computed: {
    adStatusOpts() {
      return Object.keys(adStatus).map((key) => ({
        label: adStatus[key],
        value: key
      }))
    },
    adOpts() {
      return this.ads.map(ad => ({
        label: ad.name || ad.slotCode,
        value: ad.id
      }))
    }
  },
  methods: {
    switchShowMoreFilters() {
      store.switchShowMoreFilters()
    },
    async queryAdItems(v, p) {
      if (v === p) {
        return
      }

      await store.getAdItems({...this.query})
    }
  },
  watch: {
    'query.customerId': async function(v, p) {
      await this.queryAdItems(v, p)
    },
    'query.orderId': async function(v, p) {
      await this.queryAdItems(v, p)
    },
    'query.status': async function(v, p) {
      await this.queryAdItems(v, p)
    },
    'query.adId': async function(v, p) {
      await this.queryAdItems(v, p)
    },
    'timeRange': async function(v = []) {
      const [start, end] = v

      if (!start && !end) {
        await store.getAdItems({
          ...this.query,
          timeRange: ''
        })
        return
      }

      const s = toTimestamp(start, 'YYYY-MM-DD')
      const e = toTimestamp(end, 'YYYY-MM-DD')
      if (s && e && e > s) {
        const timeRange = s + ',' + e

        await store.getAdItems({
          ...this.query,
          timeRange
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ad-header {
  & > section:first-child {
    display: flex;
    align-items: center;
    margin: 20px 0;

    & > span:first-child {
      display: flex;
      align-items: center;

      & > .el-input {
        margin-right: 10px;
      }
    }
  }

  & > section:nth-child(2) {
    @include top-filter;

    & > div {
      display: flex;
      align-items: center;

      & > span {
        display: flex;
        flex-grow: 0.5;
      }

      & > span:last-child {
        margin-left: 60px;
      }
    }
  }
}
</style>
