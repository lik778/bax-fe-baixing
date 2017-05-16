
<template>
  <header class="order-header">
    <section>
      <span>
        <el-input placeholder="请输入订单号" icon="search"
          v-model="query.orderId" />
        <el-button icon="arrow-down"
          @click="switchShowMoreFilters">
          更多筛选
        </el-button>
      </span>
      <span v-if="allowAddOrder">
        <el-button type="primary" icon="plus"
          @click="gotoCreateOrder">
          新建订单
        </el-button>
      </span>
      <span v-if="!allowAddOrder && isOnlyAgentSales">
        <el-button type="primary" icon="plus"
          @click="gotoCreateOrder">
          广告查价
        </el-button>
      </span>
    </section>
    <section v-if="showMoreFilters">
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
  </header>
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
  normalizeRoles,
  onlyAgentSales,
  allowAddOrder
} from 'util/role'

import {
  switchShowMoreFilters,
  getOrders
} from './action'

export default {
  name: 'order-header',
  components: {
    UserSelector,
    BaxSelect
  },
  props: {
    showMoreFilters: {
      type: Boolean,
      required: true
    },
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
    const allData = {
      orderStatusOpts: [
        ...orderStatusOpts
      ],
      createTimeRange: [],
      onlineTimeRange: []
    }

    const {
      createdAtFrom,
      createdAtTo,
      timeRange = ''
    } = this.query

    if (createdAtFrom && createdAtTo) {
      allData.createTimeRange = [
        toHumanTime(createdAtFrom, 'YYYY-MM-DD'),
        toHumanTime(createdAtTo, 'YYYY-MM-DD')
      ]
    }

    const [s, e] = timeRange.split(',')
    if (s && e) {
      allData.onlineTimeRange = [
        toHumanTime(s, 'YYYY-MM-DD'),
        toHumanTime(e, 'YYYY-MM-DD')
      ]
    }

    return allData
  },
  watch: {
    'query.orderId': async function(v, p) {
      await this.queryOrders(v, p)
    },
    'query.status': async function(v, p) {
      await this.queryOrders(v, p)
    },
    'query.userId': async function(v, p) {
      await this.queryOrders(v, p)
    },
    'createTimeRange': async function(v = []) {
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
          createdAtTo: e
        })
      }
    },
    'onlineTimeRange': async function(v = []) {
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
    },
    isOnlyAgentSales() {
      const roles = normalizeRoles(this.userInfo.roles)
      return onlyAgentSales(roles)
    }
  },
  methods: {
    gotoCreateOrder() {
      this.$router.push({
        name: 'create-order'
      })
    },
    switchShowMoreFilters() {
      switchShowMoreFilters()
    },
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
  & > section:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    width: 100%;

    & > span:first-child {
      display: flex;
      align-items: center;

      & > .el-input {
        margin-right: 10px;
      }
    }
  }

  & > section:nth-child(2) {
    @mixin top-filter;

    & > div {
      display: flex;
      align-items: center;

      & > span {
        display: flex;
        flex-grow: 0.5;

        & > div:last-child {
        }
      }

      & > span:last-child {
        margin-left: 60px;
      }
    }
  }
}

</style>
