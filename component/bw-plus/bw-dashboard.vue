<template>
    <section class="bw-plus-dashboard">
        <h2>昨日数据</h2>
        <p>展现（次)<br/>{{yesterdayShow[0] && yesterdayShow[0].show}}</p>
        <el-form :inline="true" ref="form" :model="searchform" label-width="80px">
          <el-form-item label="词包：" prop="searchPackgeId" name="">
            <el-select @change="changePackgeHandle" v-model="searchform.searchPackgeId" placeholder="请选择">
              <el-option
                v-for="item in promoteList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词：" prop="searchPromoteId" name="">
            <el-select @change="changePromoteHandle" v-model="searchform.searchPromoteId" placeholder="请选择">
              <el-option
                v-for="item in keywordList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <DataRange @getDate="getDate" @searchData="changeDateRange"/>
        <p class="show-tips">提示：仅支持查看昨日之前的数据，数据可能会有波动。</p>
        <el-empty v-if="!showInfo.length" description="该时段暂时没有数据哦～"></el-empty>
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
import { promoteList, promoteDataShow } from 'api/biaowang-plus'
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
      promoteList: [],
      keywordList: [],
      daterange: [],
      showInfo: [],
      chartOptions: { ...baseOptions },
      yesterdayShow: [],
      searchId: 0,
      searchform: {
        searchPackgeId: null,
        searchPromoteId: null
      }
    }
  },
  methods: {
    getDate (daterange) {
      this.daterange = daterange
    },
    async searchData (opts = {}) {
      const { daterange } = this
      const { query: { user_id: userId } } = this.$route
      const baseParams = {
        userId,
        start: daterange[0].unix(),
        end: daterange[1].unix()
      }
      const params = { ...opts, ...baseParams }
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
        this.searchId = this.promoteList[0].packageId
        return
      }
      const { data } = await promoteList({ userId })
      const tempdata = data.map(o => (
        {
          id: o.packageId,
          label: `计划${o.packageId}`,
          promoteList: [...[{ id: null, label: '全部' }], ...o.promoteList.map(o => ({ id: o.promoteId, label: o.keyword }))]
        }
      ))
      this.keywordList = [...[{ id: null, label: '全部' }]]
      this.promoteList = [...[{ id: null, label: '全部', promoteList: [{ id: null, label: '全部' }] }], ...tempdata]
      this.searchform.searchPackgeId = this.promoteList[0].id
      this.searchform.searchPromoteId = this.keywordList[0].id
    },
    async changePromoteHandle () {
      const { searchform: { searchPromoteId: promoteId, searchPackgeId: packageId } } = this
      await this.searchData({ promoteId, packageId })
    },
    async changePackgeHandle (value) {
      this.keywordList = this.promoteList.filter(o => o.id === value)[0].promoteList
      this.searchform.searchPromoteId = this.keywordList[0].id
      const opts = {
        packageId: value
      }
      await this.searchData(opts)
    },
    async changeDateRange (daterange) {
      this.daterange = daterange
      const { searchform: { searchPromoteId: promoteId, searchPackgeId: packageId } } = this
      await this.searchData({ promoteId, packageId })
    }
  },
  async mounted () {
    await this.getPromoteList()
    await this.getYestodayShow()
    await this.searchData()
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
