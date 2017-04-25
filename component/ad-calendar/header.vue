
<template>
  <header class="ad-calendar-header">
    <div>
      <span class="filter-item">
        <label>广告位</label>
        <bax-select :options="adOpts" clearable
          @change="v => adId = v" />
      </span>
      <span class="filter-item">
        <label>类型</label>
        <bax-select :options="sspOrderTypeOpts" clearable
          @change="v => sspOrderType = v" />
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>区域</label>
        <bax-select :options="allAreas"
          @change="v => categories = v"
          clearable multiple />
      </span>
      <span class="filter-item">
        <label>类目</label>
        <bax-select :options="allCategories"
          @change="v => areas = v"
          clearable multiple />
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>开始时间</label>
        <el-date-picker type="date" placeholder="选择日期"
          v-model="startAt" />
      </span>
      <span class="filter-item">
        <label>结束时间</label>
        <el-date-picker type="date" placeholder="选择日期"
          v-model="endAt" />
      </span>
    </div>
  </header>
</template>

<script>

import BaxSelect from 'com/common/select'

import { toTimestamp } from 'utils'

import {
  sspOrderTypeOpts
} from 'constant/order'

import {
  getCalendar
} from './action'

export default {
  name: 'ad-calendar-header',
  components: {
    BaxSelect
  },
  props: {
    allCategories: {
      type: Array,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    },
    allAds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      sspOrderTypeOpts: [...sspOrderTypeOpts],

      sspOrderType: '',
      categories: [],
      areas: [],
      startAt: '',
      endAt: '',
      adId: ''
    }
  },
  computed: {
    adOpts() {
      return this.allAds.map(ad => ({
        label: ad.id + ' ' + ad.slotCode,
        value: ad.id
      }))
    }
  },
  methods: {
    async queryCalendar(v, p) {
      const {
        sspOrderType,
        categories,
        areas,
        startAt,
        endAt,
        adId
      } = this

      if (!adId || !startAt || !endAt || !sspOrderType) {
        return
      }

      if (!areas.length || !categories.length) {
        return
      }

      await getCalendar({
        startAt: toTimestamp(startAt),
        endAt: toTimestamp(endAt),
        sspOrderType,
        categories,
        areas,
        adId
      })
    }
  },
  watch: {
    sspOrderType: async function(v, p) {
      await this.queryCalendar(v, p)
    },
    categories: async function(v, p) {
      await this.queryCalendar(v, p)
    },
    areas: async function(v, p) {
      await this.queryCalendar(v, p)
    },
    startAt: async function(v, p) {
      await this.queryCalendar(v, p)
    },
    endAt: async function(v, p) {
      await this.queryCalendar(v, p)
    },
    adId: async function(v, p) {
      await this.queryCalendar(v, p)
    }
  }
}

</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

@mixin filter-item;

.ad-calendar-header {
  @mixin top-filter;
  height: 160px;

  & > div {
    display: flex;
    align-items: center;
  }
}

</style>
