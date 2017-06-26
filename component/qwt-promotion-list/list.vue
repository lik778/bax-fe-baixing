
<template>
  <div class="qwt-promotion-list">
    <header>
      <span>
        <el-checkbox label="全选" :value="allRowsChecked"
          @change="onClickCheckAllRows">
        </el-checkbox>
      </span>
      <span>
        <el-dropdown @command="updateCampaignStatus">
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
      </span>
      <span>
        <div>
          <el-button @click="switchToolbox('price percent')">
            设置出价比例
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
        </div>
        <div v-if="toolbox.showPricePercent">
          <el-input style="width: 60px;" placeholder="比例"
            v-model="toolbox.ratio">
          </el-input>
          <label>(0.1-50)</label>
          <el-button type="primary" size="mini"
            @click="updateCampaignRatio">
            确定
          </el-button>
        </div>
      </span>
      <span>
        <div>
          <el-button @click="switchToolbox('daily budget')">
            设置日预算
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
        </div>
        <div v-if="toolbox.showDailyBudget">
          <el-input style="width: 80px;" placeholder="日预算"
            v-model="toolbox.budget">
          </el-input>
          <el-button type="primary" size="mini"
            @click="updateCampaignDailyBudget">
            确定
          </el-button>
        </div>
      </span>
      <span>
        <div>
          <el-button @click="switchToolbox('time range')">
            设置投放日期
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
        </div>
        <div v-if="toolbox.showTimeRange" style="width: 260px;">
          <el-date-picker type="daterange" placeholder="选择日期范围"
            style="width: 200px;" v-model="toolbox.timeRange">
          </el-date-picker>
          <el-button type="primary" size="mini"
            @click="updateCampaignTimeRange">
            确定
          </el-button>
        </div>
      </span>
    </header>
    <el-table ref="table" :data="campaigns"
      @selection-change="onSelectionChange">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column prop="open" label="开关" width="80">
        <template scope="s">
          <el-switch :value="!s.pause" on-text="" off-text=""
            @change="switchCampaignPause(s)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="a1" label="计划/创意" width="160">
      </el-table-column>
      <el-table-column label="状态" width="120"
        :formatter="r => fmtStatus(r.status)">
      </el-table-column>
      <el-table-column label="预算" width="100"
        :formatter="r => fmtPrice(r.dailyBudget)">
      </el-table-column>
      <el-table-column prop="mobilePriceRatio" label="移动端出价比例(0.1-50)" width="120">
      </el-table-column>
      <el-table-column label="开始日期" width="120"
        :formatter="r => fmtDate(r.timeRange && r.timeRange[0])">
      </el-table-column>
      <el-table-column label="结束日期" width="120"
        :formatter="r => fmtDate(r.timeRange && r.timeRange[1])">
      </el-table-column>
      <el-table-column label="今日消耗" width="100"
        :formatter="r => fmtPrice(r.todayCost)">
      </el-table-column>
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtSource(r.source)">
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template scope="s">
          <router-link :to="{ name: 'qwt-update-promotion', params: { id: s.row.id } }">
            详情
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination :options="query"
      @current-change="onCurrentChange">
    </bax-pagination>
  </div>
</template>

<script>

import BaxPagination from 'com/common/pagination'
import { Message } from 'element-ui'

import {
  semPlatformCn
} from 'constant/fengming'

import equal from 'lodash.isequal'

import {
  updateCampaignDailyBudget,
  updateCampaignTimeRange,
  updateCampaignRatio,
  getCurrentCampaigns,
  activeCampaigns,
  pauseCampaigns
} from './action'

import {
  toTimestamp,
  toHumanTime,
  centToYuan,
  commafy
} from 'utils'

export default {
  name: 'qwt-promotion-list',
  components: {
    BaxPagination
  },
  props: {
    campaigns: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
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
        ratio: ''
      },
      selectedCampaignIds: []
    }
  },
  computed: {
    allRowsChecked() {
      const {
        selectedCampaignIds,
        campaigns
      } = this

      const ids = campaigns.map(p => p.id).sort()

      return equal(selectedCampaignIds.sort(), ids)
    }
  },
  methods: {
    async onCurrentChange({offset}) {
      await getCurrentCampaigns({offset})
    },
    checkHasSelectedCampaigns() {
      if (this.selectedCampaignIds.length) {
        return true
      }

      Message.error('请先选择要设置的推广')

      return false
    },
    async updateCampaignDailyBudget() {
      if (!this.checkHasSelectedCampaigns()) {
        return
      }

      const budget = parseInt(this.toolbox.budget)

      if (!(budget > 0)) {
        return Message.error('请设置合理的预算')
      }

      const opts = {
        campaignIds: this.selectedCampaignIds,
        dailyBudget: budget
      }

      await updateCampaignDailyBudget(opts)
      await getCurrentCampaigns({...this.query})

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
        validTime: [
          toTimestamp(timeRange[0]),
          toTimestamp(timeRange[1])
        ]
      }

      await updateCampaignTimeRange(opts)
      await getCurrentCampaigns({...this.query})

      this.toolbox.timeRange = []

      Message.success('更新成功')
    },
    async updateCampaignRatio() {
      if (!this.checkHasSelectedCampaigns()) {
        return
      }

      const ratio = parseFloat(this.toolbox.ratio)
      if (!(ratio >= 0.1 && ratio <= 50)) {
        return Message.error('请设置合理的出价比例')
      }

      const opts = {
        campaignIds: this.selectedCampaignIds,
        ratio
      }

      await updateCampaignRatio(opts)
      await getCurrentCampaigns({...this.query})

      this.toolbox.ratio = ''

      Message.success('更新成功')
    },
    async updateCampaignStatus(cmd) {
      if (!this.checkHasSelectedCampaigns()) {
        return
      }

      try {
        await this.$confirm(`确定${cmd === 'pause' ? '暂停' : '重新'}投放 ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
      } catch (err) {
        return
      }

      const ids = this.selectedCampaignIds

      if (cmd === 'pause') {
        await pauseCampaigns(ids)
      } else {
        await activeCampaigns(ids)
      }

      await getCurrentCampaigns({...this.query})

      Message.success('更新成功')
    },
    async switchCampaignPause(row) {
      const {
        pause
      } = row

      try {
        await this.$confirm(`确定${pause ? '重新' : '暂停'}投放 ?`, '提示', {
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

      await getCurrentCampaigns({...this.query})

      Message.success('更新成功')
    },
    onClickCheckAllRows(e) {
      const { checked } = e.target

      if (checked) {
        // select all
        this.campaigns.forEach(r => {
          this.$refs.table.toggleRowSelection(r)
        })
      } else {
        this.$refs.table.clearSelection()
        this.selectedCampaignIds = []
      }
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
    fmtPrice(s) {
      return commafy(centToYuan(s)) + ' 元'
    },
    fmtSource(s) {
      return semPlatformCn[s] || '未知'
    },
    fmtStatus(s) {
      return '' || '未知'
    },
    fmtDate(s) {
      if (!s) {
        return '未知'
      }

      return toHumanTime(s, 'YYYY-MM-DD')
    }
  },
  async mounted() {
    await getCurrentCampaigns({...this.query})
  }
}

</script>

<style scoped>

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
}

</style>
