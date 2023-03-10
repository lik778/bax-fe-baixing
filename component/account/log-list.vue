<template>
  <div class="layout-container">
    <section-header>历史操作记录</section-header>
    <label>查询产品</label>
    <bax-select
      v-model="queryParmas.productType"
      :clearable="false"
      placeholder="请选择"
      :options="productTypeOpts"
    >
    </bax-select>
    <label class="ml">选择查询项目</label>
    <bax-select
      v-model="queryParmas.timelineType"
      placeholder="请选择查询项目"
      :clearable="false"
      :options="timelineTypeOpts"
    />
    <label class="ml">选择查询类型</label>
    <bax-select
      v-model="queryParmas.opType"
      placeholder="请选择查询类型"
      :clearable="false"
      :options="opTypeOpts"
    />
    <el-radio-group v-model="queryParmas.createdAt" class="radio">
      <el-radio-button :label="genCreatedAtValues(0)">近一个月</el-radio-button>
      <el-radio-button :label="genCreatedAtValues(1)">近三个月</el-radio-button>
      <el-radio-button :label="genCreatedAtValues(2)">近一年</el-radio-button>
    </el-radio-group>
    <div class="input-wrap">
      <label>{{selectByType().type}}</label>
      <bax-input v-model="queryParmas.selectId" class="input" :placeholder="selectByType().placeholder" />
    </div>

    <el-table class="log-table" :data="logs" style="width: 100%">
      <el-table-column
        label="日期"
        :formatter="dateFormatter"
        width="180">
      </el-table-column>
      <el-table-column
        label="产品"
        prop="productType"
        :formatter="productFormatter"
        width="100">
      </el-table-column>
      <el-table-column
        label="项目"
        prop="timelineType"
        :formatter="timelineTypeFormatter"
        width="140">
      </el-table-column>
      <el-table-column
        :formatter="selectIdFormatter"
        :label="selectByType().type"
        width="80">
      </el-table-column>
      <el-table-column
        label="类型"
        :formatter="opTypeFormatter"
        width="80">
      </el-table-column>
      <el-table-column
        :formatter="changeLogFormatter('field')"
        label="变更字段"
        align="center">
      </el-table-column>
      <el-table-column
        :formatter="changeLogFormatter('old')"
        label="变更前"
        align="center">
      </el-table-column>
      <el-table-column
        :formatter="changeLogFormatter('new')"
        label="变更后"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="operator"
        label="操作人"
        align="center"/> -->
    </el-table>
    <el-pagination
      :total="total"
      :page-size="queryParmas.limit"
      :current-page="Math.floor(offset / queryParmas.limit) + 1"
      @current-change="goto"
      layout="total, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
import BaxSelect from 'com/common/select'
import SectionHeader from 'com/common/section-header'
import BaxInput from 'com/common/input'

import store from './store'
import dayjs from 'dayjs'
import { toHumanTime } from 'utils'
import {
  SEM_PLATFORM_SOGOU,
  RAW_CAMPAIN_STATUS as R_C,
  RAW_GROUP_STATUS as R_G
} from 'constant/fengming'
import {
  fieldType,
  opTypeOpts,
  productTypeOpts,
  fengmingTimelineTypeOpts,
  biaowangTimelineTypeOpts,
  selectType,
  OP_TYPE_CREATE,
  PRODUCT_TYPE_FENGMING
} from 'constant/log'

const ONE_PAGE_NUM = 10
const MAX_AREAS_LOG_LENGTH = 30
const CREATED_AT_VALUES = [
  dayjs().subtract(1, 'months').unix(),
  dayjs().subtract(3, 'months').unix(),
  dayjs().subtract(1, 'years').unix()
]
const DIVIDING_CHAR = '   '

const genFormatLogValues = (change, keys, type, opType, campaignSource, message) => {
  const valueKey = type === 'old' ? 'oldValue' : 'newValue'
  // eslint-disable-next-line array-callback-return
  return keys.map(k => {
    const value = opType === OP_TYPE_CREATE ? change[k] : change[k][valueKey]
    if (k === 'price' || k === 'dailyBudget') {
      return (value / 100).toFixed(2)
    } else if (k === 'timeRange') {
      if (value.includes(null)) return '全时段'
      return value.map(timeStamp => toHumanTime(new Date(timeStamp * 1000), 'MM月DD')).join('~')
    } else if (k === 'status') {
      const isGroup = message.groupName
      const campaignStatusDisplay = {
        [R_C.STATUS_ONLINE]: '计划投放中',
        [R_C.STATUS_ACCOUNT_BUDGET_NOT_ENOUGH]: '计划预算不足',
        [R_C.STATUS_CAMPAIGN_BUDGET_NOT_ENOUGH]: '计划预算不足',
        [R_C.STATUS_OFFLINE]: '计划下线',
        [R_C.STATUS_INVALID_DATE]: '计划暂停',
        [R_C.STATUS_INVALID_REGION]: '计划暂停',
        [R_C.STATUS_PAUSE]: '计划暂停',
        [R_C.STATUS_MIGRATE_PAUSE]: '计划暂停'
      }
      const groupStatusDisplay = {
        [R_G.STATUS_ONLINE]: '单元投放中',
        [R_G.STATUS_OFFLINE]: '单元下线',
        [R_G.STATUS_PAUSE]: '单元暂停'
      }
      return (isGroup
        ? groupStatusDisplay[value]
        : campaignStatusDisplay[value]) ?? '未知状态'
    } else if (k === 'schedule') {
      if (campaignSource === SEM_PLATFORM_SOGOU) {
        return value.every(v => v === 3670009) ? '全部时段' : '部分时段'
      }
      return value.every(v => v === 16777215) ? '全部时段' : '部分时段'
    } else if (k === 'areas') {
      const sliceAreas = value.slice(0, MAX_AREAS_LOG_LENGTH)
      return `${sliceAreas.toString()}${sliceAreas.length === MAX_AREAS_LOG_LENGTH ? '...' : ''}`
    } else if (k in fieldType) {
      return value
    }
  }).join(DIVIDING_CHAR)
}

export default {
  name: 'qwt-operastion-log-list',
  components: {
    BaxInput,
    BaxSelect,
    SectionHeader
  },
  fromMobx: {
    logs: () => store.logs,
    total: () => store.totalLogs
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      opTypeOpts,
      fengmingTimelineTypeOpts,
      productTypeOpts,
      offset: 0,
      queryParmas: {
        opType: '',
        selectId: '',
        timelineType: '',
        limit: ONE_PAGE_NUM,
        createdAt: CREATED_AT_VALUES[0],
        productType: PRODUCT_TYPE_FENGMING,
        userId: this.$route.query.user_id
      }
    }
  },
  methods: {
    genCreatedAtValues (index) {
      return CREATED_AT_VALUES[index]
    },
    async initData (isResetOffset) {
      if (isResetOffset) this.offset = 0
      const params = {
        ...this.queryParmas
      }
      await store.getLogs({
        ...params,
        offset: this.offset
      })
    },
    goto (page) {
      this.offset = (page - 1) * ONE_PAGE_NUM
      this.initData()
    },
    genMaterial (material) {
      const { biaowang, fengming } = material
      return this.queryParmas.productType === PRODUCT_TYPE_FENGMING ? fengming : biaowang
    },
    productFormatter () {
      return this.genMaterial({ biaowang: '标王', fengming: '站外推广' })
    },
    selectByType () {
      return this.genMaterial(selectType)
    },
    opTypeFormatter ({ opType, message }) {
      if (message) {
        opType = message.opType
      }
      return opTypeOpts.find(({ value }) => value === opType).label
    },
    timelineTypeFormatter (item) {
      const { timelineType } = item
      const timelineTypeOpts = this.genMaterial({
        fengming: fengmingTimelineTypeOpts,
        biaowang: biaowangTimelineTypeOpts
      })
      const result = timelineTypeOpts.find(({ value }) => value === timelineType)
      const label = result && result.label
      const name = this.groupNameFormatter(item)

      return name ? `${label}（${name}）` : label
    },
    groupNameFormatter ({ message }) {
      return message?.groupName
    },
    dateFormatter ({ createdAt, timestamp }) {
      return toHumanTime(createdAt || timestamp, 'YYYY-MM-DD HH:mm')
    },
    selectIdFormatter ({ word: id, message }) {
      if (message) {
        id = message.campaignId
      }
      return id
    },
    changeLogFormatter (type) {
      const fengmingFormatter = ({ message }) => {
        if (!message) return
        const change = message.change
        const changeKeys = Object.keys(change)
        const opType = message.opType
        const campaignSource = message.campaignSource
        if (type === 'field') {
          return changeKeys.map(key => fieldType[key]).join(DIVIDING_CHAR)
        } else if (type === 'old') {
          if (opType === OP_TYPE_CREATE) return '-'
          return genFormatLogValues(change, changeKeys, type, opType, campaignSource, message)
        } else if (type === 'new') {
          return genFormatLogValues(change, changeKeys, type, opType, campaignSource, message)
        }
      }
      const biaowangFormatter = ({ before, after, timelineType }) => {
        if (type === 'field') {
          const result = biaowangTimelineTypeOpts.find(({ value }) => value === timelineType)
          return result && result.label
        }
        if (type === 'new') return after
        if (type === 'old') return before || '-'
      }
      return this.genMaterial({
        biaowang: biaowangFormatter,
        fengming: fengmingFormatter
      })
    }
  },
  computed: {
    isSelectedFengming () {
      const productType = this.queryParmas.productType
      return productType === PRODUCT_TYPE_FENGMING
    },
    timelineTypeOpts () {
      return this.genMaterial({
        biaowang: biaowangTimelineTypeOpts,
        fengming: fengmingTimelineTypeOpts
      })
    }
  },
  watch: {
    queryParmas: {
      deep: true,
      immediate: true,
      handler () {
        this.initData(true)
      }
    },
    'queryParmas.productType': {
      handler () {
        this.queryParmas.timelineType = ''
        this.queryParmas.opType = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  & /deep/ .el-select {
    width: 110px;
  }
  & .ml {
    margin-left: 20px;
  }
  & .el-select,
  & .el-input {
    margin-left: 8px;
  }
}
.log-table {
  margin: 40px 0 20px;
}
.radio {
  margin-left: 40px;
}
.input-wrap {
  margin-top: 18px;
  & .input {
    width: 200px;
    margin-right: 6px;
  }
}
</style>
