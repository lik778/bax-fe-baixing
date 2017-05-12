
<template>
  <header class="ad-header">
    <span class="filter-item">
      <label>投放状态</label>
      <bax-select placeholder='请选择状态'
        :options="adStatusOpts" clearable
        v-model="query.status" />
    </span>
    <div>
      <span class="filter-item">
        <label>订单</label>
        <el-input placeholder="请填写订单号查询"
          v-model="query.orderId" />
      </span>
      <span class="filter-item">
        <label>广告位</label>
        <bax-select placeholder='请选择广告位'
          :options="adOpts" clearable
          v-model="query.adId" />
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>上线时间</label>
        <el-date-picker type="daterange" placeholder="选择日期"
          format="yyyy-MM-dd"
          v-model="timeRange" />
      </span>
      <span class="filter-item">
        <label>客户</label>
        <user-selector placeholder='选客户' clearable
          v-model="query.customerId" />
      </span>
    </div>
  </header>
</template>

<script>

import UserSelector from 'com/common/user-selector'
import BaxSelect from 'com/common/select'

import {
  adStatus
} from 'constant/ad'

import {
  toHumanTime,
  toTimestamp
} from 'utils'

import { getAdItems } from './action'

export default {
  name: 'ad-header',
  props: {
    query: {
      type: Object,
      required: true
    },
    ads: {
      type: Array,
      required: true
    }
  },
  components: {
    UserSelector,
    BaxSelect
  },
  data() {
    const range = this.query.timeRange || ''
    const [s, e] = range.split(',')

    if (s && e) {
      return {
        timeRange:[
          toHumanTime(s, 'YYYY-MM-DD'),
          toHumanTime(e, 'YYYY-MM-DD')
        ]
      }
    }

    return {
      timeRange: []
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
        await getAdItems({
          ...this.query,
          timeRange: ''
        })
        return
      }

      const s = toTimestamp(start, 'YYYY-MM-DD')
      const e = toTimestamp(end, 'YYYY-MM-DD')
      if (s && e && e > s) {
        const timeRange = s + ',' + e

        await getAdItems({
          ...this.query,
          timeRange
        })
      }
    }
  },
  methods: {
    async queryAdItems(v, p) {
      if (v === p) {
        return
      }

      await getAdItems({...this.query})
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
  }
}

</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

@mixin filter-item;

.ad-header {
  @mixin top-filter;
  height: 120px;
  margin-bottom: 20px;

  & > div {
    display: flex;
    align-items: center;
  }
}

</style>
