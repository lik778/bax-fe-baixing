<template>
    <el-table
      style="width: 90%"
      :data="records"
      v-loading="loading"
    >
      <el-table-column align="center" fixed prop="id" label="ID" />
      <el-table-column align="center" fixed prop="createdTime" width="120" label="日期" :formatter="dateFormater" />
      <el-table-column width="120" align="center" fixed prop="keywords" label="关键词">
        <template slot-scope="{ row }">
          {{ row.keywords.join("、") }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="applyType" label="报价类型" :formatter="applyTypeFormatter" />
      <el-table-column align="center" prop="status" label="审核状态" :formatter="statusFormatter" />
      <el-table-column align="center" prop="device" label="平台" :formatter="deviceFormatter" />
      <el-table-column align="center" prop="cities" width="200" label="投放城市" :formatter="citiesFormater" />
      <el-table-column align="center" width="120" prop="scheduleType" label="推广时段" :formatter="scheduleTypeFormater" />
      <el-table-column align="center" prop="days" label="服务时长" :formatter="daysFormater" />
      <el-table-column align="center" width="150" prop="industry" label="推广行业" />
      <el-table-column align="center" fixed="right" label="报价">
        <template slot-scope="{ row }">
          <span v-if="row.applyType === APPLY_TYPE_NORMAL">{{f2y(row.price)}}元</span>
          <el-button v-else type="text" @click="reviewPrice(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="{ row }">
          <el-button :disabled="row.tradeSeq" type="text">提单</el-button>
        </template>
      </el-table-column>
    </el-table>
</template>
<script>
import { APPLY_AUDIT_STATUS_OPTIONS, APPLY_TYPE_NORMAL, DEVICE, SCHEDULE_TYPE, SERVICE_DAYS } from 'constant/bw-plus'
import { f2y, getCnName } from 'util'
export default {
  name: 'bw-records-table',
  props: {
    records: {
      type: Array,
      default: () => [],
      require: true
    },
    loading: {
      type: Boolean,
      default: true,
      require: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      f2y,
      APPLY_TYPE_NORMAL
    }
  },
  methods: {
    daysFormater (...args) {
      const [,, days] = args
      return SERVICE_DAYS[days] || '-'
    },
    scheduleTypeFormater (...args) {
      const [,, cellValue] = args
      return SCHEDULE_TYPE[cellValue] || '-'
    },
    applyTypeFormatter (...args) {
      const [,, cellValue] = args
      return cellValue === APPLY_TYPE_NORMAL ? '系统报价' : '人工报价'
    },
    dateFormater (...args) {
      const [,, cellValue] = args
      return cellValue.split('T')[0] || '-'
    },
    priceFormatter (...args) {
      const [,, cellValue] = args
      return `${f2y(cellValue)}元`
    },
    statusFormatter (...args) {
      const [,, cellValue] = args
      return APPLY_AUDIT_STATUS_OPTIONS[cellValue] || '-'
    },
    deviceFormatter (...args) {
      const [,, cellValue] = args
      return DEVICE[cellValue] || '-'
    },
    citiesFormater (...args) {
      const [,, cities] = args
      return cities.slice(0, 20).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > 20 ? `等${cities.length}个城市` : '') || '-'
    },
    reviewPrice (row) {
      this.$emit('reviewPrice', row)
    }
  }
}
</script>
