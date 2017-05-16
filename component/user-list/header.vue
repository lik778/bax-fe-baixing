
<template>
  <header class="user-header">
    <div>
      <span class="filter-item">
        <label>客户 ID</label>
        <div>
          <bax-input placeholder="客户 ID" type="number"
            v-model="query.userId" />
        </div>
      </span>
      <span class="filter-item">
        <label>客户名</label>
        <div>
          <bax-input placeholder="客户名" v-model="query.name" />
        </div>
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>角色</label>
        <bax-select clearable multiple
          :options="roleOpts" placeholder='选择角色'
          :value="query.roles.split(',').filter(s => !!s)"
          @change="v => query.roles = v.join(',')" />
      </span>
      <span class="filter-item">
        <el-button @click="addUser" type="primary" icon="plus">
          新建用户
        </el-button>
      </span>
    </div>
  </header>
</template>

<script>

import BaxSelect from 'com/common/select'
import BaxInput from 'com/common/input'
import { getUsers } from './action'

export default {
  name: 'user-header',
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
  components: {
    BaxSelect,
    BaxInput
  },
  computed: {
    roleOpts() {
      return this.allRoles.map(r => ({
        value: String(r.id),
        label: r.name
      }))
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
    'query.roles': async function(v, p) {
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

.user-header {
  @mixin top-filter;

  & > div {
    display: flex;
    align-items: center;

    & > span {
      display: flex;
      flex-grow: 0.5;
    }

    & > span:last-child {
      margin-left: 60px;
    }
  }

  & > div:last-child {
    & > span:last-child {
      margin-left: 95px;
    }
  }
}

</style>
