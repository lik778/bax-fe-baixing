<template>
  <div class="page">
    <header>数据概览<span class="side-header warning">今日数据存在一定延时，且最近1小时内的展现数据会存在波动</span></header>

    <section class="page-section" style="margin-top: 20px">
      <span style="font-size: 14px">选择推广计划：</span>
      <el-select v-model="query.promoteID" placeholder="推广计划" clearable>
        <el-option
          v-for="item in options.promoteList"
          :label="item.coreWord"
          :value="item.id"
          :key="item.id"
        />
      </el-select>

      <header class="chart-header">搜索引擎查询比例<span class="side-header strong">(当前投放时间太短，请8天后查看)</span></header>

      <div class="charts-con">
        <div class="chart-con platform-chart">
          <e-charts :options="platformChartOptions" />
        </div>
        <div class="chart-padding" />
        <div class="chart-con pvs-chart">
          <e-charts :options="pvsChartOptions" />
        </div>
        <div class="chart-padding" />
        <div class="chart-con visited-chart">
          <e-charts :options="visitedChartOptions" />
        </div>
      </div>
    </section>

    <header class="pvs-tabs-header">推广关键字<span class="side-header">近<span class="strong" style="margin: 0 0 0 1px">7日</span>关键词效果</span></header>

    <el-tabs class="words-pvs-tabs" v-model="active.tab">
      <el-tab-pane label="所有关键字" name="allTab">

        <el-table class="query-table" border :data="pvsList">
          <el-table-column label="关键词" prop="coreWord" />
          <el-table-column label="搜索引擎" prop="crawledBy" />
          <el-table-column label="位置">
            <span>首页</span>
          </el-table-column>
          <el-table-column label="快照日期" width="160" :formatter="({ date }) => $formatter.date(date)" />
          <el-table-column label="快照">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="() => checkSnapshotPage(row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="端口" prop="plat" :formatter="({ platform }) => $formatter.mapWith(platform, deviceValueLabelMap)" />
        </el-table>
        <el-pagination
          class="pagniation"
          layout="total,sizes,prev,pager,next"
          :total="pagination.total"
          :page-size="pagination.size"
          :page-sizes="pagination.sizes"
          :current-page="pagination.current"
          @current-change="initPVsData"
          @size-change="handleSizeChange"
        />

      </el-tab-pane>
      <el-tab-pane label="指定关键字" disabled />
    </el-tabs>

  </div>
</template>

<script>
import dayjs from 'dayjs'
import clone from 'clone'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
// TODO resize

import { deviceValueLabelMap } from 'constant/qianci'
import { getPromoteList, getWordPVsList, getSnapshot } from 'api/qianci'

import pieChartOptionTmp from './pieChartOptionTmp'
import lineChartOptionTmp from './lineChartOptionsTmp'

const platformChartOptionTmp = Object.assign(clone(pieChartOptionTmp), {})

const pvsChartOptionTmp = Object.assign(clone(lineChartOptionTmp), {
  color: 'rgba(53, 165, 228, 1)',
  legend: {
    left: 5,
    selectedMode: false,
    icon: 'path://M0 0h120v20H0z',
    textStyle: {
      color: 'rgba(53, 165, 228, 1)'
    }
  },
  series: [{
    name: '关键词曝光量',
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    type: 'line',
    symbol: 'none',
    symbolSize: 0,
    areaStyle: {
      color: 'rgba(53, 165, 228, .4)'
    }
  }]
})

const visitedChartOptionTmp = Object.assign(clone(lineChartOptionTmp), {
  color: 'rgba(255, 99, 80, 1)',
  legend: {
    left: 5,
    selectedMode: false,
    icon: 'path://M0 0h120v20H0z',
    textStyle: {
      color: 'rgba(255, 99, 80, 1)'
    }
  },
  series: [{
    name: '最近7天访问量',
    data: [82, 92, 71, 73, 120, 123, 97],
    type: 'line',
    symbol: 'none',
    symbolSize: 0,
    areaStyle: {
      color: 'rgba(255, 99, 80, .4)'
    }
  }]
})

export default {
  name: "qc-dashboard",
  components: {
    ECharts
  },
  data() {
    return {
      deviceValueLabelMap,
      query: {
        promoteID: '',
      },
      active: {
        tab: 'allTab'
      },
      options: {
        promoteList: []
      },
      pagination: {
        current: 1,
        total: 0,
        size: 15,
        sizes: [10, 15, 30, 50],
      },
      pvsList: [],
      platformChartOptions: Object.assign(platformChartOptionTmp, {}),
      pvsChartOptions: Object.assign(pvsChartOptionTmp, {}),
      visitedChartOptions: Object.assign(visitedChartOptionTmp, {}),
    }
  },
  async created() {
    await this.initPromoteListOptions()
    this.initChartData()
    this.initPVsData()
  },
  methods: {
    // 初始化推广计划列表
    async initPromoteListOptions() {
      const query = {}
      const { data, total } = (await getPromoteList(query)) || {}
      this.options.promoteList = data.map(x => x)
      const next = data[0]
      if (next) {
        this.query.promoteID = String(next.id)
      }
    },
    async initChartData() {

    },
    async initPVsData(page = 1) {
      const query = {}
      const { data, total } = (await getWordPVsList(query)) || {}
      this.pvsList = data.map(x => x)
      this.pagination = {
        ...this.pagination,
        current: page,
        total,
      }
    },
    // 显示快照
    async checkSnapshotPage(item) {
      // const response = await getSnapshot(url)
      const response = require('!!raw-loader!./snapshot.html').default

      // HTML 源码清洗，仅保留 HTML 和 CSS，a 标签不可点击
      function secureHTML(html) {
        return html
          .split(/<script>[^<]*<\/script>/).join('')
          .replace(/(<a\s+[^>]*)href=/gm, '$1')
      }

      this.$alert(secureHTML(response), '快照详情', {
        customClass: 'snapshot-dialog',
        dangerouslyUseHTMLString: true,
        showConfirmButton: false,
        showCancelButton: false
      })
    },

    handleSizeChange(size) {
      this.pagination.size = size
      this.initPVsData()
    }
  }
}
</script>
<style lang="postcss" scoped>
.chart-header {
  margin-top: 30px;
}
.pvs-tabs-header {
  margin-top: 30px
}
.words-pvs-tabs {
  margin-top: .5em;
}
.charts-con {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
}
.chart-padding {
  width: 40px;
  height: 1px;
}
.chart-con {
  flex-grow: 1;
  height: 235px;
  /* background: #f2f2f2; */

  & .echarts,
  & .echarts>div,
  & .echarts>div>canvas {
    width: 100%;
    height: 100%;
  }
}
.platform-chart {
  width: 26%;
}
.pvs-chart {
  width: 32%;
}
.visited-chart {
  width: 32%;
}
.pagniation {
  margin-top: 1em;
}
</style>

<style lang="postcss">
.snapshot-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 0;
  overflow: hidden scroll;

  & .el-message-box__header {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 0 20px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #eee;
    z-index: 999;

    & .el-message-box__headerbtn {
      top: unset;
      right: 25px;
    }
  }
  & .el-message-box__content {
    padding: 40px 0;
  }
}
</style>
