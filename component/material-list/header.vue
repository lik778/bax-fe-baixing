
<template>
  <section class="material-header">
    <div>
      <span class="filter-item">
        <label>名称</label>
        <el-input placeholder="请输入名称" v-model="query.name" />
      </span>
      <span class="filter-item">
        <label>规格</label>
        <el-input placeholder="请选择规格" />
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>创建时间</label>
        <el-date-picker type="date" placeholder="选择日期" />
      </span>
      <span class="filter-item">
        <label>客户</label>
        <el-input placeholder="请选择客户" />
      </span>
    </div>
  </section>
</template>

<script>

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
  watch: {
    'query.name': async function(v, p) {
      await this.queryMaterialItems(v, p)
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
