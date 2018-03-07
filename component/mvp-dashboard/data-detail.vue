<template>
  <div class="mvp-dashboard-data-detail">
    <header>
      <span>
        <label>自定义列：</label>
        <bax-select multiple
          :options="columnOpts"
          v-model="displayColumns">
        </bax-select>
      </span>
      <span>
        <el-button icon="el-icon-view" type="primary" @click="download">
          下载
        </el-button>
      </span>
    </header>
    <main>
      <el-table :data="statistics">
        <el-table-column v-if="checkVisiable('date')"
          label="日期" prop="date" width="140">
        </el-table-column>
        <el-table-column v-if="checkVisiable('campaignId')"
          label="推广计划" prop="campaignId" width="120">
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
          label="平均点击价格" width="160" sortable
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
  mvpColumnOpts
} from 'constant/fengming-report'

import {
  device
} from 'constant/fengming-mvp'

import {
  semPlatformCn
} from 'constant/fengming'

import {
  toHumanTime,
  centToYuan
} from 'utils'

const campaignDefaultColumns = [
  'date', 'campaignId', 'channel', 'device',
  'shows', 'clicks', 'cost', 'clickRate',
  'clickAvgPrice'
]

const isArray = Array.isArray

export default {
  name: 'mvp-dashboard-data-detail',
  components: {
    BaxPagination,
    BaxSelect
  },
  props: {
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
      displayColumns: campaignDefaultColumns,
      columnOpts: mvpColumnOpts
    }
  },
  methods: {
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
    },
    fmtChannel(c) {
      return semPlatformCn[String(c)] || '未知'
    },
    fmtDevice(a) {
      if (!isArray(a)) {
        return device[String(a)]
      }

      return a.map(i => device[String(i)]).join(',')
    },
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

.el-select {
  width: 520px;
}

.mvp-dashboard-data-detail {
  padding: 18px 36px 60px;

  & > header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > label {
      margin-right: 10px;
      font-weight: 600;
      color: #666666;
    }
  }

  & > main {
  }

  & > footer {

  }
}
</style>
