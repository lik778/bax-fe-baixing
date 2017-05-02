
<template>
  <section class="ad-list">
    <el-table :data="items" style="width: 100%">
      <el-table-column prop="name" label="名称" width="120" />
      <el-table-column prop="orderId" label="order id" width="120" />
      <el-table-column prop="adId" label="adId" width="120" />
      <el-table-column label="投放时间">
        <template scope="s">
          <span>{{ s.row.timeRange[0] | date }}</span>
          <i>-</i>
          <span>{{ s.row.timeRange[1] | date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template scope="s">
          <span>{{ s.row.status | adItemStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域"
        :formatter="formatterArea" />
      <el-table-column label="类目"
        :formatter="formatterCategory" />
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
          <el-button v-if="s.row.status === 0"
            type="text" size="small"
            @click="rejectAdItem(s.row.id)">
            拒绝
          </el-button>
          <el-button v-if="s.row.status === 0"
            type="text" size="small"
            @click="passAdItem(s.row.id)">
            通过
          </el-button>
          <el-button v-if="s.row.itemType === 0" type="text" size="small"
            @click="showAddAdItemDialog(s.row.id, s.row)">
            新增投放
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
    <add-ad-item :visible="addAdItemDialogVisible"
      :old-item-id="currentItemId"
      :old-categories="currentItem.categories"
      :old-areas="currentItem.areas"
      :all-categories="allCategories"
      :all-areas="allAreas"
      @hide="addAdItemDialogVisible = false"
      @success="onAddAdItemSuccess" />
  </section>
</template>

<script>

import BaxPagination from 'com/common/pagination'
import AddMaterial from './add-material'
import AddAdItem from './add-ad-item'

import { toHumanTime } from 'utils'
import clone from 'clone'

import {
  formatCategoriesOrAreas
} from 'util/meta'

import {
  adStatus
} from 'constant/ad'

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
      currentItemId: 0,
      currentItem: {}
    }
  },
  filters: {
    adItemStatus(s) {
      return adStatus[String(s)]
    },
    date(v) {
      return toHumanTime(v, 'MM月-DD日')
    },
    toHumanTime
  },
  methods: {
    async onAddMaterialSuccess() {
      await getAdItems({...this.query})
    },
    async onAddAdItemSuccess() {
      await getAdItems()
    },
    showAddAdItemDialog(id, item) {
      this.addAdItemDialogVisible = true

      this.currentItem = clone(item)
      this.currentItemId = id
    },
    showAddMaterialDialog(id) {
      this.addMaterialDialogVisible = true
      this.currentItemId = id
    },
    async onCurrentChange({offset}) {
      const q = {
        ...this.query,
        offset
      }

      await getAdItems(q)
    },
    async rejectAdItem(id) {
      await verifyAdItem(id, 'failed')
      await getAdItems()
    },
    async passAdItem(gid) {
      await verifyAdItem(gid, 'pass')
      await getAdItems()
    },
    formatterCategory(row) {
      const { allCategories } = this
      const { categories } = row
      return formatCategoriesOrAreas(categories, allCategories)
    },
    formatterArea(row) {
      const { allAreas } = this
      const { areas } = row
      return formatCategoriesOrAreas(areas, allAreas)
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
