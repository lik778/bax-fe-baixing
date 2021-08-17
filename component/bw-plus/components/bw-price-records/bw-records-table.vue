<template>
    <el-table
      style="width: 90%"
      :data="records"
      v-loading="loading"
      :default-sort="{prop: 'createdTime', order: 'descending'}"
    >
      <el-table-column fixed prop="id" label="ID" />
      <el-table-column sortable fixed prop="createdTime" width="170" label="日期" :formatter="dateFormater" />
      <el-table-column width="150" :show-overflow-tooltip="true" fixed prop="keywords" label="关键词" :formatter="keywordsFormater" />
      <el-table-column prop="applyType" label="报价类型" :formatter="applyTypeFormatter" />
      <el-table-column width="150" prop="status" label="审核状态">
        <template slot-scope="{ row }">
          <span :class="transformClass(row.status)">{{APPLY_AUDIT_STATUS_OPTIONS[row.status] || '-'}}</span>
          <el-tooltip v-if="row.status === APPLY_AUDIT_STATUS_REJECT" :class="transformClass(row.status)" :content="row.rejectedReason" placement="top-start">
            <i class="error el-icon-question pointer" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="device" label="平台" :formatter="deviceFormatter" />
      <el-table-column prop="cities" width="150" label="投放城市" >
        <template slot-scope="{ row }">
          <el-popover
          placement="top-start"
          title="投放城市"
          width="150"
          trigger="hover"
          >
            <div class="cities-content">{{citiesFormater(row)}}</div>
            <p slot="reference" class="keywords-row">{{ citiesFormater(row) }}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="120" prop="scheduleType" label="推广时段" :formatter="scheduleTypeFormater" />
      <el-table-column prop="days" label="服务时长" :formatter="daysFormater" />
      <el-table-column width="150" prop="industry" label="推广行业" />
      <el-table-column align="right" fixed="right" label="报价">
        <template slot-scope="{ row }">
          <span v-if="row.applyType === APPLY_TYPE_NORMAL || row.price">{{f2y(row.price)}}元</span>
          <el-button v-else :disabled="row.status != APPLY_AUDIT_STATUS_PASS " type="text" @click="reviewPrice(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column width="100" fixed="right" label="操作">
        <template slot-scope="{ row }">
          <el-button @click="preOrder(row)" :disabled="row.operationStatus != OPTION_STATUS_AWAIT_TIDAN" type="text">提单</el-button>
          <i v-if="row.operationStatus === OPTION_STATUS_COPY_URL" @click="preOrder(row)" class="el-icon-document-copy"></i>
        </template>
      </el-table-column>
    </el-table>
</template>
<script>
import { APPLY_AUDIT_STATUS_OPTIONS, APPLY_AUDIT_STATUS_PENDING, APPLY_AUDIT_STATUS_REJECT, APPLY_TYPE_NORMAL, DEVICE, SCHEDULE_TYPE, STATUS_MAP, APPLY_AUDIT_STATUS_PASS, OPTION_STATUS_AWAIT_TIDAN, OPTION_STATUS_COPY_URL } from 'constant/bw-plus'
import { f2y, getCnName } from 'util'
import dayjs from 'dayjs'
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
      APPLY_TYPE_NORMAL,
      STATUS_MAP,
      APPLY_AUDIT_STATUS_REJECT,
      APPLY_AUDIT_STATUS_OPTIONS,
      APPLY_AUDIT_STATUS_PASS,
      OPTION_STATUS_AWAIT_TIDAN,
      OPTION_STATUS_COPY_URL
    }
  },
  methods: {
    keywordsFormater (...args) {
      const [,, keywords] = args
      return keywords.join('、')
    },
    daysFormater (...args) {
      const [,, days] = args
      return days > 0 ? `${days}天` : '-'
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
      return dayjs(cellValue * 1000).format('YYYY-MM-DD HH:mm:ss')
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
    citiesFormater (row) {
      const { cities } = row
      return cities.map(city => getCnName(city, this.allAreas)).join('、')
    },
    reviewPrice (row) {
      this.$emit('reviewPrice', row)
    },
    preOrder (row) {
      this.$emit('preOrder', row)
    },
    transformClass (status) {
      switch (status) {
        case APPLY_AUDIT_STATUS_REJECT:
          return 'reject-item'
        case APPLY_AUDIT_STATUS_PASS:
          return 'pass-item'
        case APPLY_AUDIT_STATUS_PENDING:
          return 'pending-item'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .reject-item{
    color: #F56C6C;
  }
  .pass-item{
    color: #67C23A;
  }
  .pending-item{
    color: #E6A23C;
  }
  .keywords-row{
    width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 6px;
  }
  .cities-content{
    max-height: 200px;
    overflow: auto;
  }
</style>