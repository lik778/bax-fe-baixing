<template>
  <div class="qwt-promotion-list">
    <topTips :userInfo="userInfo" />
    <main class="container">
      <h2 class="header">我的站外推广计划</h2>
      <div class="action-group">
        <div class="top">
          <el-button class="button" icon="el-icon-plus" type="primary" @click="() => $router.push({ name: 'qwt-create-promotion' })">新建推广计划</el-button>
          <a href="javascript:;" class="expand-button" @click="isActionGroupExpand = !isActionGroupExpand" >
            更多筛选
            <i class="icon" :class=" isActionGroupExpand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
          </a>
        </div>
        <el-tabs v-model="activeName" @tab-click="toggleTab" type="card" >
          <el-tab-pane label="计划" name="plan" >
            <baxForm @fetchData="(args)=> fetchlandingPageList({ ...args })" :formData="queryParams" :allAreas="allAreas" :fetchData="fetchlandingPageList" :isActionGroupExpand="isActionGroupExpand" :tab="activeName"/>
            <promotionTable ref="promoteTable" :modifyBudget="modifyBudget" :list="promotionList" :loading="landingPageLoading" />
          </el-tab-pane>
          <el-tab-pane label="单元" name="group" >
            <baxForm :formData="queryParams" :allAreas="allAreas" :fetchData="fetchGroupList" :isActionGroupExpand="isActionGroupExpand" :tab="activeName" />
            <groupTable :list="groupList" :loading="landingPageLoading"/>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-pagination layout="total, prev, pager, next"  @current-change="handlePageChange" :page-size="ONE_PAGE_NUM" :total="totalPage" />
    </main>
  </div>
</template>

<script>
import { groupTable, promotionTable, topTips, baxForm } from './components'
import pick from 'lodash.pick'
import {
  CAMPAIGN_STATUS_OPTS,
  options,
  CAMPAIGN_OPTIMIZATION_OPTS
} from './constant'
import { getCampaignList, getGroupList } from 'api/fengming-campaign'
import {
  updateCampaignDailyBudget
} from 'api/fengming'
import {
  semPlatformOpts as SOURCES_OPTS
} from 'constant/fengming'
const CNT_REJECTED_CODE = '-53'
const ONE_PAGE_NUM = 10

export default {
  name: 'qwt-promotion-list',
  mounted () {
    console.log('==', this.queryParams)
    const { query: { id, statuses } } = this.$route
    if (statuses) {
      this.isActionGroupExpand = true
    }
    if (id) {
      // 从某个计划点击进来
      this.activeName = 'group'
      this.fetchGroupList()
    } else {
      if (this.activeName === 'plan') {
        this.fetchlandingPageList()
      } else {
        this.fetchGroupList()
      }
    }
  },
  data () {
    return {
      ONE_PAGE_NUM,
      SOURCES_OPTS,
      CAMPAIGN_STATUS_OPTS,
      CAMPAIGN_OPTIMIZATION_OPTS,
      options,
      groupList: [],
      promotionList: [],
      queryParams: {
        groupName: '',
        areas: [],
        statuses: CAMPAIGN_STATUS_OPTS.map(s => s.value),
        source: [],
        offset: 0,
        limit: ONE_PAGE_NUM,
        userId: '',
        value: 1
      },
      landingPageLoading: false,
      currentBalance: null,
      summary: null,
      totalPage: 0,
      activeName: 'plan',
      areaDialogVisible: false,
      isActionGroupExpand: true
    }
  },
  props: ['allAreas', 'salesInfo', 'userInfo'],
  components: { promotionTable, groupTable, topTips, baxForm },
  methods: {
    getqueryParams (formData) {
      this.queryParams = formData
    },
    fetchData (args = {}) {
      // const res = Object.assign({}, this.form1, this.form2, args)
    },
    handlePageChange (page) {
      this.queryParams.offset = (page - 1) * ONE_PAGE_NUM
      if (this.activeName === 'plan') {
        this.fetchlandingPageList()
      } else {
        this.fetchGroupList()
      }
    },
    toggleTab (tab) {
      this.queryParams.offset = 0
      const query = pick(this.$route.query, ['userId', 'salesId'])
      const { query: { id } } = this.$route
      if (id && tab.index === '0') {
        this.$router.push({ name: 'qwt-promotion-list', query })
      }
      if (tab.index === '1') {
        this.fetchGroupList()
      }
    },
    async modifyBudget (dailyBudget) {
      const { id, value } = dailyBudget
      if (!(value > 0 && value < 10000000)) {
        return this.$message.error('请设置合理的预算')
      }
      const opts = {
        campaignIds: [id],
        dailyBudget: parseFloat(value) * 100
      }
      await updateCampaignDailyBudget(opts)
      this.fetchlandingPageList()
      this.$refs.promoteTable.updateBudgetEditeStatus()
      this.$message.success('今日预算修改成功')
    },
    async fetchlandingPageList (params = this.queryParams) {
      if (this.salesInfo.userId) {
        params.userId = this.salesInfo.userId
      }
      const { query: { statuses } } = this.$route
      // 从首页未审核处点击进来的
      if (statuses === CNT_REJECTED_CODE) {
        params.statuses = [CNT_REJECTED_CODE]
      } else if (statuses) {
        params.statuses.push(statuses)
      }
      params.statuses = params.statuses.join(',').split(',').map(n => parseInt(n))
      this.landingPageLoading = true
      console.log('params', params)
      try {
        const result = await getCampaignList({ ...params })
        const { total, data } = result
        this.totalPage = total
        this.promotionList = data
      } catch (err) {
        console.error(err)
      } finally {
        this.landingPageLoading = false
      }
    },
    async fetchGroupList (params = this.queryParams) {
      if (this.salesInfo.userId) {
        params.userId = this.salesInfo.userId
      }
      const { query: { id } } = this.$route
      this.landingPageLoading = true
      if (id) {
        params = { ...{ campaign_id: id }, ...params, ...this.queryParams }
      }
      try {
        const result = await getGroupList(params)
        const { total, data } = result
        this.totalPage = total
        this.groupList = data
      } catch (error) {
        console.error(error)
      } finally {
        this.landingPageLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);
  color: #666;
  font-size: 14px;
  & /deep/ .el-pagination {
    display: flex;
    justify-content: center;
  }
}
.header {
  font-size: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e6e6e6;
  font-weight: 600;
}
.action-group {
  padding: 40px 30px 0;
  & .top {
    display: flex;
    align-items: center;
    padding-bottom: 34px;
    & .button {
      padding: 8px 21px;
      margin-right: auto;
    }
    & .expand-button {
      color: #35a5e4;
    }
    & .icon {
      margin-left: 10px;
      color: #666;
    }
  }
}
</style>
