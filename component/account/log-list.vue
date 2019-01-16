<template>
  <div class="layout-container">
    <section-header>历史操作记录</section-header>
    <!-- <label>查询产品</label>
    <bax-select v-model="productType"
      :clearable="false"
      placeholder="请选择"
      :options="productTypeOpts"
      @click.native="onClickProductType">
    </bax-select> -->
    <label class="ml">选择查询项目</label>
    <bax-select
      v-model="queryParmas.timelineType"
      :clearable="false"
      placeholder="请选择查询项目"
      :options="timelineTypeOpts">
    </bax-select>
    <label class="ml">选择查询类型</label>
    <bax-select
      :clearable="false"
      placeholder="请选择查询类型"
      v-model="queryParmas.opType"
      :options="opTypeOpts">
    </bax-select>
    <el-radio-group v-model="queryParmas.createdAt" class="radio">
      <el-radio-button :label="genCreatedAtValues(0)">近一个月</el-radio-button>
      <el-radio-button :label="genCreatedAtValues(1)">近三个月</el-radio-button>
      <el-radio-button :label="genCreatedAtValues(2)">近一年</el-radio-button>
    </el-radio-group>
    <div class="input-wrap">
      <label class="ml">计划id</label>
      <bax-input v-model="queryParmas.campaignId" class="input" placeholder="请输入计划id" />
    </div>

    <el-table class="log-table"
      :data="logs"
      style="width: 100%">
      <el-table-column
        label="日期"
        prop="createdAt"
        :formatter="dateFormatter"
        width="180">
      </el-table-column>
      <!-- <el-table-column
        label="产品"
        prop="productType"
        width="100">
      </el-table-column> -->
      <el-table-column
        label="项目"
        prop="timelineType"
        :formatter="timelineTypeFormatter"
        width="90">
      </el-table-column>
      <el-table-column
        label="类型"
        :formatter="opTypeFormatter"
        width="80">
      </el-table-column>
      <el-table-column
        :formatter="campaignIdFormatter"
        label="计划Id"
        width="110">
      </el-table-column>
      <el-table-column
        :formatter="changeLogFormatter('field')"
        label="变更字段"
        align="center"
        width="260">
      </el-table-column>
      <el-table-column
        :formatter="changeLogFormatter('old')"
        label="变更前"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        :formatter="changeLogFormatter('new')"
        label="变更后"
        align="center"
        width="180">
      </el-table-column>
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
import moment from 'moment'
import track from 'util/track'
import { toHumanTime } from 'utils'
import { SEM_PLATFORM_SOGOU } from 'constant/fengming'
import {
  fieldType,
  opTypeOpts,
  logTypeOpts,
  timelineTypeOpts,

  OP_TYPE_CREATE,
  TIMELINE_TYPE_UNKNOWN,
  // productTypeOpts
} from 'constant/log'


const ONE_PAGE_NUM = 10
const MAX_AREAS_LOG_LENGTH = 30
const CREATED_AT_VALUES = [
  moment().subtract(1, 'months').unix(),
  moment().subtract(3, 'months').unix(),
  moment().subtract(1, 'years').unix(),
]
const DIVIDING_CHAR = '   '

const genFormatLogValues = (change, keys, type, opType, campaignSource) => {
  const valueKey = type === 'old' ? 'oldValue' : 'newValue'
  return keys.map(k => {
    const value = opType === OP_TYPE_CREATE ? change[k] : change[k][valueKey]
    if (k === 'price' || k === 'dailyBudget') {
      return (value / 100).toFixed(2)
    } else if (k === 'timeRange') {
      if (value.includes(null)) return '全时段'
      return value.map(timeStamp => toHumanTime(new Date(timeStamp * 1000), 'MM月DD')).join('~')
    } else if (k === 'status') {
      return value === -10 ? '开启投放' : '暂停投放'
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
  data() {
    return {
      opTypeOpts,
      timelineTypeOpts,
      // productTypeOpts,

      offset: 0,

      queryParmas: {
        opType: '',
        campaignId: '',
        timelineType: '',
        limit: ONE_PAGE_NUM,
        createdAt: CREATED_AT_VALUES[0],
        // productType: '3',
      },
    }
  },
  methods: {
    genCreatedAtValues(index) {
      return CREATED_AT_VALUES[index]
    },
    async load(isResetOffset) {
      if (isResetOffset) this.offset = 0
      await store.getLogs({
        ...this.queryParmas,
        offset: this.offset
      })
    },
    goto(page) {
      this.offset = (page - 1) * ONE_PAGE_NUM
      this.load()
    },
    opTypeFormatter({message: {opType}}) {
      return opTypeOpts.find(({value}) => value === opType).label
    },
    timelineTypeFormatter({timelineType}) {
      return timelineTypeOpts.find(({value}) => value === timelineType).label
    },
    dateFormatter({createdAt}) {
      return toHumanTime(createdAt, 'YYYY-MM-DD HH:mm')
    },
    campaignIdFormatter({message:{campaignId}}) {
      return campaignId
    },
    changeLogFormatter(type) {
      return ({message}) => {
        const change = message.change
        const changeKeys = Object.keys(change)
        const opType = message.opType
        const campaignSource = message.campaignSource
        if (type === 'field') {
          return changeKeys.map(key => fieldType[key]).join(DIVIDING_CHAR)
        } else if (type === 'old') {
          if (opType === OP_TYPE_CREATE) return '-'
          return genFormatLogValues(change, changeKeys, type, opType, campaignSource)
        } else if (type === 'new') {
          return genFormatLogValues(change, changeKeys, type, opType, campaignSource)
        }
      }
    }
  },
  watch: {
    queryParmas: {
      deep: true,
      immediate: true,
      handler(params) {
        this.load(true)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.layout-container {
  & >>> .el-select {
    width: 110px;
  }
  & .ml {
    margin-left: 20px;
  }
  & .el-select, & .el-input {
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
