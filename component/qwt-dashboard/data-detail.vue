
<template>
  <div class="qwt-dashboard-data-detail">

    <!-- 计划维度表格 -->
    <el-table @sort-change="sortChange" v-if="dimension === DIMENSION_CAMPAIGN" :data="statistics" :key="DIMENSION_CAMPAIGN">
      <el-table-column label="计划ID" prop="campaignId" width="120" />
      <el-table-column label="日期" prop="date" width="140" />
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtChannel(r.channel)" />
      <el-table-column label="设备" width="100"
        :formatter="r => fmtDevice(r.device)" />
      <el-table-column label="展现" prop="shows" width="90" sortable="custom" />
      <el-table-column label="点击" prop="clicks" width="90" sortable="custom" />
      <el-table-column label="点击率" prop="clickRate" width="90">
        <span slot-scope="{row}">
          {{ (row.clickRate * 100).toFixed(2) }}%
        </span>
      </el-table-column>
      <el-table-column label="实扣点击单价" width="160" prop="click_avg_price" sortable="custom"
        :formatter="r => (r.clickAvgPrice / 100).toFixed(2) + '元'" />
      <el-table-column label="消耗" prop="cost" width="120" sortable="custom"
        :formatter="r => (r.cost / 100).toFixed(2) + '元'" />
      <el-table-column label="单元详情" width="140">
        <template slot-scope="scope">
          <p class="link" @click="$emit('switch-to-group-report', scope.row)">
            查看
          </p>
        </template>
      </el-table-column>
    </el-table>

    <!-- 单元维度表格 -->
    <el-table @sort-change="sortChange" v-else-if="dimension === DIMENSION_GROUP" :data="statistics" :key="DIMENSION_GROUP">
      <el-table-column label="计划ID" prop="campaignId" width="140" />
      <el-table-column label="单元ID" prop="groupId" width="140" />
      <el-table-column label="单元名称" prop="groupName" width="140" />
      <el-table-column label="日期" prop="date" width="140" />
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtChannel(r.channel)" />
      <el-table-column label="设备" width="100"
        :formatter="r => fmtDevice(r.device)" />
      <el-table-column label="展现" prop="shows" width="90" sortable="custom" />
      <el-table-column label="点击" prop="clicks" width="90" sortable="custom" />
      <el-table-column label="点击率" prop="clickRate" width="90">
        <span slot-scope="{row}">
          {{ (row.clickRate * 100).toFixed(2) }}%
        </span>
      </el-table-column>
      <el-table-column label="实扣点击单价" prop="click_avg_price" width="160" sortable="custom"
        :formatter="r => (r.clickAvgPrice / 100).toFixed(2) + '元'" />
      <el-table-column label="消耗" width="120" prop="cost" sortable="custom"
        :formatter="r => (r.cost / 100).toFixed(2) + '元'" />
      <el-table-column label="关键词详情" width="140">
        <template slot-scope="scope">
          <p class="link" @click="$emit('switch-to-keyword-report', scope.row)">
            查看
          </p>
        </template>
      </el-table-column>
    </el-table>

    <!-- 关键词维度表格 -->
    <el-table @sort-change="sortChange" v-else-if="dimension === DIMENSION_KEYWORD" :data="statistics" :key="DIMENSION_KEYWORD">
      <el-table-column label="关键词" prop="keyword" width="200" :formatter="fmtKeywordName" />
      <el-table-column label="日期" prop="date" width="140" />
      <el-table-column label="计划ID" prop="campaignId" width="140" />
      <el-table-column label="单元ID" prop="groupId" width="140" />
      <el-table-column label="单元名称" prop="groupName" width="140" />
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtChannel(r.channel)" />
      <el-table-column label="设备" width="100"
        :formatter="r => fmtDevice(r.device)" />
      <el-table-column label="出价" width="100">
        <template slot-scope="scope">
          <template v-if="disableChangePrice(scope.row)">
            <span class="disabled-text">0</span>
          </template>
          <template v-else>
            <span v-if="scope.row.price === null">-</span>
            <bax-input v-else
              :value="f2y(scope.row.price)"
              @blur="v => onChangePrice(v, scope.row)"
              @keyup="v => onChangePrice(v, scope.row)" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="展现" prop="shows" width="90" sortable="custom" />
      <el-table-column label="点击" prop="clicks" width="90" sortable="custom" />
      <el-table-column label="点击率" prop="clickRate" width="90">
        <span slot-scope="{row}">
          {{ (row.clickRate * 100).toFixed(2) }}%
        </span>
      </el-table-column>
      <el-table-column label="实扣点击单价" prop="click_avg_price" width="160" sortable="custom"
        :formatter="r => (r.clickAvgPrice / 100).toFixed(2) + '元'" />
      <el-table-column label="消耗" prop="cost" width="120" sortable="custom"
        :formatter="r => (r.cost / 100).toFixed(2) + '元'" />
      <el-table-column label="排名" width="120"
        :formatter="r => fmtCpcRanking(r.cpcRanking)" />
    </el-table>

    <!-- 搜索词维度表格 -->
    <el-table @sort-change="sortChange" v-else :data="statistics" :key="DIMENSION_SEARCH_KEYWORD">
      <el-table-column label="搜索词" prop="queryWord" width="200" />
      <el-table-column label="日期" prop="date" width="140" />
      <el-table-column label="单元名称" prop="groupName" width="200" />
      <el-table-column label="关键词" prop="keyword" />
      <el-table-column label="计划ID" prop="campaignId" width="140" />
      <el-table-column label="渠道" width="100"
        :formatter="r => fmtChannel(r.channel)" />
      <el-table-column label="设备" width="100"
        :formatter="r => fmtDevice(r.device)" />
      <el-table-column label="展现" prop="shows" width="90" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.channel === SEM_PLATFORM_SOGOU">--</span>
          <span v-else>{{scope.row.shows}}</span>
        </template>
      </el-table-column>
      <el-table-column label="点击" prop="clicks" width="90" sortable="custom" />
      <el-table-column label="点击率" prop="clickRate" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.channel === SEM_PLATFORM_SOGOU">--</span>
          <span v-else>{{(scope.row.clickRate * 100).toFixed(2) + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="消耗" width="120" prop="cost" sortable="custom"
        :formatter="r => (r.costs / 100).toFixed(2) + '元'" />
      <el-table-column label="平均点击价格" prop="click_avg_price" width="160" sortable="custom"
        :formatter="r => (r.clickAvgPrice / 100).toFixed(2) + '元'" />
      <el-table-column min-width="270" fixed="right">
        <span slot="header">操作
          <promotion-keyword-tip />
        </span>
        <div slot-scope="{row}">
          <el-button
            type="text"
            size="small"
            :disabled="row.enableInNegativeWords || row.enableInKeywords || !notAllowNormalUser()"
            @click="addKeyword(row)"
          >添加关键词</el-button>
          <el-button
            v-if="row.channel !== SEM_PLATFORM_SHENMA"
            type="text"
            size="small"
            :disabled="row.enableInNegativeWords || row.enableInKeywords || !notAllowNormalUser()"
            @click="addCampaignNegativeKeyword(row,'plan')"
          >设为计划否词</el-button>
          <el-button
            type="text"
            size="small"
            :disabled="row.enableInNegativeWords || row.enableInKeywords || !notAllowNormalUser()"
            @click="addGroupNegativeKeyword(row,'unit')"
          >设为单元否词</el-button>
          <el-tooltip
            effect="dark"
            v-if="row.enableInNegativeWords || row.enableInKeywords"
            content="该搜索词已存在关键词或否定关键词中，暂不支持添加"
            placement="top-start">
            <i class="el-icon-info" style ="cursor: pointer"></i>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <footer>
      <div class="total" v-if="!!statistics.length && dimension !== DIMENSION_SEARCH_KEYWORD ">
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
    <negativeWordAlone
    :visible="visibleDialog"
    @close="visibleDialog = false"
    @upWord="upWords"
    />
  </div>
</template>

<script>
import BaxPagination from 'com/common/pagination'
import { updateCampaign, updateGroup, getWordAuthority } from 'api/fengming'
import BaxInput from 'com/common/bax-input'
import PromotionKeywordTip from 'com/widget/promotion-keyword-tip'
import qs from 'query-string'
import {
  DIMENSION_CAMPAIGN,
  DIMENSION_GROUP,
  DIMENSION_SEARCH_KEYWORD,
  DIMENSION_KEYWORD
} from 'constant/fengming-report'
import {
  semPlatformCn,
  SEM_PLATFORM_SOGOU,
  isDeletedKeyword,
  SEM_PLATFORM_SHENMA
} from 'constant/fengming'
import {
  fmtCpcRanking
} from 'util/campaign'
import track from 'util/track'
import { toFloat, f2y } from 'util/kit'
import { Message } from 'element-ui'
import { isNormalUser } from 'util/role'
import negativeWordAlone from 'com/common/qwt/negative-word-alone'

const isArray = Array.isArray
export default {
  name: 'qwt-dashboard-data-detail',
  components: {
    BaxPagination,
    BaxInput,
    PromotionKeywordTip,
    negativeWordAlone
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
    },
    userInfo: {
      type: Object,
      require: true
    },
    salesInfo: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      priceUpdating: false,
      DIMENSION_CAMPAIGN,
      DIMENSION_GROUP,
      DIMENSION_KEYWORD,
      DIMENSION_SEARCH_KEYWORD,
      SEM_PLATFORM_SOGOU,
      visibleDialog: false,
      tableItem: {},
      isPlanUnit: '',
      isAllowWord: false,
      SEM_PLATFORM_SHENMA
    }
  },
  methods: {
    upWords (wordType) {
      if (wordType === '') return
      const type = wordType === 'accurate' ? 0 : 1
      if (this.isPlanUnit === 'plan') {
        this.planWordApi(this.tableItem, type)
      } else {
        this.unitWordApi(this.tableItem, type)
      }
    },
    planWordApi (item, matchType = 0) {
      const { query: { user_id: userId } } = this.$route
      const { campaignId, queryWord } = item
      updateCampaign(campaignId, { newNegativeKeywords: [{ word: queryWord, matchType }], userId })
        .then(() => {
          Message({
            type: 'success',
            message: `成功添加 ${queryWord} 为计划否定关键词`
          })
          this.$emit('refresh')
        })
    },
    unitWordApi (item, matchType = 0) {
      const { groupId, queryWord } = item
      const { query: { user_id: userId } } = this.$route
      updateGroup(groupId, { newNegativeKeywords: [{ word: queryWord, matchType }], userId })
        .then(() => {
          Message({
            type: 'success',
            message: `成功添加 ${queryWord} 为单元否定关键词`
          })
          this.$emit('refresh')
        })
    },
    async sortChange ({ column, prop, order }) {
      this.$emit('sortChange', { column, prop, order })
    },
    notAllowNormalUser () {
      const { roles } = this.userInfo
      const { query: { source } } = this.$route
      if (source) {
        return true
      }
      return isNormalUser(roles) && !source
    },
    addKeyword (item) {
      const { groupId, queryWord } = item
      const price = 2 * 100
      const { query: { user_id: userId } } = this.$route
      updateGroup(groupId, { newKeywords: [{ price, word: queryWord }], userId })
        .then(() => {
          Message({
            type: 'success',
            message: `成功添加 ${queryWord} 为关键词`
          })
          this.$emit('refresh')
        })
    },
    addCampaignNegativeKeyword (item, word) {
      if (this.isAllowWord) {
        this.visibleDialog = true
        this.tableItem = item
        this.isPlanUnit = word
      } else {
        this.visibleDialog = false
        this.planWordApi(item)
      }
    },
    addGroupNegativeKeyword (item, word) {
      if (this.isAllowWord) {
        this.visibleDialog = true
        this.tableItem = item
        this.isPlanUnit = word
      } else {
        this.visibleDialog = false
        this.unitWordApi(item)
      }
    },
    async onChangePrice (userPrice, { groupId, keywordId }) {
      const { query: { user_id: userId } } = this.$route
      const price = (userPrice ? toFloat(userPrice) : 0) * 100
      if (price > 99 * 100 || price < 2 * 100) {
        return this.$message.error('价格需在2-99元之间')
      }
      try {
        this.priceUpdating = true
        await updateGroup(groupId, { updatedKeywords: [{ price, id: keywordId }], userId })
        this.$message.success('价格更新成功')
      } finally {
        this.priceUpdating = false
      }
    },
    onClickCustomColumns () {
      track({
        action: 'qwt-dashboard: click set custom columns'
      })
    },
    onCurrentChange (opts) {
      this.$emit('current-change', opts)
    },
    checkVisiable (column) {
      return this.displayColumns.includes(column)
    },
    fmtChannel (c) {
      return semPlatformCn[String(c)] || '未知'
    },
    fmtDevice (a) {
      const m = {
        0: '电脑，手机',
        1: '电脑',
        2: '手机'
      }

      if (!isArray(a)) {
        return m[String(a)]
      }

      return a.map(i => m[String(i)]).join(',')
    },
    disableChangePrice ({ status }) {
      return isDeletedKeyword(+status)
    },
    fmtKeywordName ({ keyword, status, date }) {
      const target = new Date(date).getTime()
      const a = new Date('2022-05-19').getTime()
      const b = new Date('2022-05-20').getTime()
      const isDeleted = isDeletedKeyword(+status)
      const res = (target === a || target === b) ? '' : '（历史词）'
      return isDeleted ? (keyword + res) : keyword
    },
    fmtCpcRanking,
    f2y
  },
  async mounted () {
    const { user_id: userId } = qs.parse(location.search)
    const { data } = await getWordAuthority({ userId })
    this.isAllowWord = data !== 0
  }
}
</script>

<style lang="scss">
.qwt-dashboard-data-detail .link {
  @include center;
  max-width: 70px;
  color: $qwt-c-blue;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
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

.disabled-text {
  color: #ccc;
  cursor: not-allowed;
}
</style>
