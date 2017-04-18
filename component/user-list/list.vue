
<template>
  <section>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="id" width="60">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="号码" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
    </el-table>
  </section>
</template>

<script>

import { getUsers } from './action'

export default {
  name: 'user-list',
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  async mounted() {
    await getUsers()
  }
}

</script>

<style scoped>

section {
  margin-top: 16px;
}

</style>
