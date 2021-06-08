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
            <baxForm
              :promotions="promotionIds"
              :formData="queryParams"
              :allAreas="allAreas"
              @fetchData="editFormData"
              :isActionGroupExpand="isActionGroupExpand"
              :tab="activeName"
              :statusOpts="CAMPAIGN_STATUS_OPTS"
              :statusOrigin="CAMPAIGN_STATUSES"
            />
            <promotionTable @active="activeCampaigns" @pause="pausePromote" ref="promoteTable" @modifyBudget="modifyBudget" :list="promotionList" :loading="landingPageLoading" />
          </el-tab-pane>
          <el-tab-pane label="单元" name="group" >
            <baxForm
              :promotions="promotionIds"
              :formData="queryParams"
              :allAreas="allAreas"
              @fetchData="editFormData"
              :isActionGroupExpand="isActionGroupExpand"
              :tab="activeName"
              :statusOpts="GROUP_STATUSES_OPTS"
              :statusOrigin="GROUP_STATUSES"
            />
            <groupTable @update-group-data="fetchGroupList" :groupData="groupList" :loading="landingPageLoading"/>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-pagination layout="total, prev, pager, next"  @current-change="handlePageChange" :current-page="queryParams.offset/ONE_PAGE_NUM+1" :page-size="ONE_PAGE_NUM" :total="totalPage" />
    </main>
  </div>
</template>

<script>
import { promotionTable, topTips, baxForm } from './components'
import groupTable from '../qwt-update-promotion/group-table'
import pick from 'lodash.pick'
import clone from 'clone'
import { CAMPAIGN_STATUS_OPTS, CAMPAIGN_STATUSES, CAMPAIGN_OPTIMIZATION_OPTS, GROUP_STATUSES_OPTS, GROUP_STATUSES } from './constant'
import { getCampaignList, getGroupList, getCampaignIds } from 'api/fengming-campaign'
import { updateCampaignDailyBudget, pauseCampaigns, pauseGroup, activeCampaigns, activeGroup } from 'api/fengming'
import { semPlatformOpts as SOURCES_OPTS } from 'constant/fengming'
const CNT_REJECTED_CODE = '-53'
const ONE_PAGE_NUM = 10
export default {
  name: 'qwt-promotion-list',
  components: { promotionTable, groupTable, topTips, baxForm },
  props: ['allAreas', 'salesInfo', 'userInfo'],
  data () {
    return {
      ONE_PAGE_NUM,
      SOURCES_OPTS,
      CAMPAIGN_STATUS_OPTS,
      CAMPAIGN_OPTIMIZATION_OPTS,
      CAMPAIGN_STATUSES,
      GROUP_STATUSES_OPTS,
      GROUP_STATUSES,
      groupList: [],
      promotionList: [],
      promotionIds: [],
      campaignId: 0,
      queryParams: {
        group_name: '',
        areas: [],
        statuses: CAMPAIGN_STATUS_OPTS.map(c => c.value),
        source: [],
        offset: 0,
        limit: ONE_PAGE_NUM,
        userId: '',
        campaign_id: 0
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
  async mounted () {
    const { query: { id, statuses } } = this.$route
    if (statuses) {
      this.isActionGroupExpand = true
    }
    // 从首页未审核处点击进来的
    if (statuses === CNT_REJECTED_CODE) {
      this.queryParams.statuses = [CNT_REJECTED_CODE]
    } else if (statuses) {
      this.queryParams.statuses.push(statuses)
    }
    if (this.salesInfo.userId) {
      this.queryParams.userId = this.salesInfo.userId
    }
    const result = await getCampaignIds()
    this.promotionIds = result
    if (id) {
      // 从某个计划点击进来
      this.queryParams.statuses = GROUP_STATUSES_OPTS.map(c => c.value)
      this.activeName = 'group'
      this.queryParams.campaign_id = id
      this.fetchGroupList()
    } else {
      if (this.activeName === 'plan') {
        this.queryParams.statuses = CAMPAIGN_STATUS_OPTS.map(c => c.value)
        this.fetchlandingPageList()
      } else {
        this.queryParams.statuses = GROUP_STATUSES_OPTS.map(c => c.value)
        this.fetchGroupList()
      }
    }
  },
  methods: {
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
      if (!id && tab.index === '0') {
        this.queryParams.statuses = CAMPAIGN_STATUS_OPTS.map(c => c.value)
        this.fetchlandingPageList()
      }
      if (tab.index === '1') {
        this.queryParams.statuses = GROUP_STATUSES_OPTS.map(c => c.value)
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
    async fetchlandingPageList (params = clone(this.queryParams)) {
      this.landingPageLoading = true
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
    async fetchGroupList (params = clone(this.queryParams)) {
      this.landingPageLoading = true
      try {
        const result = await getGroupList({ ...params })
        const { total, data } = result
        this.totalPage = total
        this.groupList = data
      } catch (error) {
        console.error(error)
      } finally {
        this.landingPageLoading = false
      }
    },
    editFormData (params) {
      const { value, key } = params
      this.queryParams[key] = value
      this.queryParams.offset = 0
      if (this.activeName === 'plan') {
        this.fetchlandingPageList()
      } else {
        this.fetchGroupList()
      }
    },
    async pausePromote (ids) {
      await pauseCampaigns([ids])
      this.$message.success('已暂停投放')
      this.fetchlandingPageList()
    },
    async activeCampaigns (ids) {
      await activeCampaigns([ids])
      this.$message.success('已开启投放')
      this.fetchlandingPageList()
    },
    async pauseGroup (ids) {
      await pauseGroup([ids])
      this.$message.success('已暂停投放')
      this.fetchGroupList()
    },
    async activeGroup (ids) {
      await activeGroup([ids])
      this.$message.success('已开启投放')
      this.fetchGroupList()
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
