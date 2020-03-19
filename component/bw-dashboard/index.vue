<template>
  <div class="bw-dashboard">
    <dashboard-header :today-ranking="todayRanking"></dashboard-header>
    <div class="tip">今日数据存在一定的延时，且最近1小时内的展现数据会存在波动</div>
    <section class="keyword">
      <div class="title">推广关键词</div>
      <el-tabs class="bw-keyword-tabs"
               v-model="activeTab"
               @tab-click="handleTabClick">
        <el-tab-pane label="不限关键词"
                     name="noLimit"></el-tab-pane>
        <el-tab-pane label="指定关键词"
                     name="limit">
          <el-button type="primary"
                     icon="el-icon-plus"
                     @click="addKeywordModalShow = true">添加指定关键词</el-button>
          <div>
            <template v-if="promotes.length">
              <keyword-list :totalPage="totalPage"
                            :can-deleted="true"
                            :all-areas="allAreas"
                            @delete="handleDeleteCampaign"
                            :data="promotes.slice(pageSize * (currentPage - 1), pageSize * currentPage)">
              </keyword-list>
              <el-pagination class="pagination"
                             layout="prev, pager, next"
                             :total="totalPage"
                             :page-size="pageSize"
                             :current-page="currentPage"
                             @current-change="handleCurrentChange">
              </el-pagination>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="date-range">
        <el-button class="date-range-panel"
                   v-for="item in daterangeList"
                   :key="item.label"
                   size="small"
                   @click="handleDateChange(item)">
          {{item.label}}
        </el-button>
        <el-date-picker v-model="daterange"
                        :clearable="false"
                        type="daterange"
                        size="small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <add-keyword :show="addKeywordModalShow"
                   v-if="addKeywordModalShow"
                   ref="addKeyword"
                   @close="handleKeywordClose"
                   :total-selected-count="totalPage"
                   :all-areas="allAreas"
                   :original-promotes="promotes"></add-keyword>
    </section>
    <chart :chart-data="chartData"></chart>
  </div>
</template>

<script>
import DashboardHeader from './header'
import Chart from './chart'
import KeywordList from './keyword-list'
import AddKeyword from './add-keyword'

import { getPromotes, getUserRanking } from 'api/biaowang'
import dayjs from 'dayjs'
import clone from 'clone'

const daterangeList = [
  {
   label: '今日',
   daterange: [
     dayjs(),
     dayjs()
   ]
  },
  {
    label: '昨天',
    daterange: [
     dayjs().subtract(1, 'day'),
     dayjs().subtract(1, 'day'),
   ]
  },
  {
    label: '近7日',
    daterange: [
     dayjs().subtract(7, 'day').startOf('date'),
     dayjs()
   ]
  },
  {
    label: '本月',
    daterange: [
     dayjs().startOf('month'),
     dayjs()
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
      daterangeList,
      daterange: daterangeList[0].daterange,
      chartData: {
        timeList: [],
        rankList: []
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
    if (promoteId && keyword) {
      this.activeTab = 'limit'
      const {items, total} = await getPromotes({
        page: 0,
        size: 5,
        word: keyword
      })
      this.promotes = items
      this.getCpcRankingData([promoteId])
      return 
    } 
    this.getCpcRankingData()
  },
  methods: {
    handleTabClick(tab) {
      const { name } = tab
      switch (name) {
        case 'noLimit':
          return this.getCpcRankingData([])
        case 'limit':
          return this.getCpcRankingData()
      }
    },
    handleDateChange(item) {
      this.daterange = item.daterange
    },
    async getCpcRankingData(promoteIds) {
      const daterange = this.daterange
      const startTime = dayjs(daterange[0]).startOf('day').unix()
      const endTime = dayjs(daterange[1]).endOf('day').unix()

      // let chartData = await getUserRanking({
      //   promoteList: promoteIds || this.promoteIds,
      //   startTime,
      //   endTime,
      // })      
      // mock
      let chartData = {
        timeList: ['2019-10-16','2019-10-17'],
        rankList: [1, 2],
      }
      this.chartData = chartData
    },
    handleKeywordClose(newPromotes) {
      this.addKeywordModalShow = false
      this.promotes = clone(newPromotes)
      this.currentPage = 1
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.currentPage = val
    },
    handleDeleteCampaign(promoteId) {
      let index = this.promotes.findIndex(promote => promote.id === promoteId)
      if (index > -1) {
        this.promotes.splice(index, 1)
      }
    }
  },
  watch: {
    daterange: {
      deep: true,
      handler() {
        this.getCpcRankingData()
      }
    },
    promoteIds: {
      deep: true,
      handler() {
        this.getCpcRankingData()
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