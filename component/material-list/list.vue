
<template>
  <section class="material-list">
    <el-table :data="materials" style="width: 100%">
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column label="缩略图" width="180">
        <template scope="s">
          <img class="material" v-bind:src="s.row.imgUrl" >
        </template>
      </el-table-column>
      <el-table-column label="类型" width="180">
        <template scope="s">
          <span>{{ s.row.materialType | materialType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="slot" label="规格" />
      <el-table-column prop="userId" label="客户" />
      <el-table-column label="操作">
        <template scope="s">
          <el-button size="mini">修改</el-button>
          <el-button size="mini">预览</el-button>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination :options="query"
      @current-change="onCurrentChange" />
  </section>
</template>

<script>

import BaxPagination from 'com/common/pagination'

import { materialType } from 'constant/material'

import {
  getMaterials
} from './action'

export default {
  name: 'material-list',
  props: {
    materials: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  components: {
    BaxPagination
  },
  filters: {
    materialType(t) {
      return materialType[String(t)]
    }
  },
  methods: {
    async onCurrentChange({offset}) {
      const q = {
        ...this.query,
        offset
      }
      await getMaterials(q)
    }
  }
}

</script>

<style scoped>

.material-list {
  margin-top: 16px;

  & img.material {
    margin: 5px 0 0;
    max-width: 120px;
    max-height: 80px;
    object-fit: contain;
  }
}

</style>
