
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
    <bax-pagination :offset="offset" :total="total" :limit="limit"
      @current-change="onCurrentChange" />
  </section>
</template>

<script>

import BaxPagination from 'com/common/pagination'
import { getUsers } from './action'

export default {
  name: 'user-list',
  components: {
    BaxPagination
  },
  props: {
    users: {
      type: Array,
      required: true
    },
    offset: Number,
    total: Number,
    limit: Number
  },
  methods: {
    async onCurrentChange({offset}) {
      await getUsers({offset})
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
