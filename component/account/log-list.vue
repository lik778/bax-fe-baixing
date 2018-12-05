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
      <label class="ml">订单id</label>
      <el-input v-model="queryParmas.campaignId" class="input" placeholder="请输入订单id" />
      <el-button type="primary">查询</el-button>
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
        width="180">
      </el-table-column>
      <el-table-column
        label="类型"
        :formatter="opTypeFormatter"
        width="180">
      </el-table-column>
      <el-table-column
        :formatter="campaignIdFormatter"
        label="计划Id">
      </el-table-column>
      <el-table-column
        :formatter="changeLogFormatter('field')"
        label="变更字段">
      </el-table-column>
      <el-table-column
        :formatter="changeLogFormatter('old')"
        label="变更前">
      </el-table-column>
      <el-table-column
        :formatter="changeLogFormatter('new')"
        label="变更后">
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      @current-change="goto"
      :page-size="ONE_PAGE_NUM"
      layout="total, prev, pager, next"
    >
    </el-pagination>
  </div> 
</template>

<script>
import BaxSelect from 'com/common/select'
import SectionHeader from 'com/common/section-header'

import store from './store'
import moment from 'moment'
import track from 'util/track'
import { toHumanTime } from 'utils'
import { getLogDesc } from 'util/log'

const ONE_PAGE_NUM = 10
const CREATED_AT_VALUES = [
  moment().subtract(1, 'months').unix(),
  moment().subtract(3, 'months').unix(),
  moment().subtract(1, 'years').unix(),
]


import {
  OP_TYPE_CREATE,
  TIMELINE_TYPE_UNKNOWN,

  fieldType,
  opTypeOpts,
  logTypeOpts,
  timelineTypeOpts,
  // productTypeOpts
} from 'constant/log'

export default {
  name: 'qwt-operastion-log-list',
  components: {
    BaxSelect,
    SectionHeader
  },
  fromMobx: {
    logs: () => store.logs
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
      ONE_PAGE_NUM,
      total: 0,

      queryParmas: {
        offset: 0,
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
    async load() {
      await store.getLogs(this.queryParmas)
    },
    goto(page) {
      this.queryParmas.offset = page * ONE_PAGE_NUM
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
        const changeKeys = Object.keys(message.change)
        // OP_TYPE_CREATE
        const opType = message.opType
        if (type === 'field') {
          return changeKeys.map(key => fieldType[key]).toString()
        } else if (type === 'old') {
          if (opType === OP_TYPE_CREATE) return '-'
        }
      }
    }
  },
  watch: {
    queryParmas: {
      deep: true,
      handler(params) {
        console.log(params)
        this.load(params)
      }
    }
  },
  created() {
    this.load()
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
