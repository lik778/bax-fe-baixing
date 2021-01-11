
<template>
  <header class="user-header">
    <div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addUser">
        新建用户
      </el-button>
    </div>
    <div>
      <span class="filter-item">
        <label>客户 ID</label>
        <div>
          <bax-input
            type="number"
            placeholder="客户 ID"
            :value="query.userId"
            @change="v => queryUsers({ userId: v })"
          />
        </div>
      </span>
      <span class="filter-item">
        <label>客户名</label>
        <div>
          <bax-input
            placeholder="客户名"
            :value="query.name"
            @change="v => queryUsers({ name: v })"
          />
        </div>
      </span>
      <span class="filter-item">
        <label>角色</label>
        <bax-select
          multiple
          clearable
          placeholder='选择角色'
          :options="roleOpts"
          :value="query.roles.split(',').filter(s => !!s)"
          @change="v => queryUsers({ roles: v.join(',') })"
        />
      </span>
    </div>
  </header>
</template>

<script>
import BaxSelect from 'com/common/select'
import BaxInput from 'com/common/input'

import store from './store'

export default {
  name: 'user-header',
  components: {
    BaxSelect,
    BaxInput
  },
  props: {
    allRoles: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  computed: {
    roleOpts () {
      return this.allRoles.map(r => ({
        value: String(r.id),
        label: r.name
      }))
    }
  },
  methods: {
    addUser () {
      this.$emit('create-user')
    },
    async queryUsers (opts) {
      await store.getUsers({
        ...this.query,
        ...opts
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-header {
  @include filter-item;

  & > div {
    display: flex;
    align-items: center;
  }

  & > div:first-child {
    margin-bottom: 15px;
  }

  & > div:last-child {
    justify-content: space-around;
    @include top-filter;
    padding: 0 30px 15px 0;

    & > span {
      width: 290px;
    }
  }
}
</style>
