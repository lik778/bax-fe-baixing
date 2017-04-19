
<template>
  <section class="group-list">
    <el-table :data="groups" style="width: 100%">
      <el-table-column type="expand">
        <template scope="scope">
          <item-list :group-id="scope.row.id"></item-list>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="180">
      </el-table-column>
      <el-table-column prop="adId" label="adId" width="180">
      </el-table-column>
      <el-table-column label="投放时间">
        <template scope="s">
          <span>{{ s.row.onlineAt | toHumanTime }}</span>
          <i>-</i>
          <span>{{ s.row.offlineAt | toHumanTime }}</span>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="物料">
        <template scope="s">
          <el-button type="text" size="small"
            v-if="!s.row.materialId"
            @click="showAddMaterialDialog(s.row.id)">
            上传物料
          </el-button>
          <span v-else>{{ s.row.materialId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核">
        <template scope="s">
          <el-button type="text" size="small"
            @click="rejectAdGroup(s.row.id)">
            拒绝
          </el-button>
          <el-button type="text" size="small"
            @click="passAdGroup(s.row.id)">
            通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination :offset="offset" :total="total" :limit="limit"
      @current-change="onCurrentChange" />
    <add-material :materials="materials" :groupId="currentGroupId"
      :visible="addMaterialDialogVisible"
      @hide="addMaterialDialogVisible = false"
      @success="onAddMaterialSuccess" />
  </section>
</template>

<script>

import BaxPagination from 'com/common/pagination'
import AddMaterial from './add-material'

import { toHumanTime } from 'utils'

import ItemList from './item-list'

import {
  verifyAdGroup,
  verifyAdItem,
  getAdGroups
} from './action'

export default {
  name: 'ad-group-list',
  components: {
    BaxPagination,
    AddMaterial,
    ItemList
  },
  props: {
    groups: {
      type: Array,
      required: true
    },
    offset: Number,
    total: Number,
    limit: Number,
    materials: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      addMaterialDialogVisible: false,
      currentGroupId: 0
    }
  },
  filters: {
    toHumanTime
  },
  methods: {
    async onAddMaterialSuccess() {
      await getAdGroups()
    },
    showAddMaterialDialog(gid) {
      this.addMaterialDialogVisible = true
      this.currentGroupId = gid
    },
    async onCurrentChange({offset}) {
      await getAdGroups({offset})
    },
    async rejectAdGroup(gid) {
      await verifyAdGroup(gid, 'failed')
      await getAdGroups()
    },
    async passAdGroup(gid) {
      await verifyAdGroup(gid, 'pass')
      await getAdGroups()
    }
  }
}

</script>

<style scoped>

.group-list {

}

</style>
