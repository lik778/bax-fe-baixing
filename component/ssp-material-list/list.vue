
<template>
  <section class="material-list">
    <el-table :data="materials" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column label="缩略图">
        <template slot-scope="s">
          <img class="material" v-bind:src="s.row.imgUrl" >
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120">
        <template slot-scope="s">
          <span>{{ s.row.materialType | materialType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="slot" label="规格" width="180" />
      <el-table-column label="链接" width="120">
        <template slot-scope="s">
          <a target="_blank"
            v-if="s.row.link"
            v-bind:href="s.row.link">
            点击查看
          </a>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="客户" />
      <el-table-column label="操作" width="120">
        <template slot-scope="s">
          <el-button @click="gotoMaterialInfo(s.row.id)" size="mini">
            预览
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination
      :options="query"
      @current-change="onCurrentChange"
    />
  </section>
</template>

<script>
import BaxPagination from 'com/common/pagination'

import { materialType } from 'constant/material'

import store from './store'

export default {
  name: 'material-list',
  components: {
    BaxPagination
  },
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
      await store.getMaterials(q)
    },
    gotoMaterialInfo(id) {
      this.$router.push({
        name: 'material-info',
        params: { id }
      })
    }
  }
}
</script>

<style lang="postcss" scoped>
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
