
<template>
  <div class="qwt-promotion-list">
    <el-table ref="table" :data="promotions"
      @selection-change="onSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="open" label="开关" width="80">
        <template scope="s">
          <el-switch :value="!s.pause" on-text="" off-text=""
            @change="switchPause(s)" />
        </template>
      </el-table-column>
      <el-table-column prop="a1" label="计划/创意" width="160" />
      <el-table-column label="状态" width="120"
        :formatter="r => fmtStatus(r.status)" />
      <el-table-column label="预算" width="100"
        :formatter="r => fmtPrice(r.dailyBudget)" />
      <el-table-column prop="mobilePriceRatio" label="移动端出价比例(0.1-50)" width="120" />
      <el-table-column label="开始日期" width="120"
        :formatter="r => fmtDate(r.timeRange && r.timeRange[0])" />
      <el-table-column label="结束日期" width="120"
        :formatter="r => fmtDate(r.timeRange && r.timeRange[1])" />
      <el-table-column label="今日消耗" width="100"
        :formatter="r => fmtPrice(r.todayCost)" />
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtSource(r.source)" />
      <el-table-column label="操作" width="80">
        <template scope="s">
          <a>详情</a>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination :options="query"
      @current-change="onCurrentChange" />
  </div>
</template>

<script>

import BaxPagination from 'com/common/pagination'

import {
  semPlatformCn
} from 'constant/fengming'

import equal from 'lodash.isequal'

import {
  getCurrentCampaigns,
  activeCampaigns,
  pauseCampaigns
} from './action'

import {
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
    promotions: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
      selectedPromotionIds: []
  computed: {
    allRowsChecked() {
      const {
        selectedPromotionIds,
        promotions
      } = this

      const ids = promotions.map(p => p.id).sort()

      return equal(selectedPromotionIds.sort(), ids)
    }
  },
  methods: {
    async onCurrentChange({offset}) {
      await getCurrentCampaigns({offset})
    },
    async switchPause(row) {
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
    },
    onClickCheckAllRows(e) {
      const { checked } = e.target

      if (checked) {
        // select all
        this.promotions.forEach(r => {
          this.$refs.table.toggleRowSelection(r)
        })
      } else {
        this.$refs.table.clearSelection()
        this.selectedPromotionIds = []
      }
    },
    onSelectionChange(rows) {
      const ids = rows.map(r => r.id)
      this.selectedPromotionIds = [...ids]

      console.log(99, ids)
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
}

</style>
