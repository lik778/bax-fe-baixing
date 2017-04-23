
<template>
  <div class="order">
    <topbar :userInfo="userInfo">
      <label slot="title">订单管理</label>
    </topbar>
    <order-header :query="query" />
    <order-list :orders="orders" :query="query" />
  </div>
</template>

<script>

import OrderHeader from './header'
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
    OrderHeader,
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
