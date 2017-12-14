
<template>
  <div class="qwt-dashboard-data-detail">
    <header>
      数据详情
    </header>
    <section>
      <span>
        <label>自定义列:</label>
        <bax-select multiple :options="columnOpts"
          v-model="displayColumns">
        </bax-select>
      </span>
      <span>
        <a download="数据报表.xls" :href="csvDownloadUrl">
          <el-button icon="view" type="primary">
            下载
          </el-button>
        </a>
      </span>
    </section>
    <main>
      <el-table :data="statistics">
        <el-table-column v-if="checkVisiable('date')" label="日期"
          prop="date" width="120">
        </el-table-column>
        <el-table-column v-if="checkVisiable('campaignId')" label="推广计划"
          prop="campaignId" width="120">
        </el-table-column>
        <el-table-column v-if="checkVisiable('cpcRanking')" label="平均排名"
          :formatter="r => fmtCpcRanking(r.cpcRanking)"
          width="150" sortable>
        </el-table-column>
        <el-table-column v-if="checkVisiable('channel')" label="渠道"
          :formatter="r => fmtChannel(r.channel)">
        </el-table-column>
        <el-table-column v-if="checkVisiable('device')" label="设备"
          :formatter="r => fmtDevice(r.device)">
        </el-table-column>
        <el-table-column v-if="checkVisiable('keyword')" label="关键词"
          prop="keyword">
        </el-table-column>
        <el-table-column v-if="checkVisiable('shows')" label="展现"
          prop="shows" width="90" sortable>
        </el-table-column>
        <el-table-column v-if="checkVisiable('clicks')" label="点击"
          prop="clicks" width="90" sortable>
        </el-table-column>
        <el-table-column v-if="checkVisiable('cost')" label="消费"
          :formatter="r => (r.cost / 100).toFixed(2) + '元'"
          width="120">
        </el-table-column>
        <el-table-column v-if="checkVisiable('clickRate')" label="点击率"
          :formatter="r => r.clickRate.toFixed(4)"
          width="120" sortable>
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
          <strong>{{ centToYuan(summary.cost) + '元' }}</strong>
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
  columnOpts
} from 'constant/fengming-report'

import {
  semPlatformCn,
  device
} from 'constant/fengming'

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

export default {
  name: 'qwt-dashboard-data-detail',
  components: {
    BaxPagination,
    BaxSelect
  },
  props: {
    csvDownloadUrl: {
      type: String,
      required: true
    },
    statistics: {
      type: Array,
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
      displayColumns: columnOpts.map(c => c.value),
      columnOpts
    }
  },
  methods: {
    checkVisiable(column) {
      const { displayColumns } = this

      if (displayColumns.includes('_all_')) {
        return true
      }

      return displayColumns.includes(column)
    },
    fmtChannel(c) {
      return semPlatformCn[String(c)] || '未知'
    },
    fmtDevice(a) {
      if (!isArray(a)) {
        // sogou
        return a
      }

      return a.map(i => device[String(i)]).join(',')
    },
    fmtCpcRanking,
    toHumanTime,
    centToYuan
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
