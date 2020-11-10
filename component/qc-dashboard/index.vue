<template>
  <div class="page">
    <header>数据概览<span class="side-header warning">每日数据统计存在一定延时</span></header>

    <section class="page-section" style="margin-top: 20px">
      <span style="font-size: 14px">选择推广计划：</span>
      <el-select v-model="query.promoteID" placeholder="推广计划" clearable @change="selectPromote">
        <el-option
          v-for="item in options.promoteList"
          :label="item.label"
          :value="item.value"
          :key="item.value"
        />
      </el-select>

      <header class="chart-header">搜索引擎查询比例<span v-if="visible.showNoChartData" class="side-header strong">({{NO_PVS_TIP}})</span></header>

      <div class="charts-con">
        <div class="chart-con platform-chart">
          <e-charts ref="platformChartOptions" :options="platformChartOptions" />
        </div>
        <div class="chart-padding" />
        <div class="chart-con pvs-chart">
          <e-charts ref="pvsChartOptions" :options="pvsChartOptions" />
        </div>
        <div class="chart-padding" />
        <div class="chart-con visited-chart">
          <e-charts ref="visitedChartOptions" :options="visitedChartOptions" />
        </div>
      </div>
    </section>

    <header class="pvs-tabs-header">推广关键字<span class="side-header">近<span class="strong" style="margin: 0 0 0 1px">7日</span>关键词效果</span></header>

    <el-tabs class="words-pvs-tabs" v-model="active.tab">
      <el-tab-pane label="所有关键字" name="allTab">

        <el-table
          class="query-table"
          border
          :data="displayedShowList"
          :empty-text="NO_PVS_TIP"
          :span-method="paddingNoData"
        >
          <el-table-column label="关键词" prop="keyword" />
          <el-table-column label="搜索引擎">
            <template>百度</template>
          </el-table-column>
          <el-table-column label="位置">
            <template slot-scope="{row}">
              <span v-if="row.rank">首页</span>
              <p v-else>优选中，请稍后...</p>
            </template>
          </el-table-column>
          <el-table-column label="快照日期" width="160" :formatter="({ urlTime }) => $formatter.date(urlTime)" />
          <el-table-column label="快照">
            <template slot-scope="{row}">
              <el-button :disabled="!row.url || !+row.rank" type="text" size="small" @click="() => checkSnapshotPage(row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="端口" prop="plat" :formatter="({ device }) => $formatter.mapWith(device, DEVICE_DASHBOARD)" />
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
import { decompressSync } from 'fflate'
import dayjs from 'dayjs'
import clone from 'clone'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'

import { getPromoteList, getWordPVsList, getWordPVsChartData, getSnapshot } from 'api/qianci'
import {
  PROMOTE_STATUS_PENDING_EDIT,
  PROMOTE_STATUS_EDITED,
  PROMOTE_STATUS_ONLINE,
  PROMOTE_STATUS_ON_PROMOTE,
  DEVICE_DASHBOARD
} from 'constant/qianci'
import { checkSupportShadowDOM, parseQuery } from 'util'

import pieChartOptionTmp from './pieChartOptionTmp'
import lineChartOptionTmp from './lineChartOptionsTmp'

// buffer 转 string
function buffer2string(data) {
  let result = ''
  for (let value of data)
    result += String.fromCharCode(value)
  // 防止中文乱码 https://www.cnblogs.com/justinwxt/p/12930582.html
  return decodeURIComponent(escape(result))
}

// HTML 源码清洗，仅保留 HTML 和 CSS，a 标签不可点击
function secureHTML(html) {
  return html
    .replace(/<!--[^-]*-->/img, '')
    .replace(/<script[^>]*>/img, ' <!-- ')
    .replace(/<\/script[\s]*>/img, ' --> ')
    .replace(/<!--[^-]*-->/img, '')
    .replace(/(<a\s+[^>]*)href=/img, '$1')
}

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
    data: [],
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
    data: [],
    type: 'line',
    symbol: 'none',
    symbolSize: 0,
    areaStyle: {
      color: 'rgba(255, 99, 80, .4)'
    }
  }]
})

const NO_PVS_TIP = '当前投放时间太短，请8天后查看'

// ******************************* Vue
export default {
  name: "qc-dashboard",
  components: {
    ECharts
  },
  data() {
    return {
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
      visible: {
        showNoChartData: false,
        showNoListData: false
      },
      loading: {
        charts: false
      },
      store: {},
      pvsList: [],
      platformChartOptions: Object.assign(platformChartOptionTmp, {}),
      pvsChartOptions: Object.assign(pvsChartOptionTmp, {}),
      visitedChartOptions: Object.assign(visitedChartOptionTmp, {}),
      DEVICE_DASHBOARD,
      NO_PVS_TIP
    }
  },
  computed: {
    displayedShowList() {
      return this.loading.charts
        ? []
        : this.pvsList
    }
  },
  async created() {
    const { user_id: targetUserId, sales_id: salesId } = parseQuery(window.location.search)
    this.store = { targetUserId, salesId }
    await this.initPromoteListOptions()
    this.listenChartResize()
  },
  methods: {
    // 初始化推广计划列表
    async initPromoteListOptions() {
      const { sales_id: salesId, user_id: targetUserId } = this.$route.query
      // ? 要不要新加接口
      const query = {
        size: 999,
        page: 0,
        targetUserId,
        salesId,
        status: [
          PROMOTE_STATUS_PENDING_EDIT,
          PROMOTE_STATUS_EDITED,
          PROMOTE_STATUS_ONLINE,
          PROMOTE_STATUS_ON_PROMOTE,
        ]
      }
      const { total, content } = await getPromoteList(query)
      this.options.promoteList = content.map(x => ({
        ...x,
        label: x.coreWord,
        value: +x.id
      }))
      this.selectPromote(this.options.promoteList[0].value)
    },
    async initCharts() {
      const { targetUserId, salesId } = this.store
      const query = {
        targetUserId,
        salesId,
        promoteId: this.query.promoteID
      }
      let response = null
      try {
        this.loading.charts = true
        this.visible.showNoChartData = false
        response = await getWordPVsChartData(query)
      } catch(error) {
        this.visible.showNoChartData = true
        throw new Error(error)
      } finally {
        this.loading.charts = false
      }
      const { online = {}, weekData = [] } = response || {}
      const hasWeekData = weekData.length

      const platformData = clone(this.platformChartOptions)
      // 确保饼图中至少有一个像素的数据
      const displayOnline = clone(online)
      displayOnline.web = +online.web || 1
      displayOnline.wap = +online.wap || 1
      platformData.series[0].data = [
        {
          name: `电脑端: ${online.web}`,
          value: displayOnline.web,
          label: {
            borderColor: '#35a5e4',
          }
        },
        {
          name: `移动端: ${online.wap}`,
          value: displayOnline.wap,
          label: {
            borderColor: '#ffa205',
          }
        }
      ]
      platformData.title.text = `${+online.web + online.wap}个`
      this.platformChartOptions = platformData

      const pvsData = clone(this.pvsChartOptions)
      pvsData.series[0].name = '关键词曝光量'
      if (hasWeekData) {
        pvsData.xAxis.data = weekData.map(x => dayjs(x.dayTime ? String(x.dayTime).replace(/^(\d{4})(\d{2})(\d{2]})$/g, '$1-$2-$3') : '').format('YYYY-MM-DD'))
        pvsData.series[0].data = weekData.map(x => +x.shows)
      } else {
        pvsData.xAxis.data = [dayjs().format('YYYY-MM-DD')]
        pvsData.series[0].data = [0]
      }
      pvsData.series[0].areaStyle.color = 'rgba(53, 165, 228, .4)'
      this.pvsChartOptions = pvsData

      const visitsData = clone(this.visitedChartOptions)
      visitsData.series[0].name = '最近7天访问量'
      if (hasWeekData) {
        visitsData.xAxis.data = weekData.map(x => dayjs(x.dayTime ? String(x.dayTime).replace(/^(\d{4})(\d{2})(\d{2]})$/g, '$1-$2-$3') : '').format('YYYY-MM-DD'))
        visitsData.series[0].data = weekData.map(x => +x.click)
      } else {
        visitsData.xAxis.data = [dayjs().format('YYYY-MM-DD')]
        visitsData.series[0].data = [0]
      }
      visitsData.series[0].areaStyle.color = 'rgba(255, 99, 80, .4)'
      this.visitedChartOptions = visitsData
    },
    async initPVsData(page = 1) {
      const { targetUserId, salesId } = this.store
      const query = {
        page: page - 1,
        size: this.pagination.size,
        targetUserId,
        salesId,
        promoteId: this.query.promoteID
      }
      let response = null
      try {
        this.loading.showNoListData = false
        response = await getWordPVsList(query)
      } catch(error) {
        this.loading.showNoListData = true
        throw new Error(error)
      }
      const { content = [], totalElements = 0 } = response || {}
      this.pvsList = content.map(x => x)
      this.pagination = {
        ...this.pagination,
        current: page,
        total: totalElements,
      }
    },
    // 显示快照
    async checkSnapshotPage(item = {}) {
      let { device, url } = item
      let response = null
      let customClass = null

      switch (+device) {
        case 1:
          customClass = 'snapshot-dialog'
          break
        case 2:
          customClass = 'snapshot-dialog-mobile'
          break
      }

      response = await fetch(url)
        .then(res => {
          return res.arrayBuffer()
        })

      const compressed = new Uint8Array(response)
      const decompressed = decompressSync(compressed)
      const html = secureHTML(buffer2string(decompressed))

      const supportShadowDOM = checkSupportShadowDOM()
      const pageOptions = {
        customClass,
        dangerouslyUseHTMLString: true,
        showConfirmButton: false,
        showCancelButton: false,
        closeOnPressEscape: true
      }
      if (supportShadowDOM) {
        this.$alert('<div class="snapshot-content" />', '快照详情', pageOptions)
        this.$nextTick(() => {
          const container = document.querySelector('.snapshot-content')
          const shadow = container.attachShadow({ mode: 'open' })
          const snapshotFix = '<style>/*这里可以放一些快照页面样式的修复代码*/</style>'
          shadow.innerHTML = (html + snapshotFix)
        })
      } else {
        // TODO 用 iframe 做 backup
        this.$alert(html, '快照详情', pageOptions)
      }

    },

    selectPromote(id) {
      this.query.promoteID = +id
      this.$nextTick(() => {
        this.initCharts()
        this.initPVsData()
      })
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.initPVsData()
    },
    listenChartResize() {
      window && window.addEventListener('resize', () => this.initCharts())
      this.$on('hook:beforeDestroy', window.removeEventListener('resize', this.initCharts))
    },
    paddingNoData({ row, rowIndex, columnIndex }) {
      const isDisabled = !+row.rank
      if (isDisabled) {
        if (columnIndex == 2) {
          return {
            colspan: 3,
            rowspan: 1,
          }
        } else if (columnIndex == 3 || columnIndex == 4) {
          return {
            colspan: 0,
            rowspan: 0,
          }
        }
      }
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
.el-table /deep/ .el-table__empty-text {
  height: 235px;
  line-height: 235px;
}
</style>

<style lang="postcss">
.snapshot-dialog,
.snapshot-dialog-mobile {
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
.snapshot-dialog-mobile {
  & .el-message-box__content {
    margin: 0 auto;
    width: 425px;
  }
}
</style>
