
<template>
  <section>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" width="220" />
      <el-table-column prop="mobile" label="号码" width="180" />
      <el-table-column label="角色" width="180">
        <template slot-scope="s">
          <i v-for="(role, i) in s.row.roles" :key="i">
            {{ role.name }}
          </i>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" />
    </el-table>
    <bax-pagination :options="query"
      @current-change="onCurrentChange" />
  </section>
</template>

<script>
import BaxPagination from 'com/common/pagination'

import store from './store'

export default {
  name: 'user-list',
  components: {
    BaxPagination
  },
  props: {
    allRoles: {
      type: Array,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onCurrentChange ({ offset }) {
      const q = {
        ...this.query,
        offset
      }

      await store.getUsers(q)
    }
  },
  async mounted () {
    await store.getUsers({ ...this.query })
  }
}
</script>

<style lang="scss" scoped>
section {
  margin-top: 16px;
}
</style>
