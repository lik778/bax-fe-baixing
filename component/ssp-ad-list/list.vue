
<template>
  <section class="ad-list">
    <el-table :data="items" style="width: 100%">
      <el-table-column prop="orderId" label="订单编号" width="110" />
      <el-table-column prop="name" label="名称" width="100" />
      <el-table-column label="状态" width="120">
        <template scope="s">
          <el-tooltip v-if="s.row.status === -10"
            effect="dark" placement="top"
            :content="s.row.rejectReason">
            <span class="tip">
              <p>{{ s.row.status | adItemStatus }}</p>
              <i class="el-icon-warning"></i>
            </span>
          </el-tooltip>
          <span v-else>{{ s.row.status | adItemStatus }}</span>
          <el-button size="mini"
            v-if="allowPauseAd && s.row.status === 20"
            @click="onPauseAd(s.row.id, s.row.name)">
            暂停投放
          </el-button>
          <el-button size="mini"
            v-if="allowContinueAd && s.row.status === -5"
            @click="onContinueAd(s.row.id, s.row.name)">
            继续投放
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ad.name" label="广告位" width="120" />
      <el-table-column label="投放时间" width="100">
        <template scope="s">
          <p class="center">
            {{ s.row.timeRange[0] | date }}
          </p>
          <p class="center">-</p>
          <p class="center">
            {{ s.row.timeRange[1] | date }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="类目·区域">
        <template scope="s">
          <p>类目: {{ formatterCategory(s.row) }}</p>
          <p>区域: {{ formatterArea(s.row) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="物料">
        <template scope="s">
          <el-button v-if="allowAddMaterial && !s.row.materialId"
            type="primary" size="mini"
            @click="showAddMaterialDialog(s.row.id, s.row)">
            上传物料
          </el-button>
          <a v-if="s.row.material && s.row.material.imgUrl"
            v-bind:href="s.row.material.imgUrl"
            target="_blank">
            {{ s.row.material.name }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="链接" width="100">
        <template scope="s">
          <a target="_black"
            v-if="s.row.material && s.row.material.link"
            v-bind:href="s.row.material && s.row.material.link">
            点击查看
          </a>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="allowVerify || allowAddAdItem || allowUpdateMaterial" width="100">
        <template scope="s">
          <div>
            <el-button v-if="s.row.itemType === 0"
              type="primary" size="mini"
              @click="showAddAdItemDialog(s.row.id, s.row)">
              新增投放
            </el-button>
          </div>
          <div>
            <el-button v-if="allowUpdateMaterial && s.row.materialId"
              type="warning" size="mini"
              @click="showAddMaterialDialog(s.row.id, s.row)">
              修改物料
            </el-button>
          </div>
          <div v-if="allowVerifyAdItem(s.row.status)">
            <el-button type="danger" size="mini"
              @click="rejectAdItem(s.row.id)">
              拒绝
            </el-button>
          </div>
          <div v-if="allowVerifyAdItem(s.row.status)">
            <el-button type="success" size="mini"
              @click="passAdItem(s.row.id)">
              通过
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination :options="query"
      @current-change="onCurrentChange" />
    <add-material v-if="allowAddMaterial"
      :materials="materials" :itemId="currentItemId"
      :ad="currentItem.ad"
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

import { Message } from 'element-ui'
import { toHumanTime } from 'utils'
import clone from 'clone'

import {
  formatCategoriesOrAreas
} from 'util/meta'

import {
  allowUpdateMaterial,
  allowAddMaterial,
  allowContinueAd,
  allowAddAdItem,
  allowVerifyAd,
  allowPauseAd
} from 'util/role'

import {
  adStatus
} from 'constant/ad'

import {
  continueAdItem,
  verifyAdItem,
  pauseAdItem,
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
      addMaterialDialogVisible: false,
      addAdItemDialogVisible: false,

      currentItemId: 0,
      currentItem: {}
    }
  },
  computed: {
    currentRoles() {
      return (this.userInfo.roles || [])
        .map(r => r.nameEn)
    },
    allowUpdateMaterial() {
      return allowUpdateMaterial(this.userInfo.roles)
    },
    allowAddMaterial() {
      return allowAddMaterial(this.userInfo.roles)
    },
    allowContinueAd() {
      return allowContinueAd(this.userInfo.roles)
    },
    allowAddAdItem() {
      return allowAddAdItem(this.userInfo.roles)
    },
    allowPauseAd() {
      return allowPauseAd(this.userInfo.roles)
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
      return toHumanTime(v, 'MM月DD日')
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
    async onContinueAd(id, name) {
      try {
        await this.$confirm(`确认继续投放: ${name}`)
      } catch (err) {
        return
      }

      await continueAdItem(id)

      await getAdItems({...this.query})

      Message.success('修改成功')
    },
    async onPauseAd(id, name) {
      let reason = ''

      try {
        const { value } = await this.$prompt(`您将暂停投放: ${name}, 请输入理由`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })

        reason = value
      } catch (err) {
        return
      }

      await pauseAdItem(id, {
        reason
      })

      await getAdItems({...this.query})

      Message.success('修改成功')
    },
    allowVerifyAdItem(status) {
      if (status === 0) {
        return this.currentRoles.includes('QA_OPERATOR')
      }

      if (status === 1) {
        return this.currentRoles.includes('DESIGN_QA_OPERATOR')
      }

      return false
    },
    showAddAdItemDialog(id, item) {
      this.addAdItemDialogVisible = true

      this.currentItem = clone(item)
      this.currentItemId = id
    },
    showAddMaterialDialog(id, item) {
      this.addMaterialDialogVisible = true
      this.currentItem = clone(item)
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
      this.currentItem = {}
      this.currentItemId = id

      let reason = ''
      try {
        const { value } = await this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        reason = value
      } catch (err) {
        return
      }

      if (!reason) {
        return Message.error('拒绝理由不能为空')
      }

      await verifyAdItem(id, 'failed', {
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

.center {
  display: flex;
  justify-content: center;
  width: 100%;
}

.tip {
  display: inline-flex;
  align-items: center;

  & > i {
    margin-left: 2px;
    font-size: 11px;
    color: gray;
  }
}

a {
  color: #20a0ff;
}

.ad-list {
  margin-top: 16px;

  & .m-img {
    max-width: 80px;
    max-height: 60px;
    object-fit: contain;
  }
}

</style>
