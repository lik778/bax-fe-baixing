
<template>
  <section class="ad-list">
    <el-table :data="items" style="width: 100%">
      <el-table-column prop="name" label="名称" width="120" />
      <el-table-column prop="orderId" label="order id" width="120" />
      <el-table-column prop="adId" label="adId" width="120" />
      <el-table-column label="投放时间">
        <template scope="s">
          <span>{{ s.row.onlineAt | toHumanTime }}</span>
          <i>-</i>
          <span>{{ s.row.offlineAt | toHumanTime }}</span>
        </template>
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
            @click="rejectAdItem(s.row.id)">
            拒绝
          </el-button>
          <el-button type="text" size="small"
            @click="passAdItem(s.row.id)">
            通过
          </el-button>
          <el-button type="text" size="small"
            @click="showAddAdItemDialog(s.row.orderId)">
            条件投放
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination :options="query"
      @current-change="onCurrentChange" />
    <add-material :materials="materials" :itemId="currentItemId"
      :visible="addMaterialDialogVisible"
      @hide="addMaterialDialogVisible = false"
      @success="onAddMaterialSuccess" />
    <add-ad-item :orderId="currentItemOrderId"
      :visible="addAdItemDialogVisible"
      :all-categories="allCategories" :all-areas="allAreas"
      @hide="addAdItemDialogVisible = false"
      @success="onAddAdItemSuccess" />
  </section>
</template>

<script>

import BaxPagination from 'com/common/pagination'
import AddMaterial from './add-material'
import AddAdItem from './add-ad-item'

import { toHumanTime } from 'utils'

import {
  verifyAdItem,
  getAdItems
} from './action'

export default {
  name: 'ad-list',
  components: {
    BaxPagination,
    AddMaterial,
    AddAdItem
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
    materials: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      addMaterialDialogVisible: false,
      addAdItemDialogVisible: false,
      currentItemOrderId: '',
      currentItemId: 0
    }
  },
  filters: {
    toHumanTime
  },
  methods: {
    async onAddMaterialSuccess() {
      await getAdItems()
    },
    async onAddAdItemSuccess() {
      await getAdItems()
    },
    showAddAdItemDialog(oid) {
      this.addAdItemDialogVisible = true
      this.currentItemOrderId = oid
    },
    showAddMaterialDialog(gid) {
      this.addMaterialDialogVisible = true
      this.currentItemId = gid
    },
    async onCurrentChange({offset}) {
      await getAdItems({offset})
    },
    async rejectAdItem(gid) {
      await verifyAdItem(gid, 'failed')
      await getAdItems()
    },
    async passAdItem(gid) {
      await verifyAdItem(gid, 'pass')
      await getAdItems()
    }
  }
}

</script>

<style scoped>

.ad-list {
  & .m-img {
    max-width: 80px;
    max-height: 60px;
    object-fit: contain;
  }
}

</style>
