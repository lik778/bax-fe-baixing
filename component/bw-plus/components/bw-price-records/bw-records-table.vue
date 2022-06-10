<template>
  <div>
    <el-table
      style="width: 90%"
      :data="records"
      v-loading="loading"
      :default-sort="{prop: 'createdTime', order: 'descending'}"
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column sortable prop="createdTime" width="170" label="日期" :formatter="dateFormater" />
      <el-table-column sortable prop="renewApply" label="类型">
        <template slot-scope="{ row }">
          <span v-if="row.renewApply === true">续费</span>
          <span v-if="row.renewApply === false">新购</span>
        </template>
      </el-table-column>
      <el-table-column width="150" prop="keywords" label="关键词">
        <template slot-scope="{ row }">
          <el-popover
          placement="top-start"
          title="关键词"
          width="300"
          trigger="hover"
          >
            <div class="cities-content">
              {{row.keywords.join('、')}}
            </div>
            <p slot="reference">{{ keywordsFormater(row) }}</p>
          </el-popover>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="applyType" label="报价类型" :formatter="applyTypeFormatter" /> -->
      <el-table-column prop="status" label="审核状态">
        <template slot-scope="{ row }">
          <span :class="transformClass(row.status)">{{APPLY_AUDIT_STATUS_OPTIONS[row.status] || '-'}}</span>
          <el-tooltip v-if="row.status === APPLY_AUDIT_STATUS_REJECT" :class="transformClass(row.status)" :content="row.rejectedReason" placement="top-start">
            <i class="error el-icon-question pointer" />
          </el-tooltip>
          <el-tooltip v-if="row.status === APPLY_AUDIT_STATUS_PASS && row.comment" :class="transformClass(row.status)" :content="row.comment" placement="top-start">
            <i class="error el-icon-question pointer" />
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="device" label="平台" :formatter="deviceFormatter" /> -->
      <el-table-column prop="cities" width="150" label="投放城市" >
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
      <!-- <el-table-column width="120" prop="scheduleType" label="推广时段" :formatter="scheduleTypeFormater" />
      <el-table-column prop="days" label="服务时长" :formatter="daysFormater" /> -->
      <el-table-column prop="industry" label="推广行业" />
      <el-table-column align="right" label="报价">
        <template slot-scope="{ row }">
          <span v-if="row.applyType === APPLY_TYPE_NORMAL || row.price">{{f2y(row.price)}}元</span>
          <el-button v-else :disabled="row.status != APPLY_AUDIT_STATUS_PASS " type="text" @click="reviewPrice(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column width="100" label="绑定销售" prop="salesName"/>
      <el-table-column width="150" fixed="right" label="操作">
        <template slot-scope="{ row }">
          <el-button @click="getDetail(row)" type="text">查价详情</el-button>
          <el-button @click="preOrder(row)" :disabled="notAllowTidan.includes(row.status) || !is_YBS_ACCOUNTING || row.operationStatus === NOT_OPRATION" type="text">提单</el-button>
          <i v-if="row.operationStatus === OPTION_STATUS_COPY_URL" @click="preOrder(row)" class="el-icon-document-copy"></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { APPLY_AUDIT_STATUS_OPTIONS, APPLY_AUDIT_STATUS_PENDING, APPLY_AUDIT_STATUS_REJECT, APPLY_TYPE_NORMAL, DEVICE, SCHEDULE_TYPE, STATUS_MAP, APPLY_AUDIT_STATUS_PASS, OPTION_STATUS_AWAIT_TIDAN, OPTION_STATUS_COPY_URL, notAllowTidan } from 'constant/bw-plus'
import { f2y, getCnName } from 'util'
import dayjs from 'dayjs'
import ProvinceCityMap from '../common/province-city-map.vue'
import gStore from '../../../store'
import { checkRoles, normalizeRoles } from 'util/role'
const NOT_OPRATION = 50
export default {
  name: 'bw-records-table',
  components: { ProvinceCityMap },
  fromMobx: {
    currentUser: () => gStore.currentUser
  },
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
      NOT_OPRATION,
      f2y,
      APPLY_TYPE_NORMAL,
      STATUS_MAP,
      APPLY_AUDIT_STATUS_REJECT,
      APPLY_AUDIT_STATUS_OPTIONS,
      APPLY_AUDIT_STATUS_PASS,
      OPTION_STATUS_AWAIT_TIDAN,
      OPTION_STATUS_COPY_URL,
      notAllowTidan,
      allAreasNew: {}
    }
  },
  computed: {
    is_YBS_ACCOUNTING () {
      const { roles } = this.currentUser
      const currentRoles = normalizeRoles(roles)
      return checkRoles(currentRoles, ['YBS_ACCOUNTING'])
    }
  },
  methods: {
    getDetail (row) {
      this.$emit('getDetail', row)
    },
    keywordsFormater (args) {
      const { keywords } = args
      const length = keywords.length
      return length > 1 ? `${keywords[0]}等${length}个关键词` : keywords.join('、')
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
