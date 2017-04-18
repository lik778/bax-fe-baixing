
<template>
  <div class="order">
    <topbar :userInfo="userInfo">
      <label slot="title">订单管理</label>
    </topbar>
    <order-filter></order-filter>
    <order-list :orders="orders"></order-list>
  </div>
</template>

<script>

import OrderFilter from './filter'
import OrderList from './list'

import Topbar from 'com/topbar'

import store from './store'

export default {
  name: 'order',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    OrderFilter,
    OrderList,
    Topbar
  },
  store
}

</script>

<style scoped>

.order {
  padding: 0 35px;
}

</style>
