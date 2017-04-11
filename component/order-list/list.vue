
<template>
  <section>
    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="id" label="id" width="60">
      </el-table-column>
    </el-table>
  </section>
</template>

<script>

import {
  getOrders
} from './action'

export default {
  name: 'order-list',
  props: {
    orders: {
      type: Array,
      required: true
    }
  },
  mounted() {
    getOrders()
  }
}

</script>

<style scoped>

section {
  margin-top: 16px;
}

</style>
