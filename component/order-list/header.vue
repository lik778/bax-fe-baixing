
<template>
  <section class="order-header">
    <div>
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
          @change="v => query.orderStatus = v" />
      </span>
      <span class="filter-item">
        <label>客户</label>
        <el-input placeholder="请选择客户" />
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>创建时间</label>
        <el-date-picker type="date" placeholder="选择日期" />
      </span>
      <span class="filter-item">
        <label>投放时间</label>
        <el-date-picker type="date" placeholder="选择日期" />
      </span>
    </div>
  </section>
</template>

<script>

import { orderStatusOpts } from 'constant/order'

import BaxSelect from 'com/common/select'

import {
  getOrders
} from './action'

export default {
  name: 'order-header',
  components: {
    BaxSelect
  },
  props: {
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
  watch: {
    'query.orderStatus': async function(v, p) {
      await this.queryOrders(v, p)
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

  height: 160px;
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
