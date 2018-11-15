
<template>
  <div class="qwt-promotion-list">
    <header class="qwt-promotion-header">
      <section class="actions">
        <el-dropdown @command="updateCampaignStatus" v-if="!readonly" class="action">
          <el-button type="primary">
            批量开关
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="active">
              计划开启
            </el-dropdown-item>
            <el-dropdown-item command="pause">
              计划关闭
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button v-if="canCreate"
          type="primary" icon="el-icon-plus"
          @click="gotoCreatePromotion" class="action">
          新建推广计划
        </el-button>
        <el-button type="primary" v-else class="action">
          <router-link :to="{name: 'qwt-dashboard', query: {userId}}" tag="span">
            查看数据报表
          </router-link>
        </el-button>

        <el-button type="text" @click="switchShowMoreFilters" class="more-filter">
          更多筛选<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </section>
      <div v-show="showMoreFilters" class="filters">
        <span class="filter-item">
          <label>计划ID</label>
          <bax-input placeholder="请输入ID查询" icon="el-icon-search"
            @change="v => queryCampaigns({id: v})" class="action search">
          </bax-input>
        </span>

        <span class="filter-item">
          <label>投放状态</label>
          <el-checkbox-group :value="query.statuses" @input="v => queryCampaigns({statuses: v})">
            <el-checkbox v-for="(opt, index) in campaignStatusOpts" :key="index" :label="opt.value">{{opt.label}}</el-checkbox>
          </el-checkbox-group>
        </span>

        <span class="filter-item">
          <label>渠道来源</label>
          <el-checkbox-group :value="query.source" @input="v => queryCampaigns({source: v})">
            <el-checkbox v-for="(opt, index) in semPlatformOpts" :key="index" :label="opt.value">{{opt.label}}</el-checkbox>
          </el-checkbox-group>
        </span>

        <span class="filter-item">
          <label>投放区域</label>
          <div>
            <el-tag type="success" closable class="area-tag"
              v-for="area in query.areas" :key="area"
              @close="removeArea(area)">
              {{ formatterArea(area) }}
            </el-tag>
            <i class="el-icon-plus" @click="areaDialogVisible = true"></i>
          </div>
        </span>
      </div>
    </header>

    <main>
    <el-table ref="table" :data="campaigns"
      @selection-change="onSelectionChange">
      <el-table-column v-if="!readonly" type="selection" width="40"
        :selectable="checkSelectable">
      </el-table-column>
      <el-table-column prop="open" label="开关" width="80"
        :render-header="renderColumnHeaderWithTip('关闭计划后，投放将暂停，暂停3天后将下线。')">
        <template slot-scope="s">
          <el-switch :disabled="s.row.status === CAMPAIGN_STATUS_OFFLINE || readonly"
            :active-text="readonly ? 'ON' : ''"
            :inactive-text="readonly ? 'OFF' : ''"
            :value="!s.row.pause"
            @change="switchCampaignPause(s.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column label="计划状态" width="140">
        <template slot-scope="s">
          <i class="dot" :style="{background: getColor(s.row.statusText)}" />
          <label>{{ s.row.statusText }}</label>
          <el-tooltip effect="dark" placement="top"
            :content="s.row.detailStatusText">
            <i class="el-icon-info" />
          </el-tooltip>
          <router-link :to="{name: 'qwt-charge'}" v-show="s.row.statusText === '账户余额不足'">充值</router-link>
        </template>
      </el-table-column>
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtSource(r.source)">
      </el-table-column>
      <el-table-column label="今日预算" width="180"
        :render-header="renderColumnHeaderWithTip('该计划今日消耗的上限')">
        <template slot-scope="s">
          <editable-label type="price"
            track-action="campaign list: change daily budget inline"
            :value="s.row.dailyBudget"
            @change="v => inlineUpdateBudget(s.row.id, v)" />
        </template>
      </el-table-column>
      <el-table-column label="今日消耗" width="100"
        :render-header="renderColumnHeaderWithTip('该计划今日已消耗金额')"
        :formatter="r => r.todayCost === 0 ? '-' : fmtPrice(r.todayCost)">
      </el-table-column>
      <el-table-column label="移动端出价比例(0.1-9.9)" width="200"
        :render-header="renderColumnHeaderWithTip(mobileRatioTip)">
        <template slot-scope="s">
          <div style="padding-left: 20px;">
            <p v-if="s.row.source === SEM_PLATFORM_SHENMA">
              -
            </p>
            <editable-label
              v-else
              track-action="campaign list: change mobile ratio inline"
              :value="s.row.mobilePriceRatio"
              @change="v => inlineUpdateRatio(s.row.id, v)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="优化投放" fixed="right">
        <template slot-scope="s">
          <router-link
            :to="{ name: 'qwt-update-promotion', params: { id: s.row.id } }"
            @click.native="onClickCampaignDetail">
            详情
          </router-link>
          <router-link
            :to="{ name: 'qwt-dashboard', query: { campaignId: s.row.id, source: 'qwt-promotion-list' } }"
            @click.native="onClickCampaignReport">
            报表
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    </main>
    <bax-pagination :options="query"
      @current-change="onCurrentChange">
    </bax-pagination>

    <area-selector type="qwt" :all-areas="allAreas"
      :areas="query.areas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="v => {queryCampaigns({areas: v}), areaDialogVisible = false}"
      @cancel="areaDialogVisible = false"
    />
  </div>
</template>

<script>
import EditableLabel from 'com/common/editable-label'
import AreaSelector from 'com/common/area-selector'
import BaxPagination from 'com/common/pagination'
import BaxSelect from 'com/common/select'
import BaxInput from 'com/common/input'
import { Message } from 'element-ui'
import equal from 'lodash.isequal'

import {
  CAMPAIGN_STATUS_PENDING,
  CAMPAIGN_STATUS_OFFLINE,
  SEM_PLATFORM_SHENMA,
  campaignAuditStatus,
  campaignStatus,
  semPlatformCn,
  semPlatformOpts
} from 'constant/fengming'

import {
  campaignAuditStatusTooltip,
  campaignStatusTooltip,
  mobileRatioTip
} from 'constant/tip'

import {
  updateCampaignDailyBudget,
  updateCampaignTimeRange,
  updateCampaignRatio,
  activeCampaigns,
  pauseCampaigns
} from 'api/fengming'

import track from 'util/track'
import {
  renderColumnHeaderWithTip,
  disabledDate,
  getCampaignValidTime,
  getCnName
} from 'util'

import {
  toHumanTime,
  commafy
} from 'utils'
import store from './store'

// 不能选择的状态
const cantSelectStatuses = [
  CAMPAIGN_STATUS_PENDING,
  CAMPAIGN_STATUS_OFFLINE
]

const campaignStatusOpts = [{
  label: '推广中/审核中',
  value: '100'
}, {
  label: '计划预算不足',
  value: '5'
}, {
  label: '账户余额不足',
  value: '-51'
}, {
  label: '已暂停',
  value: '-10,-50'
}, {
  label: '已下线',
  value: '-1'
}, {
  label: '审核驳回',
  value: '-53'
}]

export default {
  name: 'qwt-promotion-list',
  components: {
    EditableLabel,
    BaxPagination,
    AreaSelector,
    BaxSelect,
    BaxInput
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    campaigns: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      required: true
    },
    showMoreFilters: {
      type: Boolean,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    },
    userId: {
      type: [Number, String]
    },
    canCreate: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      toolbox: {
        showPricePercent: false,
        showDailyBudget: false,
        showTimeRange: false,
        // 更新数据
        timeRange: [],
        budget: '',
        ratio: '',
        areaQueryWord: '',
      },
      areaDialogVisible: false,
      semPlatformOpts,
      campaignStatusOpts,
      selectedCampaignIds: [],

      campaignAuditStatusTooltip,
      campaignStatusTooltip,
      mobileRatioTip,

      CAMPAIGN_STATUS_OFFLINE,
      SEM_PLATFORM_SHENMA
    }
  },
  computed: {
    allRowsChecked() {
      const {
        selectedCampaignIds,
        campaigns
      } = this

      const ids = campaigns.filter(c => {
        return !cantSelectStatuses.includes(c.status)
      }).map(p => p.id).sort()

      return equal(selectedCampaignIds.sort(), ids)
    },
    areaOpts() {
      const q = this.areaQueryWord

      if (!q) {
        return this.allAreas
      }

      return this.allAreas
        .filter(a => {
          return a.name.includes(q) ||
            a.nameCn.includes(q)
        })
    }
  },
  methods: {
    async removeArea(area) {
      await this.queryCampaigns({
        areas: this.query.areas.filter(a => a !== area)
      })
    },

    formatterArea(name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },
    async queryCampaigns(opts) {
      console.log(opts)
      await store.getCurrentCampaigns({
        ...this.query,
        ...opts
      })
    },
    switchShowMoreFilters() {
      store.switchShowMoreFilters()

      track({
        action: 'campaign list: click more filters'
      })
    },
    gotoCreatePromotion() {
      this.$router.push({
        name: 'qwt-create-promotion'
      })

      track({
        action: 'campaign list: click create campaign'
      })
    },
    renderColumnHeaderWithTip,
    async onCurrentChange({offset}) {
      await store.getCurrentCampaigns({
        ...this.query,
        offset
      })
    },
    checkHasSelectedCampaigns() {
      if (this.selectedCampaignIds.length) {
        return true
      }

      Message.error('请先选择要设置的推广')

      return false
    },
    checkSelectable(row) {
      return !cantSelectStatuses.includes(row.status)
    },
    async inlineUpdateBudget(id, v) {
      const budget = parseInt(v)

      if (!(budget > 0 && budget < 10000000)) {
        return Message.error('请设置合理的预算')
      }

      const opts = {
        campaignIds: [id],
        dailyBudget: budget
      }

      await updateCampaignDailyBudget(opts)
      await store.getCurrentCampaigns({...this.query})

      Message.success('更新成功')
    },
    async updateCampaignDailyBudget() {
      if (!this.checkHasSelectedCampaigns()) {
        return
      }

      track({
        action: 'campaign list: update campaigns daily budget'
      })

      const budget = parseInt(this.toolbox.budget) * 100

      if (!(budget > 0 && budget < 10000000)) {
        return Message.error('请设置合理的预算')
      }

      const opts = {
        campaignIds: this.selectedCampaignIds,
        dailyBudget: budget
      }

      await updateCampaignDailyBudget(opts)
      await store.getCurrentCampaigns({...this.query})

      this.toolbox.budget = ''

      Message.success('更新成功')
    },
    async updateCampaignTimeRange() {
      if (!this.checkHasSelectedCampaigns()) {
        return
      }

      const { timeRange } = this.toolbox
      if (!timeRange.length) {
        return Message.error('请设置时间范围')
      }

      const opts = {
        campaignIds: this.selectedCampaignIds,
        validTime: getCampaignValidTime(timeRange)
      }

      await updateCampaignTimeRange(opts)
      await store.getCurrentCampaigns({...this.query})

      this.toolbox.timeRange = []

      Message.success('更新成功')
    },
    async inlineUpdateRatio(id, v) {
      const ratio = parseFloat(v)
      if (!(ratio >= 0.1 && ratio <= 9.9)) {
        return Message.error('请设置合理的出价比例')
      }

      const opts = {
        campaignIds: [id],
        ratio
      }

      await updateCampaignRatio(opts)
      await store.getCurrentCampaigns({...this.query})

      Message.success('更新成功')
    },
    async updateCampaignRatio() {
      if (!this.checkHasSelectedCampaigns()) {
        return
      }

      track({
        action: 'campaign list: update campaigns ratio'
      })

      const ratio = parseFloat(this.toolbox.ratio)
      if (!(ratio >= 0.1 && ratio <= 9.9)) {
        return Message.error('请设置合理的出价比例')
      }

      const opts = {
        campaignIds: this.selectedCampaignIds,
        ratio
      }

      await updateCampaignRatio(opts)
      await store.getCurrentCampaigns({...this.query})

      this.toolbox.ratio = ''

      Message.success('更新成功')
    },
    async updateCampaignStatus(cmd) {
      if (!this.checkHasSelectedCampaigns()) {
        return
      }

      try {
        await this.$confirm(`确定${cmd === 'pause' ? '暂停' : '开始'}投放 ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
      } catch (err) {
        return
      }

      track({
        action: 'campaign list: update campaigns status'
      })

      const ids = this.selectedCampaignIds

      if (cmd === 'pause') {
        await pauseCampaigns(ids)
      } else {
        await activeCampaigns(ids)
      }

      await store.getCurrentCampaigns({...this.query})

      Message.success('更新成功')
    },
    async switchCampaignPause(row) {
      const {
        pause
      } = row

      try {
        await this.$confirm(`确定${pause ? '开始' : '暂停'}投放 ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
      } catch (err) {
        return
      }

      if (pause) {
        await activeCampaigns([row.id])
      } else {
        await pauseCampaigns([row.id])
      }

      await store.getCurrentCampaigns({...this.query})

      Message.success('更新成功')
    },
    onClickCheckAllRows(e) {
      const { checked } = e.target

      if (checked) {
        // select all
        this.campaigns.filter(c => {
          return !cantSelectStatuses.includes(c.status)
        }).forEach(r => {
          this.$refs.table.toggleRowSelection(r)
        })
      } else {
        this.$refs.table.clearSelection()
        this.selectedCampaignIds = []
      }
    },
    onClickCampaignDetail() {
      track({
        action: 'campaign list: click campaign detail'
      })
    },
    onClickCampaignReport() {
      track({
        action: 'campaign list: click campaign report'
      })
    },
    onSelectionChange(rows) {
      const ids = rows.map(r => r.id)
      this.selectedCampaignIds = [...ids]
    },
    switchToolbox(type) {
      const toolbox = this.toolbox
      let show = false

      switch (type) {
        case 'price percent':
          show = toolbox.showPricePercent
          if (show) {
            toolbox.showPricePercent = false
          } else {
            toolbox.showPricePercent = true
            toolbox.showDailyBudget = false
            toolbox.showTimeRange = false
          }
          break
        case 'daily budget':
          show = toolbox.showDailyBudget
          if (show) {
            toolbox.showDailyBudget = false
          } else {
            toolbox.showDailyBudget = true
            toolbox.showPricePercent = false
            toolbox.showTimeRange = false
          }
          break
        case 'time range':
          show = toolbox.showTimeRange
          if (show) {
            toolbox.showTimeRange = false
          } else {
            toolbox.showTimeRange = true
            toolbox.showDailyBudget = false
            toolbox.showPricePercent = false
          }
          break
      }
    },
    fmtAuditStatus(row) {
      const { auditStatus, status } = row

      if (status === CAMPAIGN_STATUS_OFFLINE) {
        return '-'
      }

      return campaignAuditStatus[String(auditStatus)] || '未知'
    },
    getColor(s) {
      if (s === '推广中') {
        return '#52c41a'
      }

      if (s === '已下线') {
        return 'rgba(0, 0, 0, 0.25)'
      }

      return '#f5222d'
    },
    fmtPrice(s) {
      return commafy((s / 100).toFixed(2)) + ' 元'
    },
    fmtSource(s) {
      return semPlatformCn[s] || '未知'
    },
    fmtStatus(s) {
      return campaignStatus[String(s)] || '未知'
    },
    fmtDate(range, date) {
      if (!range || (date === null)) {
        return '长期'
      }

      if (!date) {
        return '未知'
      }

      return toHumanTime(date, 'YYYY-MM-DD HH:mm')
    },
    disabledDate
  },
  async mounted() {
    const { campaigns } = await store.getCurrentCampaigns({...this.query})

    const { src } = this.$route.query
    if (src === 'bxuc' && !campaigns.length) {
      this.$router.push({
        name: 'qwt-create-promotion'
      })

      return
    }

    const { userInfo } = this

    track({
      action: 'campaign list: enter page',
      baixingId: userInfo.baixingId,
      baxId: userInfo.id
    })
  }
}
</script>

<style lang="postcss" scoped>
@import '../../cssbase/var';
@import 'cssbase/mixin';

.filter-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  &>label {
    font-size: 12px;
    color: #475669;
    width: 60px;
  }
  &>div {
    display: flex;
    align-items: center;
  }
}

.more-filter {
  margin-left: auto;
}
.area-tag {
  margin-right: 5px;
}
.center {
  @mixin center;
}

a {
  color: var(--qwt-c-blue);
}
.actions {
  display: flex;
}
.action {
  margin-right: 15px;
}
.action.search {
  width: auto;
}
.filters {
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  & > span {
    display: flex;
    flex-grow: 0.33;
  }

  & > span:last-child {
    /* margin-left: 40px; */
  }
}

.qwt-promotion-list {
  margin-top: 16px;

  & > header {
    margin-bottom: 20px;

    & > span {
      display: inline-flex;
      flex-flow: column;

      & > div:nth-child(2) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
      }
    }

    & > span:nth-child(1) {
      width: 120px;
      padding-left: 20px;
    }

    & > span:nth-child(2) {
      width: 180px;
      margin-right: 20px;
    }

    & > span:nth-child(3) {
      width: 145px;
      margin-right: 40px;

      & > div:nth-child(2) {
        & > label {
          min-width: 45px;
          margin: 0 5px;
          font-size: 11px;
          color: #5e6b82;
        }
      }
    }

    & > span:nth-child(4) {
      width: 145px;
      margin-right: 100px;
    }

    & > span:nth-child(5) {
      width: 145px;
    }
  }

  & > main {
    max-width: 1080px;
  }
}
</style>

<style>
.qwt-promotion-list {
  & .el-icon-info {
    font-size: 11px;
    color: rgb(151, 168, 190);
  }

  & .dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.25);
  }
}
</style>
