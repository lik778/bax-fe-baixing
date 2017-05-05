
<template>
  <section class="material-header">
    <div>
      <span class="filter-item">
        <label>名称</label>
        <el-input placeholder="请输入名称" v-model="query.name" />
      </span>
      <span class="filter-item">
        <label>规格</label>
        <el-input placeholder="请输入规格" v-model="query.slot" />
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>创建时间</label>
        <el-date-picker type="daterange" placeholder="选择日期"
          format="yyyy-MM-dd"
          v-model="timeRange" />
      </span>
      <span class="filter-item">
        <label>客户</label>
        <user-selector v-model="query.userId" clearable />
      </span>
    </div>
  </section>
</template>

<script>

import UserSelector from 'com/common/user-selector'

import clone from 'clone'

import {
  toTimestamp
} from 'utils'

import {
  getMaterials
} from './action'

export default {
  name: 'material-header',
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      timeRange: []
    }
  },
  components: {
    UserSelector
  },
  watch: {
    'query.userId': async function(v, p) {
      await this.queryMaterialItems(v, p)
    },
    'query.name': async function(v, p) {
      await this.queryMaterialItems(v, p)
    },
    'query.slot': async function(v, p) {
      await this.queryMaterialItems(v, p)
    },
    'timeRange': async function(v) {
      const [start, end] = v

      if (!start && !end) {
        await getMaterials({
          ...clone(this.query),
          createdAtFrom: '',
          createdAtTo: ''
        })
        return
      }

      const s = toTimestamp(start, 'YYYY-MM-DD')
      const e = toTimestamp(end, 'YYYY-MM-DD')
      if (s && e && e > s) {
        await getMaterials({
          ...clone(this.query),
          createdAtFrom: s,
          createdAtTo: e,
        })
      }
    }
  },
  methods: {
    async queryMaterialItems(v, p) {
      if (v === p) {
        return
      }
      const q = this.query
      await getMaterials({...q})
    }
  }
}


</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

@mixin filter-item;

.material-header {
  @mixin top-filter;
  height: 110px;
  width: 800px;

  & > div {
    display: flex;
    align-items: center;

    & > span:last-child {
      margin-left: 70px;
    }
  }
}

</style>
