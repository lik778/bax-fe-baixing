<template>
  <div class="page">
    <header>
      数据概览<span class="side-header warning">每日数据统计存在一定延时</span>
    </header>

    <!-- test snapshot -->
    <!-- <el-button @click="() => checkSnapshotPage({ device: 1, url: 'https://test-files.obs.cn-east-3.myhuaweicloud.com/dailiyun_web.html' })">PC</el-button>
    <el-button @click="() => checkSnapshotPage({ device: 2, url: 'https://test-files.obs.cn-east-3.myhuaweicloud.com/dailiyun_wap.html' })">WAP</el-button>
    <el-button @click="() => checkSnapshotPage({ device: 2, url: 'http://sem.baixing.net/sem_testy32454.html' })">WAP</el-button> -->

    <section class="page-section" style="margin-top: 20px">
      <span style="font-size: 14px">选择推广计划：</span>
      <el-select
        v-model="query.promoteID"
        placeholder="推广计划"
        @change="selectPromote"
      >
        <el-option
          v-for="item in options.promoteList"
          :label="
            Array.isArray(item.coreWords)
              ? item.coreWords.join(',')
              : item.value
          "
          :value="item.value"
          :key="item.value"
        />
      </el-select>

      <!-- <header class="chart-header">
        <span v-if="visible.showNoChartData" class="side-header strong"
          >({{ NO_PVS_TIP }})</span
        >
      </header> -->

      <!-- 图表标题 -->
      <!-- <div class="charts-con charts-title-con">
        <div class="chart-con platform-chart">优选词投放量</div>
        <div class="chart-padding" />
        <div class="chart-con pvs-chart">优选词曝光量</div>
        <div class="chart-padding" />
        <div class="chart-con visited-chart">优选词点击量</div>
      </div> -->

      <!-- 图表 -->
      <!-- <div class="charts-con charts-echarts-con">
        <div class="chart-con platform-chart">
          <e-charts
            ref="platformChartOptions"
            :options="platformChartOptions"
          />
        </div>
        <div class="chart-padding" />
        <div class="chart-con pvs-chart">
          <e-charts ref="pvsChartOptions" :options="pvsChartOptions" />
        </div>
        <div class="chart-padding" />
        <div class="chart-con visited-chart">
          <e-charts ref="visitedChartOptions" :options="visitedChartOptions" />
        </div>
      </div> -->

      <!-- 图表副标题 -->
      <!-- <div class="charts-con charts-footer-con">
        <div class="chart-con platform-chart"></div>
        <div class="chart-padding" />
        <div class="chart-con pvs-chart">
          昨日新增
          <span class="static-num pvs-add-num"
            >{{ chartData.pvsAdd }}<i class="el-icon-top"
          /></span>
        </div>
        <div class="chart-padding" />
        <div class="chart-con visited-chart">
          昨日新增
          <span class="static-num pvs-add-num"
            >{{ chartData.visitAdd }}<i class="el-icon-top"
          /></span>
        </div>
      </div> -->
    </section>

    <header class="pvs-tabs-header">
      推广关键字
      <!-- <span class="side-header"
        >近<span class="strong" style="margin: 0 0 0 1px">7日</span
        >关键词效果</span
      > -->
    </header>

    <el-tabs class="words-pvs-tabs" v-model="active.tab">
      <el-tab-pane label="所有关键字" name="allTab">
        <el-table
          class="query-table"
          border
          :data="displayedShowList"
          empty-text="暂无数据，预计在计划投放1~3天后会同步数据报表，请等待"
        >
          <el-table-column label="关键词" prop="keyword" />
          <el-table-column label="搜索引擎">
            <template>百度</template>
          </el-table-column>
          <el-table-column label="位置">
            <span>首页</span>
          </el-table-column>
          <el-table-column
            label="展现端"
            prop="plat"
            :formatter="
              ({ device }) => $formatter.mapWith(device, DEVICE_DASHBOARD)
            "
          />
          <el-table-column prop="days" label="检测时间"/>
          <el-table-column label="实况">
            <template slot-scope="scope">
              <el-button @click="checkSnapshotPage(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagniation"
          layout="total,sizes,prev,pager,next"
          :total="pagination.total"
          :page-size="pagination.size"
          :page-sizes="pagination.sizes"
          :current-page="pagination.current"
          @current-change="initListData"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="指定关键字" disabled />
    </el-tabs>
  </div>
</template>

<script>
import { decompressSync } from 'fflate'
import clone from 'clone'
// import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts-liquidfill'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import {
  getPromoteList,
  getWordPVsList,
  getWordPVsChartData,
  getPreferredWordsPV
} from 'api/qianci'
import {
  PROMOTE_STATUS_PENDING_EDIT,
  PROMOTE_STATUS_EDITED,
  PROMOTE_STATUS_ONLINE,
  PROMOTE_STATUS_ON_PROMOTE,
  DEVICE_DASHBOARD,
  PROMOTE_STATUS_PAUSED
} from 'constant/qianci'
import { parseQuery } from 'util'

import pieChartOptionTmp from './pieChartOptionTmp'
import liquidChartOptionTmp from './liquidChartOptionTmp'

// buffer 转 string
function buffer2string (data) {
  let result = ''
  for (const value of data) result += String.fromCharCode(value)
  // 防止中文乱码 https://www.cnblogs.com/justinwxt/p/12930582.html
  return decodeURIComponent(escape(result))
}

// HTML 源码清洗，仅保留 HTML 和 CSS
function secureHTML (html) {
  return html
    .replace(/<!--[^-]*-->/gim, '')
    .replace(/<script[^>]*>/gim, ' <!-- ')
    .replace(/<\/script[\s]*>/gim, ' --> ')
    .replace(/<!--[^-]*-->/gim, '')
    .replace(/(<a\s+[^>]*)href=/gim, '$1')
}

const platformChartOptionTmp = Object.assign(clone(pieChartOptionTmp), {})
const pvsChartOptionTmp = ((x) => {
  x.series[0].color = ['#80c2fb', '#6caaf8', '#80c2fb']
  x.series[0].outline.itemStyle.borderColor = '#35a5e4'
  x.series[0].backgroundStyle.color = '#f4f9ff'
  return x
})(clone(liquidChartOptionTmp))

const visitedChartOptionTmp = ((x) => {
  x.series[0].color = ['#fd8b6b', '#fb6755', '#fd8b6b']
  x.series[0].outline.itemStyle.borderColor = '#fb6755'
  x.series[0].backgroundStyle.color = '#fef4f4'
  return x
})(clone(liquidChartOptionTmp))

const NO_PVS_TIP = '当前投放时间太短，请8天后查看'

// ******************************* Vue
export default {
  name: 'qc-dashboard',
  components: {
    // ECharts
  },
  data () {
    return {
      query: {
        promoteID: ''
      },
      active: {
        tab: 'allTab'
      },
      options: {
        promoteList: []
      },
      chartData: {
        pvsAdd: 0,
        visitAdd: 0
      },
      pagination: {
        current: 1,
        total: 0,
        size: 15,
        sizes: [10, 15, 30, 50]
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
      pvsChartOptions: pvsChartOptionTmp,
      visitedChartOptions: visitedChartOptionTmp,
      DEVICE_DASHBOARD,
      NO_PVS_TIP
    }
  },
  computed: {
    displayedShowList () {
      return this.loading.charts ? [] : this.pvsList
    }
  },
  async created () {
    const { user_id: targetUserId, sales_id: salesId } = parseQuery(
      window.location.search
    )
    this.store = { targetUserId, salesId }
    await this.initPromoteListOptions()
    if (this.options.promoteList.length) {
      this.selectPromote(this.options.promoteList[0].value)
      // this.initPieChart()
      // this.listenChartResize()
    }
  },
  methods: {
    // 初始化推广计划列表
    async initPromoteListOptions () {
      const { sales_id: salesId, user_id: targetUserId } = this.$route.query
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
          PROMOTE_STATUS_PAUSED
        ]
      }
      const { content } = await getPromoteList(query)
      this.options.promoteList = content.map((x) => ({
        ...x,
        label: x.coreWord,
        value: +x.id
      }))
    },
    async initLiquidChart () {
      const { targetUserId, salesId } = this.store
      const query = {
        targetUserId,
        salesId,
        promoteId: this.query.promoteID
        // promoteId: 103445
      }
      let response = null
      let clickCount = { totalCount: 0, yesterdayCount: 0 }
      let visitCount = { totalCount: 0, yesterdayCount: 0 }
      try {
        this.loading.charts = true
        this.visible.showNoChartData = false
        response = await getWordPVsChartData(query)
        clickCount = response.clickCount
        visitCount = response.visitCount
        this.setLiquidFillChart(visitCount, clickCount)
      } catch (error) {
        this.visible.showNoChartData = true
        this.setLiquidFillChart(visitCount, clickCount)
      } finally {
        this.loading.charts = false
      }
    },
    async initPieChart () {
      const response = await getPreferredWordsPV({ id: this.query.promoteID })
      const { expandedNum = 0 } = response || {}
      const online = {}
      online.wap = Math.floor(expandedNum / 2)
      online.web = expandedNum - online.wap

      const platformData = clone(this.platformChartOptions)
      // 确保饼图中至少有一个像素的数据
      const displayOnline = clone(online)
      displayOnline.web = online.web
      displayOnline.wap = online.wap
      platformData.series[0].data = [
        {
          name: `电脑端: ${online.web}`,
          value: displayOnline.web,
          label: {
            borderColor: '#35a5e4'
          }
        },
        {
          name: `移动端: ${online.wap}`,
          value: displayOnline.wap,
          label: {
            borderColor: '#ffa205'
          }
        }
      ]
      platformData.title.text = `${online.web + online.wap}个`
      this.platformChartOptions = platformData
    },
    setLiquidFillChart (visitCount, clickCount) {
      const liquidChartDatas = [visitCount.totalCount, clickCount.totalCount]
      const yesterdayCount = [
        visitCount.yesterdayCount,
        clickCount.yesterdayCount
      ]
      const pvsData = clone(this.pvsChartOptions)
      const visitsData = clone(this.visitedChartOptions)
      ;[pvsData, visitsData].forEach((d, i) => {
        const yesterday = yesterdayCount[i]
        const total = liquidChartDatas[i]
        if (yesterday === 0) {
          d.series[0].amplitude = '1%'
        }
        if (total === 0) {
          d.series[0].data = [0.13, 0.14, 0.12]
        } else {
          d.series[0].data = [0.43, 0.45, 0.42]
        }
        d.series[0].label.formatter = function () {
          return total + ' {sub|次}'
        }
      })
      this.pvsChartOptions = pvsData
      this.visitedChartOptions = visitsData
      this.chartData = {
        pvsAdd: visitCount.yesterdayCount,
        visitAdd: clickCount.yesterdayCount
      }
    },
    async initListData (page = 1) {
      const { targetUserId, salesId } = this.store
      const query = {
        page: page - 1,
        size: this.pagination.size,
        targetUserId,
        salesId,
        promoteId: this.query.promoteID
        // promoteId: 103445
      }
      let response = null
      try {
        this.loading.showNoListData = false
        response = await getWordPVsList(query)
      } catch (error) {
        this.loading.showNoListData = true
      }
      const { content = [], totalElements = 0 } = response || {}
      this.pvsList = content.map((x) => x)
      this.pagination = {
        ...this.pagination,
        current: page,
        total: totalElements
      }
    },
    // 显示快照
    async checkSnapshotPage (item = {}) {
      const { device, url = 'https://test-files.obs.cn-east-3.myhuaweicloud.com/dailiyun_web.html' } = item
      let response = null
      let html = null
      let customClass = null

      switch (+device) {
        case 1:
          customClass = 'snapshot-dialog'
          break
        case 2:
          customClass = 'snapshot-dialog-mobile'
          break
      }

      const isURLGziped = /\.gz$/.test(url)
      if (isURLGziped) {
        response = await fetch(url).then((res) => res.arrayBuffer())
        const compressed = new Uint8Array(response)
        const decompressed = decompressSync(compressed)
        html = secureHTML(buffer2string(decompressed))
      } else {
        // ungziped backup
        response = await fetch(url).then((data) => data.text())
        html = secureHTML(response)
      }

      const pageOptions = {
        customClass,
        dangerouslyUseHTMLString: true,
        showConfirmButton: false,
        showCancelButton: false,
        closeOnPressEscape: true
      }

      // Wrapper 类名
      const randomID = String(Math.random()).slice(-6)
      const wrapperClass = `snapshot-content-${randomID}`

      // 快照样式修复
      const snapshotFix = '<style>#modal-style,.find-style { display: none } #content_left > div { z-index: unset !important; }</style>'
      html += snapshotFix

      const style =
        customClass === 'snapshot-dialog'
          ? 'width: 100vw; height: calc(100vh - 40px)'
          : 'width: 425px; height: calc(100vh - 40px); margin-top: 39px'

      const $iframe = this.$createElement('iframe', {
        attrs: {
          frameborder: 0
        },
        domProps: {
          src: url,
          srcdoc: html,
          style
        }
      })
      this.$alert($iframe, pageOptions)

      // 防止链接可点击
      this.$nextTick(() => {
        const container = document.querySelector('.' + wrapperClass)
        if (container) {
          try {
            ;[
              ...(
                container.shadowRoot ||
                container.document ||
                container
              ).querySelectorAll('a')
            ].map((a) => a.removeAttribute('href'))
          } catch (error) {
            throw new Error('removeAttribute-href 出错')
          }
        }
      })
    },

    selectPromote (id) {
      this.query.promoteID = +id
      this.$nextTick(() => {
        // this.initLiquidChart()
        // this.initPieChart()
        this.initListData()
      })
    },
    handleSizeChange (size) {
      this.pagination.size = size
      this.initListData()
    },
    listenChartResize () {
      // FIXME: 响应式图表
      // window && window.addEventListener('resize', () => this.initLiquidChart())
      // this.$on(
      //   'hook:beforeDestroy',
      //   window.removeEventListener('resize', this.initLiquidChart)
      // )
    }
  }
}
</script>
<style lang="scss" scoped>
.chart-header {
  margin-top: 30px;
}
.pvs-tabs-header {
  margin-top: 30px;
}
.words-pvs-tabs {
  margin-top: 0.5em;
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
  text-align: center;
  font-weight: 500;

  & .echarts,
  & .echarts > div,
  & .echarts > div > canvas {
    width: 100%;
    height: 100%;
  }
}
.charts-echarts-con {
  margin-top: 13px;
}
.charts-footer-con {
  margin-top: 0;
}
.charts-title-con .chart-con {
  height: 1em;
}
.charts-footer-con .chart-con {
  height: 1em;
  color: #999;
  font-size: 12px;
  font-weight: thin;

  & i {
    font-size: 16px;
    font-weight: bold;
    vertical-align: bottom;
  }
  & .static-num {
    margin-left: 7px;
    color: #ff6350;
  }
}

.platform-chart {
  width: 50%;
}
.pvs-chart {
  width: 24%;
}
.visited-chart {
  width: 24%;
}
.pagniation {
  margin-top: 1em;
}
.el-table /deep/ .el-table__empty-text {
  height: 235px;
  line-height: 235px;
}
</style>

<style lang="scss">
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
    padding: 0px;
    padding-top: 40px;
    overflow: hidden;
  }
  & .el-message-box__btns {
    display: none;
  }
}
.snapshot-dialog-mobile {
  & .el-message-box__content {
    margin: 0 auto;
    padding: 0;
    width: 425px;
  }
}
</style>
