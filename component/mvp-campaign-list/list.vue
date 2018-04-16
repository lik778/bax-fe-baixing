<template>
  <div class="mvp-campaign-list">
    <header>
      <span>
        <div>
          <el-button @click="switchToolbox('daily budget')">
            设置日预算
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
        </div>
        <div v-if="toolbox.showDailyBudget">
          <el-input style="width: 120px;"
            placeholder="日预算"
            v-model="toolbox.budget">
          </el-input>
          <el-button type="primary" size="mini"
            @click="updateCampaignDailyBudget">
            确定
          </el-button>
        </div>
      </span>
    </header>
    <main>
      <el-table :data="campaigns">
        <el-table-column width="40">
          <template slot-scope="s">
            <span class="center">
              <el-checkbox
                :value="s.row.id === toolbox.campaignId"
                @change="onCheckCampaign(s.row.id)" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="开关" width="80">
          <template slot-scope="s">
            <el-switch :value="!s.row.pause"
              @change="toggleCampaignPause(s.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="计划ID" prop="id">
        </el-table-column>
        <el-table-column label="计划状态"
          :render-header="renderColumnHeaderWithTip(campaignStatusTooltip)"
          :formatter="r => r.pause ? '-' : fmtStatus(r.status)">
        </el-table-column>
        <el-table-column label="渠道"
          :formatter="r => r.sources.map(fmtSource).join('，')">
        </el-table-column>
        <el-table-column label="终端"
          :formatter="r => r.devices.map(fmtDevice).join('，')">
        </el-table-column>
        <el-table-column label="城市"
          :formatter="r => r.areas.map(fmtArea).join('，')">
        </el-table-column>
        <el-table-column label="点击单价" width="120"
          :render-header="renderColumnHeaderWithTip(campaignCpcPriceTooltip)"
          :formatter="r => fmtPrice(r.cpcPrice)">
        </el-table-column>
        <el-table-column label="今日预算"
          :formatter="r => fmtPrice(r.dailyBudget)">
        </el-table-column>
        <el-table-column label="今日消耗"
          :formatter="r => fmtPrice(r.todayCost)">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="s">
            <router-link :to="{ name: 'mvp-update-campaign', params: { id: s.row.id } }">
              修改
            </router-link>
            <router-link :to="{ name: 'mvp-dashboard', query: { campaignId: s.row.id, source: 'mvp-campaign-list' } }">
              查看报表
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <bax-pagination :options="query"
        @current-change="onCurrentChange">
      </bax-pagination>
    </footer>
  </div>
</template>

<script>
import BaxPagination from 'com/common/pagination'

import { Message } from 'element-ui'

import {
  device
} from 'constant/fengming-mvp'

import {
  campaignStatus,
  semPlatformCn
} from 'constant/fengming'

import {
  updateCampaign
} from 'api/fengming-mvp'

import {
  renderColumnHeaderWithTip
} from 'util/element'

import {
  getCnName
} from 'util/meta'

import {
  commafy
} from 'utils'

import store from './store'

const campaignStatusTooltip = `
计划包含以下4种状态：
  1. 有效：表示计划当前正常推广中；
  2. 计划预算不足：表示当前计划推广预算已花完；
  3. 账户余额不足：表示当前账户余额不足以开启该计划，无法推广；
  4. -: 表示计划暂停;
`
const campaignCpcPriceTooltip = `
每次点击的实际扣费小于或等于这个值
`

export default {
  name: 'mvp-campaign-list',
  components: {
    BaxPagination
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  fromMobx: {
    campaigns: () => store.campaigns,
    query: () => store.query
  },
  data() {
    return {
      campaignStatusTooltip,
      campaignCpcPriceTooltip,
      toolbox: {
        showDailyBudget: false,
        showCpcPrice: false,
        // 更新数据
        campaignId: 0, // 选中的单个 campaign
        cpcPrice: '',
        budget: ''
      }
    }
  },
  methods: {
    async toggleCampaignPause(campaign) {
      const { pause } = campaign

      try {
        await this.$confirm(`确定${pause ? '开始' : '暂停'}投放 ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
      } catch (err) {
        return
      }

      await updateCampaign(campaign.id, {
        pause: pause === 0 ? 1 : 0
      })

      await store.getCampaigns()
    },
    async updateCampaignDailyBudget() {
      const {
        campaignId: cid,
        budget
      } = this.toolbox

      if (!cid) {
        return Message.error('请选择要更新的推广')
      }
      if (!budget) {
        return Message.error('请设置每日预算')
      }
      const minBudget = this.getMinBudget(cid)
      if (budget < minBudget) {
        return Message.error(`每日预算不得低于 ${minBudget} 元`)
      }

      await updateCampaign(cid, {
        dailyBudget: budget * 100
      })

      this.clearToolbox()

      await store.getCampaigns()
    },
    async updateCampaignCpcPrice() {
      const {
        campaignId: cid,
        cpcPrice
      } = this.toolbox

      if (!cid) {
        return Message.error('请选择要更新的推广')
      }
      if (!cpcPrice) {
        return Message.error('请设置最高点击单价')
      }
      const minPrice = this.getMinCpcPrice()
      if (cpcPrice < minPrice) {
        return Message.error(`最高点击单价不得低于 ${minPrice} 元`)
      }

      const campaign = this.campaigns.find(c => c.id === cid)
      if (cpcPrice * 30 * 100 > campaign.dailyBudget) {
        return Message.error(`按照设置的最高点击单价，当前日预算不得低于 ${cpcPrice * 30} 元，请先调高日预算`)
      }

      await updateCampaign(cid, {
        cpcPrice: cpcPrice * 100
      })

      this.clearToolbox()

      await store.getCampaigns()
    },
    async onCurrentChange({ offset }) {
      this.clearToolbox()
      await store.getCampaigns({offset})
    },
    getMinBudget() {
      return 100
    },
    getMinCpcPrice() {
      return 1.5
    },
    onCheckCampaign(id) {
      this.toolbox.campaignId = id
    },
    clearToolbox() {
      this.toolbox.campaignId = 0
      this.toolbox.cpcPrice = ''
      this.toolbox.budget = ''
    },
    switchToolbox(type) {
      const { toolbox } = this
      let show = false

      switch (type) {
        case 'daily budget':
          show = toolbox.showDailyBudget
          if (show) {
            toolbox.showDailyBudget = false
          } else {
            toolbox.showDailyBudget = true
            toolbox.showCpcPrice = false
          }
          break
      }
    },
    fmtSource(s) {
      return semPlatformCn[String(s)] || '未知'
    },
    fmtStatus(s) {
      return campaignStatus[String(s)] || '未知'
    },
    fmtPrice(s) {
      return commafy((s / 100).toFixed(2)) + '元'
    },
    fmtDevice(i) {
      return device[String(i)] || '未知'
    },
    fmtArea(a) {
      return getCnName(a, this.allAreas)
    },
    renderColumnHeaderWithTip
  }
}
</script>

<style scoped>
.center {
  display: inline-flex;
  justify-content: center;
  width: 100%;
}

.mvp-campaign-list {
  width: calc(100% - 20px);
  margin: 10px;
  padding: 10px 20px;
  background: white;

  & > header {
    display: flex;

    & > span {
      display: flex;
      flex-flow: column;
      width: 220px;

      & > div:nth-child(2) {
        margin-top: 10px;
      }
    }
  }

  & > main {
    max-width: 1080px;
    margin-top: 10px;
  }
}
</style>
