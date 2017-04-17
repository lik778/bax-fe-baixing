
<template>
  <section>
    <el-table :data="groups" style="width: 100%">
      <el-table-column type="expand">
        <template scope="scope">
          <item-list :group-id="scope.row.id"></item-list>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="id" width="180">
      </el-table-column>
      <el-table-column prop="adId" label="adId" width="180">
      </el-table-column>
      <el-table-column prop="offlineAt" label="下线时间">
      </el-table-column>
      <el-table-column prop="onlineAt" label="上线时间">
      </el-table-column>
      <el-table-column label="物料">
        <template scope="scope">
          <el-button type="text" size="small"
            v-if="!scope.row.materialId"
            @click="showAddMaterialDialog(scope.row.id)">
            上传物料
          </el-button>
          <span v-else>{{ scope.row.materialId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核">
        <template scope="scope">
          <el-button type="text" size="small"
            @click="rejectAdGroup(scope.row.id)">
            拒绝
          </el-button>
          <el-button type="text" size="small"
            @click="passAdGroup(scope.row.id)">
            通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加物料" v-model="dialogAddMaterialVisible">
      <div>
        <bax-select :options="[]" :on-change="() => {}"></bax-select>
      </div>
      <div>
        <el-input v-model="material.name"></el-input>
      </div>
      <div>
        <el-input v-model="material.content"></el-input>
      </div>
      <div>
        <span>上传物料</span>
        <uploader :on-success="url => material.url = url"></uploader>
      </div>
      <div slot="footer">
        <el-button @click="cancelAddMaterial">
          取消
        </el-button>
        <el-button type="primary" @click="addMaterial">
          确认
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>

import Uploader from 'com/common/uploader'
import BaxSelect from 'com/common/select'

import ItemList from './item-list'

import {
  addAdGroupMaterial,
  verifyAdGroup,
  verifyAdItem,
  getAdGroups
} from './action'

const emptyMaterial = {
  content: '',
  name: '',
  url: ''
}

export default {
  name: 'ad-group-list',
  components: {
    BaxSelect,
    Uploader,
    ItemList
  },
  props: {
    groups: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogAddMaterialVisible: false,
      material: {...emptyMaterial},
      currentGroupId: 0
    }
  },
  methods: {
    showAddMaterialDialog(gid) {
      this.dialogAddMaterialVisible = true
      this.currentGroupId = gid
    },
    emptyData() {
      this.material = {...emptyMaterial}

      this.currentGroupId = 0
    },
    cancelAddMaterial() {
      this.dialogAddMaterialVisible = false
      this.emptyData()
    },
    async addMaterial() {
      const {
        currentGroupId,
        material
      } = this
      // TODO - 字段检测
      await addAdGroupMaterial(currentGroupId, material)

      this.dialogAddMaterialVisible = false
      this.emptyData()
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

</style>
