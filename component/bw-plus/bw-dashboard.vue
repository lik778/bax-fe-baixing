<template>
    <section class="bw-plus-dashboard">
        <h2>昨日数据</h2>
        <p>展现（次)<br/>{{yesterdayShow[0] && yesterdayShow[0].show}}</p>
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
            <el-tab-pane label="计划维度" name="promote"></el-tab-pane>
            <el-tab-pane label="关键词维度" name="keyword"></el-tab-pane>
        </el-tabs>
        <el-select @change="changeHandle" v-if="activeName === 'promote'" v-model="searchId" placeholder="请选择">
          <el-option
            v-for="item in promoteList"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select @change="changeHandle" v-if="activeName === 'keyword'" v-model="searchId" placeholder="请选择">
          <el-option
            v-for="item in keywordList"
            :key="item.id"
            :label="item.keyword"
            :value="item.id">
          </el-option>
        </el-select>
        <DataRange @getDate="getDate" @searchData="searchData"/>
        <p class="show-tips">提示：仅支持查看昨日之前的数据，数据可能会有波动。</p>
        <ECharts style="width: 100%; max-width: 1300px; margin-top: 20px"
        :options="chartOptions"></ECharts>
    </section>
</template>
<script>
import { DataRange } from './components'
import ECharts from 'vue-echarts/components/ECharts.vue'
import dayjs from 'dayjs'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import { keywordList, promoteList, promoteDataShow } from 'api/biaowang-plus'
const baseOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  xAxis: {
    type: 'category',
    data: [dayjs().format('YYYY-MM-DD')],
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    nameTextStyle: {
      color: '#5099d8'
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      lineStyle: {
        width: 1
      },
      itemStyle: {
        // 普通样式。
        normal: {
          // 点的颜色。
          color: '#5099d8'
        }
      }
    }
  ]
}
export default {
  name: 'bw-plus-dashboard',
  components: { DataRange, ECharts },
  data () {
    return {
      activeName: 'promote',
      showChartData: [],
      searchId: 0,
      promoteList: [],
      keywordList: [],
      daterange: [],
      showInfo: [],
      chartOptions: { ...baseOptions },
      yesterdayShow: []
    }
  },
  methods: {
    getDate (daterange) {
      this.daterange = daterange
    },
    async searchData (daterange) {
      this.daterange = daterange
      const { searchId, activeName } = this
      const { query: { user_id: userId } } = this.$route
      const baseParams = {
        userId,
        start: daterange[0].unix(),
        end: daterange[1].unix()
      }
      const singleShowParam = { [activeName === 'promote' ? 'packageId' : 'promoteId']: searchId }
      const params = searchId ? { ...singleShowParam, ...baseParams } : baseParams
      const { data: { showInfo } } = await promoteDataShow(params)
      this.showInfo = showInfo
      this.chartOptions.xAxis.data = showInfo.map(o => dayjs(o.timestamp * 1000).format('YYYY-MM-DD'))
      this.chartOptions.series[0].data = showInfo.map(o => o.show)
    },
    async getYestodayShow () {
      const { query: { user_id: userId } } = this.$route
      const params = {
        userId,
        start: dayjs().subtract(1, 'day').unix(),
        end: dayjs().subtract(1, 'day').unix()
      }
      const { data: { showInfo } } = await promoteDataShow(params)
      this.yesterdayShow = showInfo
    },
    async getPromoteList () {
      const { query: { user_id: userId } } = this.$route
      if (this.promoteList.length) {
        this.searchId = this.promoteList[0].id
        return
      }
      const { data } = await promoteList({ userId })
      const tempdata = data.map(o => (
        {
          id: o.id,
          label: `计划${o.id}`
        }
      ))
      this.promoteList = [...[{ id: 0, label: '全部' }], ...tempdata]
      this.searchId = this.promoteList[0].id
    },
    async getKeywordList () {
      const { query: { user_id: userId } } = this.$route
      if (this.keywordList.length) {
        this.searchId = this.keywordList[0].id
        return
      }
      const { data } = await keywordList({ userId })
      this.keywordList = [...[{ id: 0, keyword: '全部' }], ...data]
      this.searchId = this.keywordList[0].id
    },
    async handleClickTab (tab) {
      const { name } = tab
      const { daterange } = this
      name === 'promote' ? await this.getPromoteList() : await this.getKeywordList()
      this.searchData(daterange)
    },
    async changeHandle (value) {
      this.searchId = value
      const { daterange } = this
      await this.searchData(daterange)
    }
  },
  async mounted () {
    const { daterange } = this
    await this.getPromoteList()
    await this.getYestodayShow()
    await this.searchData(daterange)
  }
}
</script>
<style lang="scss" scoped>
   .bw-plus-dashboard{
        min-height: 100%;
        background: #fff;
        margin: 10px;
        box-sizing: border-box;
   }
   .show-tips{
     font-size: 14px;
     margin-top: 30px;
     color: #909399;
   }
</style>
