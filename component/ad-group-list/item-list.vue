
<template>
  <el-table :data="items" style="width: 100%">
    <el-table-column prop="id" label="id" width="180" />
    <el-table-column prop="tags.city" label="城市" width="120" />
    <el-table-column prop="tags.category" label="类目" width="120" />
    <el-table-column label="审核">
      <template scope="scope">
        <el-button type="text" size="small"
          @click="rejectAdItem(scope.row.id)">
          拒绝
        </el-button>
        <el-button type="text" size="small"
          @click="passAdItem(scope.row.id)">
          通过
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

import {
  getAdGroupItems,
  verifyAdItem
} from 'api/ad'

export default {
  name: 'ad-group-item-list',
  props: {
    groupId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      items: []
    }
  },
  methods: {
    async rejectAdItem(id) {
      await verifyAdItem(id, 'failed')
      await getAdGroupItems(this.groupId)
    },
    async passAdItem(id) {
      await verifyAdItem(id, 'pass')
      await getAdGroupItems(this.groupId)
    }
  },
  async mounted() {
    const { items = [] } = await getAdGroupItems(this.groupId)
    this.items = items
  }
}

</script>

<style scoped>

</style>
