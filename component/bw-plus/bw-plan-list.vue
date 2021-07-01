<template>
  <div class="bw-plus-plan-list">
    <el-breadcrumb separator="/"
                   class="breadcrumb">
      <el-breadcrumb-item>管理推广</el-breadcrumb-item>
      <el-breadcrumb-item>推广计划</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="promotes"
              class="table">
      <el-table-column label="计划ID"
                       prop="id" />
      <el-table-column label="关键词"
                       prop="keyword" />
      <el-table-column label="平台"
                       :formatter="r => DEVICE[r.device]" />
      <el-table-column label="审核状态">
        <div slot-scope="{row}"
             class="status-container">
          <span class="dot"></span>
          <!-- TODO: 失败增加失败原因 -->
          <span>{{AUDIT_STATUS_MAP[row.auditStatus]}}</span>
        </div>
      </el-table-column>
      <el-table-column label="投放状态">
        <div slot-scope="{row}"
             class="status-container">
          <span class="dot"></span>
          <span>{{PROMOTE_STATUS_MAP[row.status]}}</span>
        </div>
      </el-table-column>
      <el-table-column label="投放城市"
                       tooltip
                       :formatter="r => r.cities.map(o => getCnName(o, allAreas)).join(',')" />
      <el-table-column label="推广时段"
                       :formatter="r => SCHEDULE_TYPE[r.scheduleType]" />
      <el-table-column label="服务时长"
                       :formatter="r => `${r.days}天`" />
      <el-table-column label="投放剩余天数"
                       :formatter="r => `${r.remainDays}天`" />
      <el-table-column label="操作">
        <div slot-scope="{row}">
          <el-button type="text"
                     @click="() => $router.push({ name: 'bw-plus-edit-plan', params: { id: row.id }})">
                     编辑创意
          </el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUsePromoteListByPackageId } from 'api/biaowang-plus'
import { DEVICE, PROMOTE_STATUS_MAP, AUDIT_STATUS_MAP, SCHEDULE_TYPE } from 'constant/bw-plus'
import { getCnName } from 'util'

export default {
  name: 'bw-plus-plan-list',
  props: {
    allAreas: {
      type: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      DEVICE,
      PROMOTE_STATUS_MAP,
      AUDIT_STATUS_MAP,
      SCHEDULE_TYPE,

      promotes: []
    }
  },
  mounted () {
    this.getPromoteList()
  },
  methods: {
    getCnName,
    async getPromoteList () {
      const id = this.$route.params.id
      const data = await getUsePromoteListByPackageId(id)
      this.promotes = data
    }
  }
}
</script>

<style lang='scss' scoped>
.bw-plus-plan-list {
  margin: 10px;
  background: #fff;
  padding: 0;
  > .breadcrumb {
    color: #666;
    border-bottom: 1px solid #e6e6e6;
    padding: 14px;
    font-size: 13px;
  }
  > .table {
    padding: 14px;
    margin-top: 20px;
  }
}
</style>
