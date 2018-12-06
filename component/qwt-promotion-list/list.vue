<template>
  <div class="list-container">
    <div class="list-header">推广落地页</div>
    <ul class="list-content" v-if="!landingPageLoading">
      <li class="list-item" v-for="landingPage in landingPageList" :key="landingPage.id">
        <div class="top-col">
          <i
            class="icon"
            :class="isExistInExpands(landingPage.id) ? 'el-icon-minus' : 'el-icon-plus'"
            @click="toggleTableExpand(landingPage.id, landingPage.campaignIds)"
          />
          <span class="title">{{landingPage.name}}</span>
          <strong class="type" v-if="landingPage.type === LANGPAGE_TYPES.AD">帖</strong>
          <strong class="type" v-if="landingPage.type === LANGPAGE_TYPES.SITE">官</strong>
          <strong class="hint" v-if="isRenderSources(landingPage.sources)">渠</strong>
        </div>
        <table class="table-container" v-if="isExistInExpands(landingPage.id)" border="none">
          <thead>
            <tr class="tr">
              <th class="col1">计划id</th>
              <th class="col2">状态</th>
              <th class="col3">渠道</th>
              <th class="col4"><top-tip label="今日预算" tip="该计划今日已消耗的上限"/></th>
              <th class="col5"><top-tip label="今日消耗" tip="该计划今日已消耗的金额"/></th>
              <th class="col6">关键词平均排名</th>
              <th class="col7">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr class="tr" v-for="item in campaignMap[landingPage.id]" :key="item.id">
              <td class="col1">
                <span class="t">{{item.id}}</span>
                <strong class="hint" v-if="item.kwMark">关</strong>
                <strong class="hint" v-if="item.priceMark">价</strong>
                <strong class="hint" v-if="item.ctrMark">创</strong>
                <strong class="hint" v-if="item.defaultMark">设</strong>
              </td>
              <td class="col2">
                <span class="dot" :style="{backgroundColor: getColor(item.statusText)}" />
                <span>{{item.statusText}}</span>
                <el-tooltip effect="dark" placement="top"
                  :content="item.detailStatusText">
                  <i class="el-icon-info" />
                </el-tooltip>
              </td>
              <td class="col3">{{item.source | genSourceText}}</td>
              <td class="col4" v-if="budgetMap[item.id] === undefined">
                <span class="price">{{item.dailyBudget | fmtPrice}}元</span>
                <a href="javascript:;" @click="toggleBudgetInputDisplay(item.id, item.dailyBudget)" class="btn">修改</a>
              </td>
              <td class="col4" v-else>
                <el-input size="small" :value="fmtLandingPageBudget(item.id)" @input="handleBudgetInput(item.id, $event)"/>
                <el-button size="small" type="primary" @click="modifyBudget(item.id, landingPage.id, landingPage.campaignIds)">确定</el-button>
              </td>
              <td class="col5">
                {{item.todayCost === 0 ? '-' : fmtPrice(item.todayCost)}}
              </td>
              <!-- 已下线的status -->
              <td class="col6">{{item.status === -1 ? '-' : item.avgCpcRanking}}</td>
              <td class="col7">
                <a
                  class="btn"
                  href="javascript:;"
                  @click="togglePromotionStatus(item, landingPage.id, landingPage.campaignIds, item.status === CAMPAIGN_STATUS_OFFLINE || item.auditStatus === KEYWORD_CHIBI_REJECT)"
                  :disabled="item.status === CAMPAIGN_STATUS_OFFLINE || item.auditStatus === KEYWORD_CHIBI_REJECT"
                >
                  {{!!item.pause ? '投放' : '暂停'}}
                </a>
                <a href="javascript:;" class="btn" @click="$router.push(`/main/qwt/promotions/${item.id}/update`)">优化</a>
                <a href="javascript:;" class="btn" @click="$router.push(`/main/qwt/promotion/create?cloneId=${item.id}`)">复制</a>
              </td>
            </tr>
          </tbody>
          <tr class="table-loading-mask" v-if="!campaignMap[landingPage.id]">
             <td colspan="7">
                <i class="el-icon-loading icon" />正在努力加载中
             </td>
          </tr>
        </table>
      </li>
    </ul>
    <div class="list-placeholder" v-show="!landingPageList.length && !landingPageLoading"><i class="el-icon-info"/>暂无推广落地页</div>
    <transition name="el-fade-in" style="width: 100%;display: block;">
      <div class="loading-mask" v-show="landingPageLoading" key="loading">
        <div>
          <i class="el-icon-loading icon" />
          <br />
          正在努力加载中
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import TopTip from './topTip.js'
import {
  pauseCampaigns,
  activeCampaigns,
  updateCampaignDailyBudget
} from 'api/fengming'
import {
  semPlatformCn,
  KEYWORD_CHIBI_REJECT,
  CAMPAIGN_STATUS_OFFLINE
} from 'constant/fengming'

const LANGPAGE_TYPES = {
  AD: 0,
  SITE: 1
}
const RENDER_OPTIMIZATION_METHODS = {
  isRenderSources(num) {
    return num < 2
  },
  isRenderKw() {
  }
}

export default {
  name: 'promotion-list',
  data() {
    return {
      LANGPAGE_TYPES,
      KEYWORD_CHIBI_REJECT,
      CAMPAIGN_STATUS_OFFLINE,
      
      budgetMap: {},
      expands: []
    }
  },
  props: {
    landingPageList: {
      type: Array,
      required: true
    },
    landingPageLoading: {
      type: Boolean,
      required: true
    },
    campaignMap: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...RENDER_OPTIMIZATION_METHODS,
    reset() {
      // 清除expands
      this.expands = []
    },
    toggleTableExpand(id, campaignIds) {
      const index = this.expands.indexOf(id)
      if (index === -1) {
        this.$emit('expand-change', id, campaignIds)
        this.expands.push(id)
      } else {
        // remove expands 中的 id
        this.expands.splice(index, 1)
      }
    },
    toggleBudgetInputDisplay(id, dailyBudget, isDeleted) {
      const budgetMap = this.budgetMap
      if (budgetMap[id] === undefined) {
        this.budgetMap = {
          ...budgetMap,
          [id]: dailyBudget
        }
      }
    },
    isExistInExpands(id) {
      return this.expands.includes(id)
    },
    getColor(statusText) {
      const bgColroObj = {
        '推广中': '#52c41a',
        '已下线': 'rgba(0, 0, 0, 0.25)'
      }
      return bgColroObj[statusText] ? bgColroObj[statusText] : '#f5222d'
    },
    async togglePromotionStatus(campaign, landingPageId, campaignIds ,disabled) {
      if (disabled) return
      const typeText = campaign.pause ? '开始' : '暂停'
      await this.$confirm(`确定${typeText}投放？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      if (campaign.pause === 1) {
       await activeCampaigns([campaign.id])
      } else {
        await pauseCampaigns([campaign.id])
      }
      this.$emit('reload-promotion', landingPageId, campaignIds, true)
    },
    fmtLandingPageBudget(id) {
      return this.budgetMap[id] / 100
    },
    async modifyBudget(id, landingPageId, campaignIds) {
      const budget = this.budgetMap[id]
      if (!(budget > 0 && budget < 10000000)) {
        return this.$message.error('请设置合理的预算')
      }
      const opts = {
        campaignIds: [id],
        dailyBudget: budget
      }
      await updateCampaignDailyBudget(opts)
      this.$emit('reload-promotion', landingPageId, campaignIds, true)
      this.budgetMap = {
        ...this.budgetMap,
        [id]: undefined
      }
      this.$message.success('今日预算修改成功')
    },
    handleBudgetInput(id, value) {
      this.budgetMap = {
        ...this.budgetMap,
        [id]: value.replace(/[^0-9]/g, '') * 100
      }
    }
  },
  watch: {
    landingPageList() {
      // 当list的数据变化的时候，进行reset操作
      this.reset()
    }
  },
  filters: {
    genSourceText(source) {
      return semPlatformCn[source]
    },
    fmtPrice(price) {
      return (price / 100).toFixed(2)
    }
  },
  components: {TopTip}
}
</script>

<style lang="postcss" scoped>
  .list-container {
    position: relative;
    min-height: 208px;
    & .list-content {
      border-bottom: 1px solid #e9e9e9;
    }
    & .list-header {
      text-indent: 18px;
      font-weight: 600;
      line-height: 38px;
      background-color: #FFEBC8;
    }
  }
  .list-item {
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
    cursor: default;
    line-height: 38px;
    user-select: none;
    &:nth-of-type(2n) {
      background-color: #fafafa;
    }
    & .top-col {
      display: flex;
      align-items: center;
      &:hover {
        background-color: #f0f0f0;
      }
      & .icon {
        color: #63B2E4;
        font-size: 16px;
        cursor: pointer;
        display: inline-block;
        width: 42px;
        line-height: 38px;
        text-indent: 14px;
      }
      & .title {
        /* width: 28%; */
        width: 33%;
        margin-right: 26px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      & > strong {
        margin-right: 12px;
      }
    }
    & .type {
      color: #B08F31;
      text-shadow: 0px 1px 1px #f8d36b;
    }
    & .hint {
      color: #B66969;
      text-shadow: 0px 1px 1px #f5b1b1;
    }
  }
  .loading-mask {
    position: absolute;
    top: 48px;
    bottom: 30px;
    left: 30px;
    right: 30px;
    background-color: rgba(0, 0, 0, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
    font-size: 15px;
    & .icon {
      font-size: 18px;
    }
  }
  .list-placeholder {
    height: 100%;
    line-height: 160px;
    border: 1px solid #f0f0f0;
    text-align: center;
    color: #888;
    & .el-icon-info {
      margin-right: 6px;
    }
  }
  /* ------ table ------ */
  .table-container { 
    position: relative;
    width: 100%;
    background-color: #fff;
    & .tr {
      &:not(:first-child) {
        &:hover {
          background-color: #f6f6f6;
        }
      }
      &:not(:last-child) {
        border-bottom: 1px solid #f4f4f4;
      }
    }
    /* width: 985 */
    & .col1 {
      width: 28%;
      padding-left: 66px;
      & .t {
        margin-right: 20px;
        width: 66px;
      }
    }
    & .col2 {
      width: 12%;
      & .el-icon-info {
        font-size: 12px;
        color: rgb(151, 168, 190);
        cursor: help;
      }
    }
    & .col3 {
      width: 48px;
      text-align: center;
    }
    & .col4 {
      width: 18%;
      padding-left: 36px;
      white-space: nowrap;
      & >>> .el-input__inner {
        padding: 0 4px;
      }
      & >>> .el-input--small {
        width: 60px;
      }
      & >>> .el-button--small {
        padding: 9px 10px;
      }
      & .btn {
        color: #35A5E4;
        margin-left: 5px;
      }
    }
    & .col5 {
      width: 73px;
      text-align: center;
    }
    & .col6 {
      text-align: center;
      text-indent: 18px;
      width: 120px;
    }
    & .col7 {
      text-align: center;
      & .btn {
        color: #35A5E4;
        margin-right: 8px;
      }
    }
    & .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.25);      
    }
    & > thead {
      & .col2 {
        text-indent: 10px;
      }
      & .col6 {
      }
    }
    & .btn[disabled] {
      color: #ccc;
      cursor: not-allowed;
    }
  }
  .table-loading-mask {
    width: 100%;
    text-align: center;
    line-height: 100px;
    border: 1px solid #f0f0f0;
    color: #888;
    & .el-icon-info {
      margin-right: 6px;
    }
  }

  table, th, td {
    border-collapse: collapse;
  }
</style>
