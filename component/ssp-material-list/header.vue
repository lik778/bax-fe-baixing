
<template>
  <section class="material-header">
    <div>
      <span class="filter-item">
        <label>名称</label>
        <div>
          <bax-input
            placeholder="输入名称"
            :value="query.name"
            @change="v => queryMaterialItems({ name: v })"
          />
        </div>
      </span>
      <span class="filter-item">
        <label>规格</label>
        <div>
          <bax-input
            placeholder="输入规格"
            :value="query.slot"
            @change="v => queryMaterialItems({ slot: v })"
          />
        </div>
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>创建日期</label>
        <el-date-picker
          type="daterange"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          :value="timeRange"
          @input="queryByTimeRange"
        />
      </span>
      <span class="filter-item">
        <label>客户</label>
        <user-selector
          clearable
          placeholder='选择客户'
          :value="query.userId"
          @change="v => queryMaterialItems({ userId: v })"
        />
      </span>
    </div>
  </section>
</template>

<script>
import UserSelector from 'com/common/user-selector'
import BaxInput from 'com/common/input'

import {
  toHumanTime,
  toTimestamp
} from 'utils'

import store from './store'

export default {
  name: 'material-header',
  components: {
    UserSelector,
    BaxInput
  },
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  computed: {
    timeRange () {
      const {
        createdAtFrom,
        createdAtTo
      } = this.query

      if (createdAtFrom && createdAtTo) {
        return [
          toHumanTime(createdAtFrom, 'YYYY-MM-DD'),
          toHumanTime(createdAtTo, 'YYYY-MM-DD')
        ]
      }

      return []
    }
  },
  methods: {
    async queryMaterialItems (opts) {
      await store.getMaterials({
        ...this.query,
        ...opts
      })
    },
    async queryByTimeRange (v = []) {
      const [start, end] = v

      if (!start && !end) {
        await store.getMaterials({
          ...this.query,
          createdAtFrom: '',
          createdAtTo: ''
        })
        return
      }

      const s = toTimestamp(start, 'YYYY-MM-DD')
      const e = toTimestamp(end, 'YYYY-MM-DD')
      if (s && e && e > s) {
        await store.getMaterials({
          ...this.query,
          createdAtFrom: s,
          createdAtTo: e
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.material-header {
  @include top-filter;
  @include filter-item;

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
}
</style>
