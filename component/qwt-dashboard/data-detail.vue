
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
          :formatter="r => toHumanTime(r.date, 'YYYY-MM-DD')">
        </el-table-column>
        <el-table-column v-if="checkVisiable('plan')" label="推广计划"
          prop="cpcPlanName">
        </el-table-column>
        <el-table-column v-if="checkVisiable('channel')" label="渠道"
          :formatter="r => fmtChannel(r.channel)">
        </el-table-column>
        <el-table-column v-if="checkVisiable('platform')" label="设备"
          :formatter="r => fmtDevice(r.device)">
        </el-table-column>
        <el-table-column v-if="checkVisiable('keyword')"
          prop="cpcName" label="关键词">
        </el-table-column>
        <el-table-column v-if="checkVisiable('shows')"
          prop="shows" label="展现" sortable>
        </el-table-column>
        <el-table-column v-if="checkVisiable('click')"
          prop="clicks" label="点击" sortable>
        </el-table-column>
        <el-table-column v-if="checkVisiable('cost')" label="消费"
          :formatter="r => (r.cost / 100) + '元'">
        </el-table-column>
        <el-table-column v-if="checkVisiable('percent')"
          prop="clickRate" label="点击率" sortable>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script>

import BaxSelect from 'com/common/select'

import {
  toHumanTime,
  centToYuan
} from 'utils'

import {
  semPlatformCn,
  device
} from 'constant/fengming'

// {
//   label: '全选',
//   value: '_all_'
// }

const columnOpts = [{
  label: '日期',
  value: 'date'
}, {
  label: '推广计划',
  value: 'plan'
}, {
  label: '渠道',
  value: 'channel'
}, {
  label: '设备',
  value: 'platform'
}, {
  label: '关键词',
  value: 'keyword'
}, {
  label: '展现',
  value: 'shows'
}, {
  label: '点击',
  value: 'click'
}, {
  label: '消费',
  value: 'cost'
}, {
  label: '点击率',
  value: 'percent'
}]

export default {
  name: 'qwt-dashboard-data-detail',
  components: {
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
      return a.map(i => device[String(i)]).join(',')
    },
    toHumanTime,
    centToYuan
  }
}

</script>

<style scoped>

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
