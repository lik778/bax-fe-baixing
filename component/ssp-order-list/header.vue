
<template>
  <header class="order-header">
    <section>
      <span>
        <bax-input
          icon="el-icon-search"
          placeholder="请输入订单号"
          type="number"
          :value="query.orderId"
          @change="v => queryOrders({ orderId: v })"
        />
        <el-button @click="switchShowMoreFilters">
          更多筛选<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
      </span>
      <span v-if="allowAddOrder">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="gotoCreateOrder"
        >
          新建订单
        </el-button>
      </span>
      <span v-if="!allowAddOrder && isOnlyAgentSales">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="gotoCreateOrder"
        >
          广告查价
        </el-button>
      </span>
    </section>
    <section v-if="showMoreFilters">
      <div>
        <span class="filter-item">
          <label>订单状态</label>
          <bax-select
            clearable
            :options="orderStatusOpts"
            :value="query.status"
            @change="v => queryOrders({ status: v })"
          />
        </span>
        <span class="filter-item">
          <label>客户</label>
          <user-selector
            clearable
            :value="query.userId"
            @change="v => queryOrders({ userId: v })"
          />
        </span>
      </div>
      <div>
        <span class="filter-item">
          <label>创建时间</label>
          <el-date-picker
            type="daterange"
            format="yyyy-MM-dd"
            placeholder="选择日期"
            :value="createTimeRange"
            @input="v => queryOrdersByTimeRange(v, 'create')"
          />
        </span>
        <span class="filter-item">
          <label>投放时间</label>
          <el-date-picker
            type="daterange"
            format="yyyy-MM-dd"
            placeholder="选择日期"
            :value="onlineTimeRange"
            @input="v => queryOrdersByTimeRange(v, 'online')"
          />
        </span>
      </div>
    </section>
  </header>
</template>

<script>
import { orderStatusOpts } from 'constant/order'

import UserSelector from 'com/common/user-selector'
import BaxSelect from 'com/common/select'
import BaxInput from 'com/common/input'

import store from './store'

import {
  toHumanTime,
  toTimestamp
} from 'utils'

import {
  normalizeRoles,
  onlyAgentSales,
  allowAddOrder
} from 'util/role'

export default {
  name: 'order-header',
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
      ]
    }
  },
  computed: {
    onlineTimeRange() {
      const {
        timeRange = ''
      } = this.query

      const [s, e] = timeRange.split(',')
      if (s && e) {
        return [
          toHumanTime(s, 'YYYY-MM-DD'),
          toHumanTime(e, 'YYYY-MM-DD')
        ]
      }

      return []
    },
    createTimeRange() {
      const {
        createdAtFrom,
        createdAtTo
      } = this.query

      if (createdAtFrom && createdAtTo) {
        return [
          toHumanTime(createdAtFrom, 'YYYY-MM-DD'),
          toHumanTime(createdAtTo, 'YYYY-MM-DD')
        ]
      }

      return []
    },
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
      store.switchShowMoreFilters()
    },
    async queryOrders(opts) {
      await store.getOrders({
        ...this.query,
        ...opts
      })
    },
    async queryOrdersByTimeRange(range, type) {
      const [start, end] = range || []

      if (!start && !end) {
        const q = type === 'create' ? {
          createdAtFrom: '',
          createdAtTo: ''
        } : {
          timeRange: ''
        }
        await this.queryOrders(q)
        return
      }

      const s = toTimestamp(start, 'YYYY-MM-DD')
      const e = toTimestamp(end, 'YYYY-MM-DD')
      if (s && e && e > s) {
        const q = type === 'create' ? {
          createdAtFrom: s,
          createdAtTo: e
        } : {
          timeRange: s + ',' + e
        }

        await this.queryOrders(q)
      }
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
      }

      & > span:last-child {
        margin-left: 60px;
      }
    }
  }
}
</style>
