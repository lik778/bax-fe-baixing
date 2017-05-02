
<template>
  <header class="ad-header">
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
        <el-date-picker type="date" placeholder="选择日期" />
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
  watch: {
    'query.customerId': async function(v, p) {
      await this.queryAdItems(v, p)
    },
    'query.orderId': async function(v, p) {
      await this.queryAdItems(v, p)
    },
    'query.adId': async function(v, p) {
      await this.queryAdItems(v, p)
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
    adOpts() {
      return this.ads.map(ad => ({
        label: ad.slotCode,
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
