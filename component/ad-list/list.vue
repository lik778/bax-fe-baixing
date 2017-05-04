
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
          <el-button v-if="allowAddMaterial && !s.row.materialId"
            type="text" size="small"
            @click="showAddMaterialDialog(s.row.id)">
            上传物料
          </el-button>

          <img class="m-img"
            v-if="s.row.material && s.row.material.imgUrl"
            v-bind:src="s.row.material.imgUrl"
            v-bind:alt="s.row.material.content" />
        </template>
      </el-table-column>
      <el-table-column label="审核" v-if="allowVerify">
        <template scope="s">
          <el-button v-if="s.row.status === 0"
            type="text" size="small"
            @click="showRejectReasonDialog(s.row.id)">
            拒绝
          </el-button>
          <el-button v-if="s.row.status === 0"
            type="text" size="small"
            @click="passAdItem(s.row.id)">
            通过
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="allowAddAdItem">
        <template scope="s">
          <el-button v-if="s.row.itemType === 0" type="text" size="small"
            @click="showAddAdItemDialog(s.row.id, s.row)">
            新增投放
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination :options="query"
      @current-change="onCurrentChange" />
    <reject-ad-reason :visible="addRejectReasonDialogVisible"
      @hide="addRejectReasonDialogVisible = false"
      @success="rejectAdItem" />
    <add-material v-if="allowAddMaterial"
      :materials="materials" :itemId="currentItemId"
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
import RejectAdReason from './reject-ad-reason'
import AddMaterial from './add-material'
import AddAdItem from './add-ad-item'

import { toHumanTime } from 'utils'
import clone from 'clone'

import {
  formatCategoriesOrAreas
} from 'util/meta'

import {
  allowAddMaterial,
  allowAddAdItem,
  allowVerifyAd
} from 'constant/role'

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
    RejectAdReason,
    BaxPagination,
    AddMaterial,
    AddAdItem
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
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
      addRejectReasonDialogVisible: false,
      addMaterialDialogVisible: false,
      addAdItemDialogVisible: false,

      currentItemId: 0,
      currentItem: {}
    }
  },
  computed: {
    allowAddMaterial() {
      return allowAddMaterial(this.userInfo.roles)
    },
    allowAddAdItem() {
      return allowAddAdItem(this.userInfo.role)
    },
    allowVerify() {
      return allowVerifyAd(this.userInfo.roles)
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
    showRejectReasonDialog(id) {
      this.currentItem = {}
      this.currentItemId = id
      this.addRejectReasonDialogVisible = true
    },
    showAddAdItemDialog(id, item) {
      this.addAdItemDialogVisible = true

      this.currentItem = clone(item)
      this.currentItemId = id
    },
    showAddMaterialDialog(id) {
      this.addMaterialDialogVisible = true
      this.currentItem = {}
      this.currentItemId = id
    },
    async onCurrentChange({offset}) {
      const q = {
        ...this.query,
        offset
      }

      await getAdItems(q)
    },
    async rejectAdItem(reason) {
      const { currentItemId } = this

      await verifyAdItem(currentItemId, 'failed', {
        reason
      })

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
