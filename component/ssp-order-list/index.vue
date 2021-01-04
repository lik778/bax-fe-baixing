
<template>
  <div class="container">
    <div class="order">
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

<style lang="scss" scoped>
.order {
  width: 100%;
  padding: 25px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);
}
</style>
