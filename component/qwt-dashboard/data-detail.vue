
<template>
  <div class="qwt-dashboard-data-detail">
    <header>
      数据详情
    </header>
    <section>
      <span>
        <label>自定义列:</label>
        <bax-select multiple :options="columnOpts"
          @click.native="onClickCustomColumns"
          v-model="displayColumns">
        </bax-select>
      </span>
      <span>
        <el-button icon="el-icon-view" type="primary" @click="download">
          下载
        </el-button>
      </span>
    </section>
    <main>
      <el-table :data="statistics">
        <el-table-column v-if="checkVisiable('date')"
          label="日期" prop="date" width="140">
        </el-table-column>
        <el-table-column v-if="checkVisiable('campaignId')"
          label="推广计划" prop="campaignId" width="120">
        </el-table-column>
        <el-table-column v-if="checkVisiable('keyword')"
          label="关键词" prop="keyword" width="120">
        </el-table-column>
        <el-table-column v-if="checkVisiable('cpcRanking')"
          label="平均排名" width="120" sortable
          :formatter="r => fmtCpcRanking(r.cpcRanking)">
        </el-table-column>
        <el-table-column v-if="checkVisiable('channel')"
          label="渠道" width="100"
          :formatter="r => fmtChannel(r.channel)">
        </el-table-column>
        <el-table-column v-if="checkVisiable('device')"
          label="设备" width="100"
          :formatter="r => fmtDevice(r.device)">
        </el-table-column>
        <el-table-column v-if="checkVisiable('shows')"
          label="展现" prop="shows" width="90" sortable>
        </el-table-column>
        <el-table-column v-if="checkVisiable('clicks')"
          label="点击" prop="clicks" width="90" sortable>
        </el-table-column>
        <el-table-column v-if="checkVisiable('cost')"
          label="消费" width="120"
          :formatter="r => (r.cost / 100).toFixed(2) + '元'">
        </el-table-column>
        <el-table-column v-if="checkVisiable('clickRate')"
          label="点击率" width="120" sortable
          :formatter="r => (r.clickRate * 100).toFixed(2) + '%'">
        </el-table-column>
        <el-table-column v-if="checkVisiable('clickAvgPrice')"
          label="平均点击单价" width="160" sortable
          :formatter="r => (r.clickAvgPrice / 100).toFixed(2) + '元'">
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <div class="total" v-if="!!statistics.length">
        <span>
          <label>总展现：</label>
          <strong>{{ summary.shows }}</strong>
        </span>
        <span>
          <label>总点击：</label>
          <strong>{{ summary.clicks }}</strong>
        </span>
        <span>
          <label>总消费：</label>
          <strong>{{ (summary.cost / 100).toFixed(2) + '元' }}</strong>
        </span>
      </div>
      <bax-pagination :options="{ total, offset, limit }"
        @current-change="onCurrentChange">
      </bax-pagination>
    </footer>
  </div>
</template>

<script>
import BaxPagination from 'com/common/pagination'
import BaxSelect from 'com/common/select'

import {
  DIMENSION_CAMPAIGN,
  columnOpts
} from 'constant/fengming-report'

import {
  semPlatformCn
} from 'constant/fengming'

import track from 'util/track'
import {
  fmtCpcRanking
} from 'util/campaign'

import {
  toHumanTime,
  centToYuan
} from 'utils'

// {
//   label: '全选',
//   value: '_all_'
// }

const isArray = Array.isArray

const campaignDefaultColumns = [
  'date', 'campaignId', 'channel', 'device',
  'shows', 'clicks', 'cost', 'clickRate',
  'cpcRanking', 'clickAvgPrice'
]

const keywordDefaultColumns = [
  'date', 'keyword', 'channel', 'device',
  'shows', 'clicks', 'cost', 'clickRate',
  'cpcRanking', 'clickAvgPrice'
]

export default {
  name: 'qwt-dashboard-data-detail',
  components: {
    BaxPagination,
    BaxSelect
  },
  props: {
    statistics: {
      type: Array,
      required: true
    },
    dimension: {
      type: Number,
      required: true
    },
    summary: {
      type: Object,
      required: true
    },
    offset: {
      type: Number,
      required: true
    },
    limit: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      displayColumns: campaignDefaultColumns,
      columnOpts
    }
  },
  methods: {
    onClickCustomColumns() {
      track({
        action: 'qwt-dashboard: click set custom columns'
      })
    },
    onCurrentChange(opts) {
      this.$emit('current-change', opts)
    },
    checkVisiable(column) {
      const { displayColumns } = this

      if (displayColumns.includes('_all_')) {
        return true
      }

      return displayColumns.includes(column)
    },
    download() {
      this.$emit('download')
      track({
        action: 'qwt-dashboard: click download'
      })
    },
    fmtChannel(c) {
      return semPlatformCn[String(c)] || '未知'
    },
    fmtDevice(a) {
      const m = {
        '0': '电脑，手机',
        '1': '电脑',
        '2': '手机'
      }

      if (!isArray(a)) {
        return m[String(a)]
      }

      return a.map(i => m[String(i)]).join(',')
    },
    fmtCpcRanking,
    toHumanTime,
    centToYuan
  },
  watch: {
    dimension(v) {
      this.displayColumns = v === DIMENSION_CAMPAIGN
        ? campaignDefaultColumns
        : keywordDefaultColumns
    }
  }
}
</script>

<style scoped>
.total {
  padding: 10px 5px;

  & > span {
    & > label {
      color: #6a778c;
    }

    margin-right: 20px;
  }
}

.qwt-dashboard-data-detail {
  margin: 50px 0 30px;

  & > header {
    display: flex;
    align-items: center;
    height: 35px;
    padding-left: 30px;
    border-radius: 3px;
    background: #e5e9f2;
    font-size: 14px;
    color: #6a778c;
  }

  & > section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 68px;
    padding: 10px 15px 10px 5px;

    & > span:first-child {
      display: flex;
      align-items: center;
      min-width: 480px;

      & > label {
        margin-right: 25px;
        font-size: 14px;
        color: #6a778c;
      }

      & > div {
        flex-grow: 1;
      }
    }
  }
}
</style>
