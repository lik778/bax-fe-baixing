
<template>
  <div class="qwt-dashboard-data-detail">
    <el-table v-if="isCampaignDimension"
      :key="1" :data="statistics">
      <el-table-column label="日期" prop="date" width="140" />
      <el-table-column label="推广计划" prop="campaignId" width="120" />
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtChannel(r.channel)" />
      <el-table-column label="设备" width="100"
        :formatter="r => fmtDevice(r.device)" />
      <el-table-column label="展现" prop="shows" width="90" sortable />
      <el-table-column label="点击" prop="clicks" width="90" sortable />
      <el-table-column label="实扣点击单价" width="160" sortable
        :formatter="r => (r.clickAvgPrice / 100).toFixed(2) + '元'" />
      <el-table-column label="消耗" width="120"
        :formatter="r => (r.cost / 100).toFixed(2) + '元'" />
      <el-table-column label="关键词详情" width="140">
        <template slot-scope="s">
          <p class="link" @click="switchToCampaignReport(s.row.campaignId)">
            查看
          </p>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-else :key="2" :data="statistics">
      <el-table-column label="日期" prop="date" width="140" />
      <el-table-column label="关键词" prop="keyword" width="120" />
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtChannel(r.channel)" />
      <el-table-column label="设备" width="100"
        :formatter="r => fmtDevice(r.device)" />
      <el-table-column label="展现" prop="shows" width="90" sortable />
      <el-table-column label="点击" prop="clicks" width="90" sortable />
      <el-table-column label="实扣点击单价" width="160" sortable
        :formatter="r => (r.clickAvgPrice / 100).toFixed(2) + '元'" />
      <el-table-column label="消耗" width="120"
        :formatter="r => (r.cost / 100).toFixed(2) + '元'" />
      <el-table-column label="排名" width="120" sortable
        :formatter="r => fmtCpcRanking(r.cpcRanking)" />
      <el-table-column label="优化出价">
        <template slot-scope="s">
          <p class="link" @click="gotoUpdateCampaign(s.row.campaignId)">修改计划</p>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <div class="total" v-if="!!statistics.length">
        <span>
          <label>总展现：</label>
          <strong>{{ summary.shows }}</strong>
        </span>
        <span>
          <label>总点击：</label>
          <strong>{{ summary.clicks }}</strong>
        </span>
        <span>
          <label>总消费：</label>
          <strong>{{ (summary.cost / 100).toFixed(2) + '元' }}</strong>
        </span>
      </div>
      <bax-pagination :options="{ total, offset, limit }"
        @current-change="onCurrentChange">
      </bax-pagination>
    </footer>
  </div>
</template>

<script>
import BaxPagination from 'com/common/pagination'
import BaxSelect from 'com/common/select'

import {
  DIMENSION_CAMPAIGN
} from 'constant/fengming-report'

import {
  semPlatformCn
} from 'constant/fengming'

import track from 'util/track'
import {
  fmtCpcRanking
} from 'util/campaign'

import {
  toHumanTime,
  centToYuan
} from 'utils'

const isArray = Array.isArray

export default {
  name: 'qwt-dashboard-data-detail',
  components: {
    BaxPagination,
    BaxSelect
  },
  props: {
    statistics: {
      type: Array,
      required: true
    },
    dimension: {
      type: Number,
      required: true
    },
    summary: {
      type: Object,
      required: true
    },
    offset: {
      type: Number,
      required: true
    },
    limit: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  computed: {
    isCampaignDimension() {
      return this.dimension === DIMENSION_CAMPAIGN
    }
  },
  methods: {
    switchToCampaignReport(cid) {
      this.$emit('switch-to-campaign-report', {
        campaignId: cid
      })

      track({
        action: 'qwt-dashboard: switch to campaign report'
      })
    },
    gotoUpdateCampaign(cid) {
      this.$router.push({
        name: 'qwt-update-promotion',
        params: {
          id: cid
        },
        query: {
          target: 'keyword'
        }
      })

      track({
        action: 'qwt-dashboard: goto update campaign'
      })
    },
    onClickCustomColumns() {
      track({
        action: 'qwt-dashboard: click set custom columns'
      })
    },
    onCurrentChange(opts) {
      this.$emit('current-change', opts)
    },
    checkVisiable(column) {
      return this.displayColumns.includes(column)
    },
    fmtChannel(c) {
      return semPlatformCn[String(c)] || '未知'
    },
    fmtDevice(a) {
      const m = {
        '0': '电脑，手机',
        '1': '电脑',
        '2': '手机'
      }

      if (!isArray(a)) {
        return m[String(a)]
      }

      return a.map(i => m[String(i)]).join(',')
    },
    fmtCpcRanking,
    toHumanTime,
    centToYuan
  }
}
</script>

<style>
@import '../../cssbase/var';
@import 'cssbase/mixin';

.qwt-dashboard-data-detail .link {
  @mixin center;
  max-width: 70px;
  color: var(--qwt-c-blue);
  cursor: pointer;
}
</style>

<style lang="postcss" scoped>
.total {
  padding: 10px 5px;

  & > span {
    & > label {
      color: #6a778c;
    }

    margin-right: 20px;
  }
}

.qwt-dashboard-data-detail {
  margin: 50px 0 30px;

  & > header {
    display: flex;
    align-items: center;
    height: 35px;
    padding-left: 30px;
    border-radius: 3px;
    background: #e5e9f2;
    font-size: 14px;
    color: #6a778c;
  }

  & > section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 68px;
    padding: 10px 15px 10px 5px;

    & > span:first-child {
      display: flex;
      align-items: center;
      min-width: 480px;

      & > label {
        margin-right: 25px;
        font-size: 14px;
        color: #6a778c;
      }

      & > div {
        flex-grow: 1;
      }
    }
  }
}
</style>
