<template>
  <div class="bw-dashboard">
    <dashboard-header :sst-agent="userInfo.sstAgent"></dashboard-header>
    <div class="tip">今日数据存在一定的延时，且最近1小时内的展现数据会存在波动</div>
    <section class="keyword">
      <div class="title">推广关键词</div>
      <el-tabs class="bw-keyword-tabs"
               v-model="activeTab"
               @tab-click="getChartData">
        <el-tab-pane label="不限关键词"
                     name="noLimit"></el-tab-pane>
        <el-tab-pane label="指定关键词"
                     name="limit">
          <el-button type="primary"
                     icon="el-icon-plus"
                     @click="addKeywordModalShow = true">添加指定关键词</el-button>
          <div>
            <template v-if="promotes.length">
              <keyword-list :can-deleted="true"
                            :all-areas="allAreas"
                            @delete="handleDeletePromote"
                            :data="promotes.slice(pageSize * (currentPage - 1), pageSize * currentPage)">
              </keyword-list>
              <el-pagination class="pagination"
                             layout="prev, pager, next"
                             :total="totalPage"
                             :page-size="pageSize"
                             :current-page="currentPage"
                             @current-change="(val) => currentPage = val">
              </el-pagination>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="date-range">
        <el-button class="date-range-panel"
                   :class="{'date-range-panel__active': item.label === activeDaterangeLabel}"
                   v-for="item in daterangeList"
                   :key="item.label"
                   size="small"
                   @click="handleDateChange(item)">
          {{item.label}}
        </el-button>
        <el-date-picker v-model="daterange"
                        :picker-options="triPickerOptions"
                        @focus="activeDaterangeLabel = CUSTOM_DATE_RANGE_LABEL"
                        :class="{
                          'date-range-custom__active': activeDaterangeLabel === CUSTOM_DATE_RANGE_LABEL
                        }"
                        :clearable="false"
                        type="daterange"
                        size="small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <add-keyword :show="addKeywordModalShow"
                   ref="addKeyword"
                   v-if="addKeywordModalShow"
                   @close="handleKeywordClose"
                   :all-areas="allAreas"
                   :original-promotes="promotes"></add-keyword>
    </section>
    <chart v-if="showChartData && showChartData.length"
           :chart-data="showChartData"
           y-axis-name="展现量"></chart>
    <chart v-if="cpcRankingChartData && cpcRankingChartData.length"
           :chart-data="cpcRankingChartData"
           y-axis-name="平均排名"></chart>
  </div>
</template>

<script>
import DashboardHeader from './header'
import Chart from './chart'
import KeywordList from './keyword-list'
import AddKeyword from './add-keyword'

import { getPromoteById, getUserRanking, getUserShow } from 'api/biaowang'
import dayjs from 'dayjs'
import clone from 'clone'

const CUSTOM_DATE_RANGE_LABEL = 'custom'

const daterangeList = [
  {
    label: '昨日',
    daterange: [
     dayjs().subtract(1, 'day'),
     dayjs().subtract(1, 'day'),
    ]
  },
  {
    label: '近7天',
    daterange: [
     dayjs().subtract(8, 'day').startOf('date'),
     dayjs().subtract(1, 'day'),
    ]
  },
  {
    label: '本月',
    daterange: [
     dayjs().startOf('month'),
     dayjs().subtract(1, 'day')
    ]
  },
  {
    label: '上月',
    daterange: [
     dayjs().subtract(1, 'month').startOf('month'),
     dayjs().subtract(1, 'month').endOf('month')
    ]
  }
]

export default {
  name: 'bw-dashboard',
  components: {
    DashboardHeader,
    Chart,
    KeywordList,
    AddKeyword
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTab: 'noLimit',
      currentPage: 1,
      pageSize: 5,
      promotes: [],
      addKeywordModalShow: false,
      daterange: daterangeList[1].daterange,
      activeDaterangeLabel: daterangeList[1].label,
      cpcRankingChartData: null,
      showChartData: null,
      daterangeList,
      CUSTOM_DATE_RANGE_LABEL,
      triPickerOptions: {
        disabledDate(time) {
          const timestamp = new Date(time).getTime()
          const yesterday = dayjs().subtract(1, 'day').valueOf()
          const lastYear = dayjs().subtract(1, 'year').valueOf()
          return timestamp > yesterday || timestamp < lastYear
        }
      }
    }
  },
  computed: {
    totalPage() {
      return this.promotes.length
    },
    promoteIds() {
      return this.promotes.map(({id}) => {
        return id
      }, [])
    }
  },
  async mounted() {
    const { promoteId, keyword } = this.$route.query
    if (promoteId) {
      this.activeTab = 'limit'
      const promote = await getPromoteById(promoteId)
      this.promotes = [promote]
      return
    } 
    this.getChartData()
  },
  methods: {
    handleDateChange(item) {
      this.daterange = item.daterange
      this.activeDaterangeLabel = item.label
    },
    async getChartData() {
      const daterange = this.daterange
      const startTime = dayjs(daterange[0]).startOf('day').unix()
      const endTime = dayjs(daterange[1]).startOf('day').unix()
      const options = {
        startTime,
        endTime,
        promoteList: this.activeTab === 'noLimit'? [] : this.promoteIds
      }

      let cpcRankingChartData = await getUserRanking(options)
      this.cpcRankingChartData = cpcRankingChartData

      let showChartData = await getUserShow(options)
      this.showChartData = showChartData
    },
    handleKeywordClose(newPromotes) {
      this.addKeywordModalShow = false
      this.promotes = clone(newPromotes)
      this.currentPage = 1
    },
    handleDeletePromote(promoteId) {
      let index = this.promotes.findIndex(promote => promote.id === promoteId)
      if (index > -1) {
        this.promotes.splice(index, 1)
      }
      const { promotes, currentPage, pageSize, totalPage} = this
      const offset = pageSize * (currentPage - 1)

      if (offset >= totalPage) {
        this.currentPage --
      }
    }
  },
  watch: {
    daterange: {
      deep: true,
      handler() {
        this.getChartData()
      }
    },
    promoteIds: {
      deep: true,
      handler() {
        this.getChartData()
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.bw-dashboard {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  & > .tip {
    margin-top: 20px;
    color: #999;
    font-size: 12px;
  }
  & > .keyword {
    margin-top: 30px;
    & > .title {
      font-size: 16px;
      color: #666;
      padding-bottom: 10px;
      border-bottom: 1px solid #e6e6e6;
      font-weight: bold;
    }
    & > .bw-keyword-tabs {
      margin-top: 10px;
    }
    & > .date-range {
      margin-top: 40px;
      & > .date-range-panel {
        margin-right: 7px;
        &.date-range-panel__active {
          background: #fff;
          border-color: #ff8273;
          color: #ff8273;
        }
      }
      & > .date-range-custom__active {
        border-color: #ff8273;
      }
    }
  }
}
</style>

<style lang="postcss">
.bw-keyword-tabs {
  font-size: 14px;
  & .el-tabs__header {
    margin-bottom: 20px;
  }
  & .el-tabs__nav-wrap {
    &:after {
      display: none;
    }
  }
  & .el-tabs__active-bar {
    height: 3px;
  }
}
</style>