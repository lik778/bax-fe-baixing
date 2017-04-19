
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
          <img class="m-img" v-else-if="s.row.material.imgUrl"
            v-bind:src="s.row.material.imgUrl" />
          <span v-else>{{ s.row.material.content }}</span>
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
          <el-button type="text" size="small"
            @click="showAddAdGroupDialog(s.row.orderId)">
            条件投放
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
    <add-ad-group :orderId="currentGroupOrderId"
      :visible="addAdGroupDialogVisible"
      :all-categories="allCategories" :all-areas="allAreas"
      @hide="addAdGroupDialogVisible = false"
      @success="onAddAdGroupSuccess" />
  </section>
</template>

<script>

import BaxPagination from 'com/common/pagination'
import AddMaterial from './add-material'
import AddAdGroup from './add-ad-group'

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
    AddAdGroup,
    ItemList
  },
  props: {
    allCategories: {
      type: Array,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    },
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
      addAdGroupDialogVisible: false,
      currentGroupOrderId: '',
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
    async onAddAdGroupSuccess() {
      await getAdGroups()
    },
    showAddAdGroupDialog(oid) {
      this.addAdGroupDialogVisible = true
      this.currentGroupOrderId = oid
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
  & .m-img {
    max-width: 80px;
    max-height: 60px;
    object-fit: contain;
  }
}

</style>
