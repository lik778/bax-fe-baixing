
<template>
  <section class="material-header">
    <div>
      <span class="filter-item">
        <label>名称</label>
        <div>
          <el-input placeholder="输入名称" v-model="query.name" />
        </div>
      </span>
      <span class="filter-item">
        <label>规格</label>
        <div>
          <el-input placeholder="输入规格" v-model="query.slot" />
        </div>
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>创建日期</label>
        <el-date-picker type="daterange" placeholder="选择日期"
          format="yyyy-MM-dd"
          v-model="timeRange" />
      </span>
      <span class="filter-item">
        <label>客户</label>
        <user-selector v-model="query.userId" clearable
          placeholder='选择客户' />
      </span>
    </div>
  </section>
</template>

<script>

import UserSelector from 'com/common/user-selector'

import clone from 'clone'

import {
  toHumanTime,
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
    const {
      createdAtFrom,
      createdAtTo
    } = this.query

    if (createdAtFrom && createdAtTo) {
      return {
        timeRange:[
          toHumanTime(createdAtFrom, 'YYYY-MM-DD'),
          toHumanTime(createdAtTo, 'YYYY-MM-DD')
        ]
      }
    }

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
    'timeRange': async function(v = []) {
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

  & > div {
    display: flex;
    align-items: center;

    & > span {
      display: flex;
      flex-grow: 0.5;

      & > div:last-child {
      }
    }

    & > span:last-child {
      margin-left: 60px;
    }
  }
}

</style>
