
<template>
  <section class="order-header">
    <div v-if="allowAddOrder">
      <span />
      <span>
        <el-button type="primary">
          <router-link tag="p" :to="{ name: 'create-order' }">
            新建订单
          </router-link>
        </el-button>
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>订单状态</label>
        <bax-select :options="orderStatusOpts" clearable
          v-model="query.status" />
      </span>
      <span class="filter-item">
        <label>客户</label>
        <user-selector v-model="query.userId" clearable />
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>创建时间</label>
        <el-date-picker type="daterange" placeholder="选择日期"
          format="yyyy-MM-dd"
          v-model="createTimeRange" />
      </span>
      <span class="filter-item">
        <label>投放时间</label>
        <el-date-picker type="daterange" placeholder="选择日期"
          format="yyyy-MM-dd"
          v-model="onlineTimeRange" />
      </span>
    </div>
  </section>
</template>

<script>

import { orderStatusOpts } from 'constant/order'

import UserSelector from 'com/common/user-selector'
import BaxSelect from 'com/common/select'

import clone from 'clone'

import {
  toHumanTime,
  toTimestamp
} from 'utils'

import {
  allowAddOrder
} from 'constant/role'

import {
  getOrders
} from './action'

export default {
  name: 'order-header',
  components: {
    UserSelector,
    BaxSelect
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      orderStatusOpts: [
        ...orderStatusOpts
      ],
      createTimeRange: [],
      onlineTimeRange: []
    }
  },
  watch: {
    'query.status': async function(v, p) {
      await this.queryOrders(v, p)
    },
    'query.userId': async function(v, p) {
      await this.queryOrders(v, p)
    },
    'createTimeRange': async function(v) {
      const [start, end] = v

      if (!start && !end) {
        await getOrders({
          ...clone(this.query),
          createdAtFrom: '',
          createdAtTo: ''
        })
        return
      }

      const s = toTimestamp(start, 'YYYY-MM-DD')
      const e = toTimestamp(end, 'YYYY-MM-DD')
      if (s && e && e > s) {
        await getOrders({
          ...clone(this.query),
          createdAtFrom: s,
          createdAtTo: e,
        })
      }
    },
    'onlineTimeRange': async function(v) {
      const [start, end] = v

      if (!start && !end) {
        await getOrders({
          ...clone(this.query),
          timeRange: ''
        })
        return
      }

      const s = toTimestamp(start, 'YYYY-MM-DD')
      const e = toTimestamp(end, 'YYYY-MM-DD')
      if (s && e && e > s) {
        await getOrders({
          ...clone(this.query),
          timeRange: s + ',' + e
        })
      }
    }
  },
  computed: {
    allowAddOrder() {
      return allowAddOrder(this.userInfo.roles)
    }
  },
  methods: {
    async queryOrders(v, p) {
      if (v === p) {
        return
      }

      await getOrders({...this.query})
    }
  }
}

</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

@mixin filter-item;

.order-header {
  @mixin top-filter;
  padding: 10px 0 20px;

  width: 800px;
  padding-top: 10px;

  & > div {
    display: flex;
    align-items: center;

    & > span:last-child {
      margin-left: 70px;
    }
  }
}

</style>
