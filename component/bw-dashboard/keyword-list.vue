<template>
  <el-table :data="data"
            style="margin-top: 20px; max-width:1000px"
            border
            ref="bwDashboardKeywordList"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange">
    <el-table-column type="selection"
                     :reserve-selection="true"
                     width="55"
                     v-if="canSelected" />
    <el-table-column prop="word"
                     label="关键词"
                     min-width="160px" />
    <el-table-column label="城市"
                     min-width="160px"
                     :formatter="row => cityFormatter(row.cities)" />
    <el-table-column label="平台"
                     :formatter="row => deviceFormatter(row.device)" />
    <el-table-column label="投放状态"
                     :formatter="v => statusFormatter(v.status)" />
    <el-table-column label="审核状态"
                     :formatter="v => auditStatusFormatter(v.auditStatus)" />
    <el-table-column label="购买日期"
                     width="120"
                     :formatter="dateFormatter">
    </el-table-column>
    <el-table-column label="剩余投放天数"
                     width="160">
      <template slot-scope="scope">
        <div>{{leftDays(scope.row)}}天(共{{scope.row.days}}天)</div>
      </template>
    </el-table-column>
    <el-table-column label="操作"
                     width="100"
                     v-if="canDeleted">
      <template slot-scope="scope">
        <el-button @click="handleDelete(scope.row.id)"
                   type="text">
          删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {
  DEVICE,
  PROMOTE_STATUS,
  AUDIT_STATUS,
  PROMOTE_STATUS_PENDING_ONLINE,
  PROMOTE_STATUS_OFFLINE
} from 'constant/biaowang'
 import { f2y, getCnName } from 'util'
import dayjs from 'dayjs'

export default {
  name: 'bw-dashboard-keyword-table',
  props: {
    allAreas: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true
    },
    canSelected: {
      type: Boolean,
      default: false
    },
    canDeleted: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (!this.canSelected) return
    this.$nextTick(() => {
      this.$on('clear-selection', ()=> {
        this.$refs.bwDashboardKeywordList.clearSelection()
      })
      this.$on('promote-change', (promote) => {
        this.$refs.bwDashboardKeywordList.toggleRowSelection(promote, true)
      })
    })
  },
  methods: {
    handleDelete(id) {
      this.$emit('delete', id)
    },
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    },
    cityFormatter(cities) {
      const max = 20
      return cities.slice(0, max).map(
        city => getCnName(city, this.allAreas)).join(',') + (cities.length > max 
        ? `等${cities.length}个城市` 
        : '')
    },
    deviceFormatter(device) {
      return DEVICE[device]
    },
    statusFormatter(status) {
      const res = Object.entries(PROMOTE_STATUS).find(arr => arr[1].includes(status))
      return res && res[0]
    },
    auditStatusFormatter(auditStatus) {
      const res = Object.entries(AUDIT_STATUS).find(arr => arr[1].includes(auditStatus))
      return res && res[0]
    },
    dateFormatter({createdAt}) {
      return dayjs(createdAt * 1000).format('YYYY-MM-DD')
    },
    leftDays(row) {
      if (!PROMOTE_STATUS_PENDING_ONLINE.concat(PROMOTE_STATUS_OFFLINE).includes(row.status)) {
        let daysLeft = row.days
        if (row.startedAt) {
          // 可能是负值
          daysLeft = row.days - (Date.now() - row.startedAt * 1000) / 86400 / 1000
        }
        return Math.floor(Math.max(daysLeft, 0))
      }
    },
    getRowKeys(row) {
      return row.id
    }
  }
}
</script>