
<template>
  <div class="order">
    <topbar :userInfo="userInfo">
      <label slot="title">订单管理</label>
    </topbar>
    <order-header
      :query="query"
      :userInfo="userInfo"
      :showMoreFilters="showMoreFilters"
    />
    <order-list
      :user-info="userInfo"
      :orders="orders"
      :query="query"
    />
  </div>
</template>

<script>
import OrderHeader from './header'
import OrderList from './list'

import Topbar from 'com/topbar'

import store from './store'

export default {
  name: 'order',
  components: {
    OrderHeader,
    OrderList,
    Topbar
  },
  fromMobx: {
    showMoreFilters: () => store.showMoreFilters,
    orders: () => store.orders,
    query: () => store.query
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="postcss" scoped>
.order {
  padding: 0 35px;
  width: 100%;
}
</style>
