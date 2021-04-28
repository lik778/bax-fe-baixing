<template>
  <div class="qwt-promotion-list">
    <main class="container">
      <h2 class="header">我的站外推广计划</h2>
      <p class="info" v-if="summary && summary.budget">您的推广资金可用余额为<span class="red">{{f2y(currentBalance)}}元</span>，预计可消耗<span class="red">{{days}}天</span>
        <label v-if="userInfo.allowFmRecharge" >，为了保证您的广告正常投放，请及时<router-link :to="{name: 'qwt-charge'}">充值</router-link></label>
      <div class="action-group">
        <div class="top">
          <el-button class="button" icon="el-icon-plus" type="primary" @click="() => $router.push({name: 'qwt-create-promotion'})">新建推广计划</el-button>
          <a href="javascript:;" class="expand-button" @click="isActionGroupExpand = !isActionGroupExpand">
            更多筛选
            <i class="icon" :class="isActionGroupExpand ? 'el-icon-arrow-up' : 'el-icon-arrow-down' " />
          </a>
        </div>
        <div v-show="isActionGroupExpand">
          <div class="column">
            <span class="title">计划ID</span>
            <bax-input class="input" placeholder="请输入ID查询" suffix-icon="el-icon-search" v-model="queryParams.campaignId"/>
          </div>
          <div class="column">
            <h6 class="title">投放状态</h6>
            <div class="checkbox-group">
              <el-checkbox-group v-model="queryParams.statuses">
                <el-checkbox
                  class="checkbox"
                  v-for="c in CAMPAIGN_STATUS_OPTS"
                  :key="c.value"
                  :label="c.value"
                >
                  {{c.label}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="column source">
            <h6 class="title">渠道来源</h6>
            <div class="checkbox-group">
              <el-checkbox-group v-model="queryParams.source">
                <el-checkbox
                  class="checkbox"
                  v-for="c in SOURCES_OPTS"
                  :key="c.value"
                  :label="c.value"
                >
                  {{c.label}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="column area">
            <span class="title">投放区域</span>
            <el-tag
              v-for="a in queryParams.areas"
              @close="removeSelectedArea(a)"
              :key="a"
              type="danger"
              :closable="true"
              class="tag"
            >
              {{a | transformCityName(allAreas)}}
            </el-tag>
            <i class="el-icon-plus icon" @click="areaDialogVisible = true"/>
          </div>
        </div>
        <div class="column">
          <h6 class="title hightlight">投放优化</h6>
          <div class="checkbox-group">
            <el-checkbox-group v-model="queryParams.statuses">
              <el-checkbox
                class="checkbox"
                v-for="c in CAMPAIGN_OPTIMIZATION_OPTS"
                :key="c.value"
                :label="c.value"
              >
                {{c.label}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <list
        class="list"
        v-if="landingPageList"
        :landingPageList="landingPageList"
        :landingPageLoading="landingPageLoading"
        :campaignMap="campaignMap"
        :userInfo="userInfo"
        @expand-change="fetchPromotionList"
        @reload-promotion="fetchPromotionList"
      />
      <el-pagination
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        :page-size="ONE_PAGE_NUM"
        :total="totalPage"
      />
    </main>
    <area-selector
      type="qwt"
      :areas="queryParams.areas"
      :all-areas="allAreas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="handleSelectArea"
      @cancel="areaDialogVisible = false"
    />
  </div>
</template>

<script>
import { getCnName, f2y } from 'util'

import List from './list'
import { toCamelcase } from 'object-keys-mapping'
import AreaSelector from 'com/common/area-selector'
import BaxInput from 'com/common/input'

import {
  getCampaignLanding,
  getCurrentCampaigns
} from 'api/fengming-campaign'

import {
  getCurrentBalance,
  getHomepageSummary
} from 'api/fengming'

import {
  semPlatformOpts as SOURCES_OPTS,
  campaignOptimization
} from 'constant/fengming'

const CNT_REJECTED_CODE = '-53'

const CAMPAIGN_STATUS_OPTS = Object.freeze(
  [
    { label: '推广中/审核中', value: '100' },
    { label: '计划预算不足', value: '5' },
    { label: '账户余额不足', value: '-51' },
    { label: '已暂停', value: '-10,-50' },
    { label: '已下线', value: '-1' },
    { label: '审核驳回', value: '-53' }
  ]
)

const CAMPAIGN_OPTIMIZATION_OPTS = Object.freeze(
  [
    { label: '创意', value: campaignOptimization.STATUS_OPT_CREATIVE },
    { label: '关键词', value: campaignOptimization.STATUS_OPT_KEYWORD },
    { label: '渠道', value: campaignOptimization.STATUS_OPT_SOURCE },
    { label: '出价', value: campaignOptimization.STATUS_OPT_PRICE },
    { label: '投放设置', value: campaignOptimization.STATUS_OPT_SETTING }
  ]
)

const ONE_PAGE_NUM = 10

const formatlandingPageList = res => {
  return Object.entries(res).reduce((list, [k, v]) => {
    return list.concat({
      ...v,
      id: k
    })
  }, [])
}

export default {
  name: 'qwt-promotion-list',
  created () {
    const { statuses } = this.$route.query
    if (statuses) {
      this.isActionGroupExpand = true
      // 从首页未审核处点击进来的
      if (statuses === CNT_REJECTED_CODE) {
        this.queryParams.statuses = [CNT_REJECTED_CODE]
      } else {
        this.queryParams.statuses.push(statuses)
      }
    }
    if (this.salesInfo.userId) {
      this.queryParams.userId = this.salesInfo.userId
    }
    this.fetchSummary()
    this.fetchlandingPageList()
  },
  data () {
    return {
      ONE_PAGE_NUM,
      SOURCES_OPTS,
      CAMPAIGN_STATUS_OPTS,
      CAMPAIGN_OPTIMIZATION_OPTS,

      queryParams: {
        campaignId: '',
        areas: [],
        statuses: CAMPAIGN_STATUS_OPTS.map(s => s.value),
        source: [],
        offset: 0,
        limit: ONE_PAGE_NUM,
        userId: ''
      },

      landingPageLoading: false,
      landingPageList: null,
      currentBalance: null,
      campaignMap: {},
      summary: null,
      totalPage: 0,

      areaDialogVisible: false,
      isActionGroupExpand: true
    }
  },
  props: ['allAreas', 'salesInfo', 'userInfo'],
  components: { AreaSelector, List, BaxInput },
  methods: {
    f2y,
    handlePageChange (page) {
      this.queryParams.offset = (page - 1) * ONE_PAGE_NUM
      this.fetchlandingPageList()
    },
    handleSelectArea (areas) {
      this.queryParams.areas = areas
      this.areaDialogVisible = false
    },
    removeSelectedArea (area) {
      this.queryParams.areas = this.queryParams.areas.filter(a => a !== area)
    },
    async fetchlandingPageList () {
      this.landingPageLoading = true
      // 重置campaignMap
      this.campaignMap = {}
      try {
        const result = await getCampaignLanding(this.queryParams)
        const { total, ...pageList } = result
        this.totalPage = total
        // toCamelcase 插件有个坑（当object的key值为url格式时，转换对象的key有问题）
        this.landingPageList = Object.freeze(toCamelcase(formatlandingPageList(pageList)))
      } catch (err) {
        console.error(err)
      } finally {
        this.landingPageLoading = false
      }
    },
    async fetchPromotionList (id, campaignIds, isForceUpdate) {
      // 判断是否已经存在
      const campaignMap = this.campaignMap
      const campaignMapKeys = Object.keys(campaignMap)
      if (isForceUpdate || !campaignMapKeys.includes(id)) {
        const campaigns = await getCurrentCampaigns({ ...this.queryParams, campaignIds })
        this.campaignMap = Object.freeze({
          ...campaignMap,
          [id]: campaigns
        })
      }
    },
    async fetchSummary () {
      const [currentBalance, summary] = await Promise.all([getCurrentBalance(), getHomepageSummary()])
      this.summary = summary
      this.currentBalance = currentBalance
    }
  },
  filters: {
    transformCityName (name, allAreas) {
      return getCnName(name, allAreas)
    }
  },
  computed: {
    days () {
      return Math.ceil(this.currentBalance / this.summary.budget)
    }
  },
  watch: {
    queryParams: {
      deep: true,
      handler (val) {
        if (!val.campaignId || /^[0-9]+$/.test(val.campaignId)) {
          this.fetchlandingPageList()
        } else {
          this.$message.error('您要查询的计划ID格式不正确')
        }
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
    box-shadow: 0 2px 9px 0 rgba(83, 95, 127, .10);
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
        color: #35A5E4;
      }
      & .icon {
        margin-left: 10px;
        color: #666;
      }
    }
    & .column {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      text-align: left;
      margin-bottom: 25px;
      &.source {
        margin-bottom: 17px;
      }
      &.area .title{
        margin: 15px 0 5px;
      }
      & .title {
        font-weight: 600;
        text-align: left;
        width: 11%;
        height: 100%;
        max-width: 165px;
        flex: none;
        &.hightlight {
          color: #B66969;
        }
      }
      & .input {
        width: 27%;
        max-width: 380px;
        height: 38px;
      }
      & .checkbox-group {
        flex: 1;
      }
      & .icon {
        height: 100%;
        width: 50px;
        font-size: 20px;
        color: #333;
        cursor: pointer;
        margin-top: 10px;
      }
      & .tag {
        margin-right: 5px;
        margin-top: 8px;
        font-size: 13px;
        &:last-of-type{
          margin-right: 12px;
        }
      }
    }
  }
  .list {
    padding: 10px 30px 30px;
  }

.info {
  font-size: 12px;
  margin-top: 15px;
  margin-left: 30px;
  & > a {
    margin-left: 4px;
    color: #35A5E4;
  }
  & > .red {
    color: red;
    margin: 0 5px;
  }
}
</style>
