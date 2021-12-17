<template>
  <div class="bw-plus-plan-list">
    <el-breadcrumb separator="/"
                   class="breadcrumb">
      <el-breadcrumb-item>管理推广</el-breadcrumb-item>
      <el-breadcrumb-item>推广计划</el-breadcrumb-item>
    </el-breadcrumb>
    <main>
      <el-table :data="promotes">
        <el-table-column label="计划ID"
                         prop="id" />
        <el-table-column label="关键词"
                         prop="keyword" />
        <el-table-column label="平台"
                         :formatter="r => DEVICE[r.device]" />
        <el-table-column label="审核状态">
          <status-show slot-scope="{row}"
                       :dot-color="AUDIT_STATUS_COLOR_MAP[row.auditStatus]">
            <span>{{AUDIT_STATUS_MAP[row.auditStatus]}}</span>
            <el-tooltip v-if="row.auditStatus === AUDIT_STATUS_REJECT"
                        :content='row.rejectedReason'>
              <i class="el-icon-info" />
            </el-tooltip>
          </status-show>
        </el-table-column>
        <el-table-column label="投放状态">
          <status-show slot-scope="{row}"
                       :dot-color="PROMOTE_STATUS_COLOR_MAP[row.status]">
            <span>{{PROMOTE_STATUS_MAP[row.status]}}</span>
          </status-show>
        </el-table-column>
        <el-table-column prop="cities" width="180" label="投放城市" >
          <template slot-scope="{ row }">
              <el-popover
                placement="right"
                width="500"
                trigger="hover">
                <ProvinceCityMap :allAreas="allAreas" :cities="row.cities"/>
                <span slot="reference">{{ citiesFormater(row).text }}</span>
              </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="推广时段"
                         :formatter="r => SCHEDULE_TYPE[r.scheduleType]" />
        <el-table-column label="服务时长"
                         :formatter="r => phoenixsVersion == 1 ? '老套餐' : `${r.days}天`" />
        <el-table-column label="投放剩余天数"
                         :formatter="r => `${r.remainDays}天`" />
        <el-table-column label="操作">
          <div slot-scope="{row}">
            <el-button type="text"
                       style="padding: 0"
                       @click="() => $router.push({ name: 'bw-plus-edit-plan', params: { id: row.id }})">
              编辑创意
            </el-button>
          </div>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script>
import { getUsePromoteListByPackageId } from 'api/biaowang-plus'
import {
  DEVICE,
  PROMOTE_STATUS_MAP,
  AUDIT_STATUS_MAP,
  SCHEDULE_TYPE,
  PROMOTE_STATUS_COLOR_MAP,
  AUDIT_STATUS_COLOR_MAP,
  AUDIT_STATUS_REJECT
} from 'constant/bw-plus'
import { getCnName } from 'util'
import StatusShow from './components/statusShow'
import { ProvinceCityMap } from './components'

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
      PROMOTE_STATUS_COLOR_MAP,
      AUDIT_STATUS_COLOR_MAP,
      SCHEDULE_TYPE,
      AUDIT_STATUS_REJECT,
      promotes: [],
      phoenixsVersion: this.$route.query.phoenixsVersion
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
    },
    citiesFormater (row) {
      const { cities } = row
      const length = cities.length
      const detail = cities.map(city => getCnName(city, this.allAreas)).join('、')
      if (length >= 362) {
        return {
          text: '全国',
          detail
        }
      }
      return {
        text: `${getCnName(cities[0], this.allAreas)}等${length}个城市`,
        detail
      }
    }
  },
  components: {
    StatusShow,
    ProvinceCityMap
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
  main {
    padding: 40px 20px;
  }
}
</style>
