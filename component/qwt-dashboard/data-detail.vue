
<template>
  <div class="qwt-dashboard-data-detail">
    <el-table v-if="dimension === DIMENSION_CAMPAIGN"
      :key="1" :data="statistics">
      <el-table-column label="计划ID" prop="campaignId" width="120" />
      <el-table-column label="日期" prop="date" width="140" />
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
      <template slot-scope="scope">
        <p class="link" @click="switchToCampaignReport(scope.row)">
          查看
        </p>
      </template>
    </el-table-column>
    </el-table>

    <el-table v-else-if="dimension === DIMENSION_KEYWORD" :key="2" :data="statistics">
      <el-table-column label="关键词" prop="keyword" width="200" />
      <el-table-column label="日期" prop="date" width="140" />
      <el-table-column label="计划ID" prop="campaignId" width="140" />
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtChannel(r.channel)" />
      <el-table-column label="设备" width="100"
        :formatter="r => fmtDevice(r.device)" />
      <el-table-column label="出价" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.price === null">-</span>
          <bax-input v-else
                     :value="f2y(scope.row.price)"
                     @blur="v => onChangePrice(v, scope.row.campaignId, scope.row.keywordId)" 
                     @keyup="v => onChangePrice(v, scope.row.campaignId, scope.row.keywordId)" />
        </template>
      </el-table-column>
      <el-table-column label="展现" prop="shows" width="90" sortable />
      <el-table-column label="点击" prop="clicks" width="90" sortable />
      <el-table-column label="实扣点击单价" width="160" sortable
        :formatter="r => (r.clickAvgPrice / 100).toFixed(2) + '元'" />
      <el-table-column label="消耗" width="120"
        :formatter="r => (r.cost / 100).toFixed(2) + '元'" />
      <el-table-column label="排名" width="120" sortable
        :formatter="r => fmtCpcRanking(r.cpcRanking)" />
    </el-table>

    <el-table v-else :key="3" :data="statistics">
      <el-table-column label="搜索词" prop="queryWord" width="200" />
      <el-table-column label="日期" prop="date" width="140" />
      <el-table-column label="计划ID" prop="campaignId" width="140" />
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtChannel(r.channel)" />
      <el-table-column label="设备" width="100"
        :formatter="r => fmtDevice(r.device)" />
      <el-table-column label="展现" prop="shows" width="90" sortable />
      <el-table-column label="点击" prop="clicks" width="90" sortable />
      <el-table-column label="点击率" width="160" sortable
        :formatter="r => (r.clickRate * 100).toFixed(2)+ '%'" />
      <el-table-column label="消耗" width="120"
        :formatter="r => (r.costs / 100).toFixed(2) + '元'" />
      <el-table-column label="平均点击价格" width="160" sortable
        :formatter="r => (r.clickAvgPrice / 100).toFixed(2) + '元'" />
      <el-table-column min-width="180" fixed="right">
        <span slot="header">操作
          <promotion-keyword-tip />
        </span>
        <div slot-scope="{row}">
          <el-button type="text"
                     size="small" 
                    :disabled="row.enableInKeywords || row.enableInNegativeWords" 
                    @click="addKeyword(row)">添加</el-button>
          <el-button type="text"
                     size="small"
                     :disabled="row.enableInNegativeWords || row.enableInKeywords" 
                     @click="addNegativeKeyword(row)">设为否定关键词</el-button>
          <el-tooltip effect="dark"
                      v-if="row.enableInNegativeWords || row.enableInKeywords" 
                      content="该搜索词已存在关键词或否定关键词中，暂不支持添加" 
                      placement="top-start">
            <i class="el-icon-info" style ="cursor: pointer"></i>
          </el-tooltip>
        </div>
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
import {updateCampaign} from 'api/fengming'
import BaxInput from 'com/common/bax-input'
import PromotionKeywordTip from 'com/widget/promotion-keyword-tip'

import {
  DIMENSION_CAMPAIGN,
  DIMENSION_SEARCH_KEYWORD,
  DIMENSION_KEYWORD
} from 'constant/fengming-report'

import {
  semPlatformCn
} from 'constant/fengming'

import track from 'util/track'
import {
  fmtCpcRanking
} from 'util/campaign'

import { toFloat, f2y } from 'util/kit'
import { Message } from 'element-ui'

const isArray = Array.isArray

export default {
  name: 'qwt-dashboard-data-detail',
  components: {
    BaxPagination,
    BaxSelect,
    BaxInput,
    PromotionKeywordTip
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
  data() {
    return {
      priceUpdating: false,
      DIMENSION_CAMPAIGN,
      DIMENSION_KEYWORD
    }
  },
  methods: {
    addKeyword(item) {
      const { campaignId, queryWord } = item
      const price = 2 * 100
      updateCampaign(campaignId, {newKeywords: [{price, word: queryWord}]})
        .then(res => {
          Message({
            type: 'success',
            message: `成功添加 ${queryWord} 为关键词`
          })
        })
    },
    addNegativeKeyword(item) {
      const { campaignId, queryWord } = item
      updateCampaign(campaignId, {newNegativeKeywords: [{word: queryWord}]})
        .then(res => {
          Message({
            type: 'success',
            message: `成功添加 ${queryWord} 为否定关键词`
          })
        })
    },
    switchToCampaignReport(campaign) {
      this.$emit('switch-to-campaign-report', campaign)
    },
    async onChangePrice(userPrice, cid, kid) {
      const price = (userPrice ? toFloat(userPrice) : 0) * 100
      if (price > 99 * 100 || price < 2 * 100) {
        return this.$message.error('价格需在2-99元之间')
      }
      try {
        this.priceUpdating = true
        await updateCampaign(cid, {updatedKeywords: [{price, id: kid}]})
        this.$message.success(`价格更新成功`)
      } finally {
        this.priceUpdating = false
      }
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
    f2y
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
