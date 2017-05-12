
<template>
  <header class="user-header">
    <div>
      <aside>
        <span class="filter-item">
          <label>客户 ID</label>
          <el-input placeholder="客户 ID" v-model="query.userId" />
        </span>
        <span class="filter-item">
          <label>客户名</label>
          <el-input placeholder="客户名" v-model="query.name" />
        </span>
      </aside>
      <aside>
        <el-button @click="addUser" type="primary" icon="plus">
          新建用户
        </el-button>
      </aside>
    </div>
  </header>
</template>

<script>

import { getUsers } from './action'

export default {
  name: 'user-header',
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  methods: {
    addUser() {
      this.$emit('create-user')
    },
    async queryUsers(v, p) {
      if (v === p) {
        return
      }

      await getUsers({...this.query})
    }
  },
  watch: {
    'query.userId': async function(v, p) {
      await this.queryUsers(v, p)
    },
    'query.name': async function(v, p) {
      await this.queryUsers(v, p)
    }
  }
}

</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

@mixin filter-item;

.filter-item {
  margin-top: unset;
}

.user-header {
  @mixin top-filter;
  padding: 20px 0;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 30px;

    & > aside {
      display: flex;
      align-items: center;
    }
  }
}

</style>
