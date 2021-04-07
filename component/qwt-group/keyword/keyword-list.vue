<template>
  <div class="keyword-list">
    <el-table :data="rows">
      <el-table-column label="关键词" key="word">
        <template slot-scope="{ row }">
          <span>{{ row.word }}</span>
          <span class="new-word" v-if="row.isNew">(新)</span>
          <span class="del-word" v-if="row.isDel">(删除)</span>
          <span class="updated-word" v-if="row.isUpdated">(修改)</span>
          <span
            class="good-word"
            v-if="RECOMMAND_SOURCES.includes(row.recommandSource)"
          >
          (好词)
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="电脑端排名"
        key="cpcRanking"
        v-if="showPropRanking"
        :formatter="(r) => fmtCpcRanking(r.cpcRanking || -1)"
      />
      <el-table-column
        label="手机端排名"
        key="mobileCpcRanking"
        :formatter="(r) => fmtCpcRanking(r.mobileCpcRanking || -1)"
      />
      <el-table-column key="status">
        <table-header-tip
          slot="header"
          label-html="关键词状态"
          :tip-html="keywordStatusTip"
        />
        <div slot-scope="{ row }">
          <el-tooltip
            v-if="row.status === KEYWORD_CHIBI_REJECT"
            placement="top"
            effect="dark"
            :content="getRefuseReason(row)"
          >
            <span>
              <span style="color: #ff3c3c">{{ fmtStatus(row) }}</span>
              <i class="error el-icon-question pointer" />
            </span>
          </el-tooltip>
          <label v-else>{{ fmtStatus(row) }}</label>
        </div>
      </el-table-column>
      <el-table-column key="price" min-width="220">
        <!-- 删除 slot-scope 后会有稀奇古怪的问题 -->
        <!-- eslint-disable-next-line -->
        <div slot="header" slot-scope="col">
          <table-header-tip
            :label-html="maxPriceLabel"
            :tip-html="cpcTopPriceTip"
          />
          <el-popover placement="top" v-model="pricePopoverVisible">
            <div>
              <el-input
                placeholder="请输入关键词价格"
                v-model="keywordPrice"
                size="mini"
              />
              <div class="actions">
                <el-button size="mini" @click="pricePopoverVisible = false">
                  取消
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="changeAllWordPrice"
                >
                确定
                </el-button>
              </div>
            </div>
            <a href="javascript:;" slot="reference" class="price-action">
              批量改价
            </a>
          </el-popover>
        </div>
        <div slot-scope="{ row }">
          <span class="price">
            <bax-input
              placeholder="单位，元"
              :value="$formatter.f2y(row.price)"
              @blur="(v) => setCustomPrice(row, v)"
              @keyup="(v) => setCustomPrice(row, v)"
            />
            <span v-if="showAddPrice(row)" class="add-w-price">
              <button @click="bumpPriceBy20(row)">提价20%</button>
              <label>获得更高排名</label>
            </span>
            <label v-if="!isValidPrice(row)">{{ keywordPriceTip }}</label>
          </span>
        </div>
      </el-table-column>
      <el-table-column key="matchType" min-width="220">
        <!-- eslint-disable-next-line -->
        <div slot="header" slot-scope="col">
          <table-header-tip
            :label-html="matchTypeLabel"
            :tip-html="matchTypeTip"
          />
          <el-popover placement="top" v-model="matchTypePopVisible">
            <div>
              <el-radio-group
                v-model="matchType"
                placeholder="请选择匹配模式"
                size="mini"
              >
                <el-radio
                  class="match-radio"
                  v-for="item in MATCH_TYPE_OPTS.slice(0,MATCH_TYPE_OPTS.length - 1)"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
              <div class="actions">
                <el-button size="mini" @click="matchTypePopVisible = false">
                  取消
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="changeAllMatchType"
                >
                  确定
                </el-button>
              </div>
            </div>
            <a href="javascript:;" slot="reference" class="price-action">
              批量修改
            </a>
          </el-popover>
        </div>
        <div slot-scope="{ row }" class="match-type">
          <el-select
            :value="row.matchType"
            placeholder="请选择匹配模式"
            size="small"
            class="match-type-select"
            @change="(v) => emitUpdateKeyword({ ...row, matchType: v })"
          >
            <el-option
              v-for="item in MATCH_TYPE_OPTS"
              :key="item.value"
              :label="item.label"
              :disabled="
                String(item.value) === String(MATCH_TYPE_EXACT) &&
                matchTypeRemainExactCount <= 0
              "
              :value="item.value"
            />
          </el-select>
        </div>
      </el-table-column>
      <el-table-column label="操作" key="deletable">
        <div slot-scope="{ row }">
          <el-button
            type="danger"
            size="mini"
            @click="emitUpdateKeyword({ ...row, isDel: true }, !!row.isNew)">
            删除
          </el-button>
        </div>
      </el-table-column>
    </el-table>
    <footer>
      <bax-pagination
        :options="pagination"
        @current-change="({ offset }) => (offset = offset)"
      />
    </footer>
  </div>
</template>

<script>
import TableHeaderTip from 'com/common/table-header-tip'
import BaxInput from 'com/common/bax-input'
import BaxPagination from 'com/common/pagination'

import { changeCampaignKeywordsPrice, changeCampaignKeywordsMatchType } from 'api/fengming'

import { fmtCpcRanking } from 'util/campaign'
import {
  RECOMMAND_SOURCES,
  SEM_PLATFORM_SHENMA,
  keywordStatus,
  KEYWORD_CHIBI_REJECT,
  KEYWORD_STATUS_ONLINE,
  MATCH_TYPE_OPTS,
  MATCH_TYPE_EXACT,
  MATCH_TYPE_PHRASE
} from 'constant/fengming'
import { keywordStatusTip, cpcTopPriceTip, matchTypeTip, keywordPriceTip } from 'constant/tip'
import { MIN_WORD_PRICE, MAX_WORD_PRICE } from 'constant/keyword'
import { toFloat } from 'util/kit'
import track from 'util/track'

const LIMIT = 10

export default {
  name: 'keyword-list',
  props: {
    keywords: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    platform: {
      type: Number,
      required: true
    },
    showPropRanking: {
      type: Boolean,
      default: true
    },
    groupOffline: {
      type: Boolean,
      default: false
    },
    groupOnline: {
      type: Boolean,
      default: true
    },
    groupId: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    maxPriceLabel () {
      if (this.platform === SEM_PLATFORM_SHENMA) return '移动端出价(元/次点击)'
      return '电脑端最高出价(元/次点击)'
    },
    matchTypeLabel () {
      return `匹配方式(可设置<b style="color: #ff6350">${this.matchTypeRemainExactCount}</b>个精准匹配)`
    },
    rows () {
      const { currentPage } = this
      const start = currentPage * LIMIT
      return this.keywords.slice(start, start + LIMIT)
    },
    currentPage () {
      return this.offset / LIMIT | 0
    },
    pagination () {
      return {
        limit: LIMIT,
        offset: this.offset,
        total: this.keywords.length
      }
    }
  },
  mounted () {
    // TODO: 根据单元id获取关键词详情
  },
  data () {
    return {
      offset: 0,
      keywordPrice: '',
      matchType: MATCH_TYPE_PHRASE,
      matchTypeRemainExactCount: 0,

      pricePopoverVisible: false,
      matchTypePopVisible: false,

      // 常量
      keywordStatusTip,
      cpcTopPriceTip,
      keywordPriceTip,
      matchTypeTip,
      KEYWORD_CHIBI_REJECT,
      RECOMMAND_SOURCES,
      MATCH_TYPE_OPTS,
      MATCH_TYPE_EXACT
    }
  },
  methods: {
    fmtCpcRanking,
    fmtStatus (row) {
      if (this.groupOffline) return '-'
      return keywordStatus[String(row.status)] || '未知'
    },
    getRefuseReason (word) {
      const { refuseReason } = word.extra
      return (typeof refuseReason === 'string' ? refuseReason : refuseReason.message) || '审核驳回'
    },
    showAddPrice (row) {
      // tip 过去24小时排名低于5或无排名的，在线的 keyword，在线的 campaign
      const { cpcRanking, mobileCpcRanking, isPriceChanged, status: keywordStatus } = row
      // tip 电脑端和手机端任意一端排名大于5或者无排名
      let rankingLow = false
      if (this.platform === SEM_PLATFORM_SHENMA) {
        rankingLow = mobileCpcRanking > 5 || mobileCpcRanking <= 0
      } else {
        rankingLow = (cpcRanking > 5 || cpcRanking <= 0) || (mobileCpcRanking > 5 || mobileCpcRanking <= 0)
      }
      const show = keywordStatus === KEYWORD_STATUS_ONLINE && this.groupOnline && !isPriceChanged && rankingLow
      if (show) {
        track({
          action: 'pv: bump-price-by-20'
        })
      }
      return show
    },
    setCustomPrice (item, v) {
      const price = (v ? toFloat(v) : 0) * 100
      this.emitUpdateKeyword({ item, price })
    },
    bumpPriceBy20 (row) {
      track({
        action: 'click-button: bump-price-by-20'
      })
      this.setCustomPrice(row, this.$formatter.f2y(row.price * 1.2))
    },
    isValidPrice (row) {
      const finalPrice = row.price
      return finalPrice >= MIN_WORD_PRICE && finalPrice <= MAX_WORD_PRICE
    },
    emitUpdateKeyword (newWord, isRemove = false) {
      const idx = this.keywords.findIndex(o => o.word === newWord.word)
      if (idx === -1) return
      if (isRemove) {
        return this.$emit('remove-keywords', idx)
      }
      const keywords = this.keywords
        .slice(0, idx)
        .concat([newWord], this.keywords.slice(idx + 1))

      this.$emit('update-keywords', keywords)
    },
    emitUpdateKeywords (changeTag = 'price', val) {
      const keywords = this.keywords.map(o => ({
        ...o,
        [changeTag]: val
      }))
      this.$emit('update-keywords', keywords)
    },
    async changeAllWordPrice () {
      const keywordPrice = this.keywordPrice.trim()
      if (!keywordPrice) return
      const price = keywordPrice * 100
      if (price < MIN_WORD_PRICE || price > MAX_WORD_PRICE) {
        return this.$message.error(`关键词有效出价区间为[${MIN_WORD_PRICE / 100}, ${MAX_WORD_PRICE / 100}]元，请调整出价`)
      }

      this.emitUpdateKeywords('price', price)
      this.$emit('update-origin-keywords', 'price', price)
      await changeCampaignKeywordsPrice(this.groupId, price)

      this.$message.success('关键词批量改价成功')
    },
    async changeAllMatchType () {
      const matchType = this.matchType

      this.emitUpdateKeyword('matchType', matchType)
      this.$emit('update-origin-keywords', 'matchType', matchType)
      await changeCampaignKeywordsMatchType(this.groupId, matchType)
      this.$message.success('匹配方式批量修改成功')
    }
  },
  components: {
    TableHeaderTip,
    BaxInput,
    BaxPagination
  }
}
</script>

<style lang="scss" scoped>
.keyword-list {
  margin-top: 20px;
  max-width: 1150px;
  .new-word {
    color: $c-main;
    font-size: 12px;
  }
  .del-word {
    color: $c-main;
    font-size: 12px;
  }
  .updated-word {
    color: $c-success;
    font-size: 12px;
  }
  .good-word {
    color: $c-main;
    font-size: 12px;
  }
  .price-action {
    font-size: 13px;
    font-weight: 300;
    color: $c-main;
  }
  .price,
  .match-type {
    & > .match-type-select {
      & /deep/ .el-input {
        width: 120px;
      }
    }
  }
}

.actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  & .el-button {
    margin-left: 6px;
  }
}
.match-radio {
  display: block;
  margin-bottom: 10px;
}
</style>
