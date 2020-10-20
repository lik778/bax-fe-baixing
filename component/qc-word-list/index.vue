<template>
  <div class="page">
    <header>查词记录</header>
    <!-- 搜索表单 -->
    <el-form class="query-form" :inline="true" :model="query" label-width="60px">
      <el-form-item label="核心词">
        <el-input
          v-model="query.keyword"
          placeholder="请输入核心词"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" placeholder="所有状态" clearable>
          <el-option
            v-for="item in options.wordStatus"
            :label="item.label"
            :value="item.value"
            :key="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="actions" label="">
        <el-button
          class="query-button"
          type="primary"
          @click="() => getQueryListWithTip()"
        >查询</el-button>
        <el-button
          class="reset-button"
          type="primary"
          plain
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table class="query-table" border :data="queryList">
      <el-table-column label="查询日期" prop="createdAt"  width="160" :formatter="({ createdAt }) => $formatter.date(createdAt)" />
      <el-table-column label="核心词" prop="word" width="160" />
      <el-table-column label="推广地区" prop="provinces" :formatter="({ provinces }) => $formatter.join(provinces)" />
      <el-table-column label="状态" prop="status">
        <template slot-scope="{row}">
          <catch-error>
            <span :class="getExpandingWordStatusWith('value', row.status).uiClass">{{getDisplayExpandingWordStatusWith('value', row.status).label}}</span>
            <template v-if="isExpandingWordStatusDisplayError(row.status)">
              <el-tooltip placement="top" :content="row.reason">
                <i class="error el-icon-question pointer" />
              </el-tooltip>
            </template>
          </catch-error>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button
            class="info no-padding"
            type="text"
            :disabled="!enableCheckButton(row.status)"
            @click="() => goPreferredWordsListPage(row)">查看</el-button>
          <el-button
            class="info no-padding"
            type="text"
            :disabled="!enableEditButton(row.status)"
            @click="() => goEditWordsPage(row)">修改</el-button>
          <el-button
            class="tip no-padding"
            type="text"
            :disabled="!enablePayButton(row.status)"
            @click="() => showPaymentDialog(row)">去抢购</el-button>
          <div class="page-button-group-safe-padding" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagniation"
      layout="total,sizes,prev,pager,next"
      :total="pagination.total"
      :page-size="pagination.size"
      :page-sizes="pagination.sizes"
      :current-page="pagination.current"
      @current-change="getQueryListWithTip"
      @size-change="handleSizeChange"
    />
    <!-- 支付弹窗 -->
    <payment-dialog
      v-model="visible.paymentDialog"
      :url="active.selectedItemURL"
      :keyword="safeSelectedItem.word"
      :provinces="safeSelectedItem.provinces"
      @onClose="visible.paymentDialog = false"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'

import PaymentDialog from './payment-dialog'

import { orderServiceHost, preKeywordPath } from 'config'
import { expandingWordStatusMap, getExpandingWordStatusWith, getDisplayExpandingWordStatusWith, isExpandingWordStatusDisplayError, expandingWordDisplayStatusOptions } from 'constant/qianci'
import { createPreOrder, getKeywordsList } from 'api/qianci'
import { parseQuery, normalize, formatReqQuery, getCnName } from 'util'

export default {
  name: "qc-word-list",
  components: {
    PaymentDialog
  },
  props: {
    salesInfo: Object,
  },
  data() {
    return {
      getExpandingWordStatusWith,
      getDisplayExpandingWordStatusWith,
      isExpandingWordStatusDisplayError,
      query: {
        keyword: '',
        status: '',
        date: '',
      },
      pagination: {
        current: 1,
        total: 0,
        size: 15,
        sizes: [10, 15, 30, 50],
      },
      queryList: [],
      active: {
        selectedItem: null,
        selectedItemURL: '',
      },
      store: {
        saleId: null,
        userId: null,
      },
      options: {
        wordStatus: [
          { label: '所有状态', value: '' },
          ...expandingWordDisplayStatusOptions,
        ]
      },
      visible: {
        paymentDialog: false
      }
    }
  },
  computed: {
    safeSelectedItem() {
      return this.active.selectedItem || {}
    },
  },
  mounted() {
    this.getQueryList()
  },
  methods: {
    handleSizeChange(size) {
      this.pagination.size = size
      this.getQueryListWithTip()
    },
    async getQueryListWithTip(...args) {
      await this.getQueryList(...args)
      if (this.queryList) {
        this.$message({
          message: '数据获取成功',
          type: 'success'
        })
      }
    },
    async getQueryList(page = 1) {
      const query = {
        page: page - 1,
        size: this.pagination.size,
        ...formatReqQuery(normalize({
          coreWord: ['keyword']
        }, this.query )),
      }
      const { data, total } = (await getKeywordsList(query)) || {}
      this.queryList = data.map(x => x)
      this.pagination = {
        ...this.pagination,
        current: page,
        total,
      }
    },
    // 生成付款 URL
    async genPaymentURL(item) {
      const { salesId, userId } = this.salesInfo || {}
      const preTradeId = await createPreOrder()
      // if (this.isUser('BAIXING_SALES')) {
      //   return `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}`
      // }
      // if (this.isUser('AGENT_ACCOUNTING')) {
      //   location.href = `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}&agentId=${this.userInfo.id}`
      // }
      return `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}`
    },

    /*********************************************************** ux */

    selectItem(item) {
      this.active.selectedItem = item
    },
    async showPaymentDialog(item) {
      this.selectItem(item)
      this.visible.paymentDialog = true

      const url = await this.genPaymentURL(item)
      this.active.selectedItemURL = url
    },
    goPreferredWordsListPage(item) {
      const { id } = item || {}
      this.selectItem(item)
      this.$router.push({
        name: 'qc-keyword-list',
        params: { id }
      })
    },
    resetQuery() {
      this.query = {
        keyword: '',
        status: '',
        date: '',
      }
      this.getQueryListWithTip(0)
    },
    goEditWordsPage(row) {
      this.$router.push({
        name: 'qc-query-price',
        params: {
          id: row.id
        }
      })
    },

    /*********************************************************** calculation */

    enableCheckButton(status) {
      const p = expandingWordStatusMap
      return [
        p.EXPANDING_WORD_SUCCEED,
        p.PENDING_PAYMENT,
        p.UNPAID,
        p.PAID,
        p.UNPAID_EXPIRED,
        p.PAYMENT_EXPIRED
      ].includes(+status)
    },
    enableEditButton(status) {
      const p = expandingWordStatusMap
      return [
        p.EXPANDING_WORD_FAILED,
        p.B2B_AUDIT_FAILED
      ].includes(+status)
    },
    enablePayButton(status) {
      const p = expandingWordStatusMap
      return [
        p.EXPANDING_WORD_SUCCEED,
        p.PENDING_PAYMENT
      ].includes(+status)
    }
  }
}
</script>

<style lang="postcss" scoped>
.query-form {
  margin-top: 18px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;

  & .el-form-item {
    margin-bottom: 0;
  }

  & .actions {
    /* display: block; */
    /* margin-bottom: 0; */

    & >>> .el-form-item__label {
      opacity: 0;
    }
  }
}

.query-table {
  margin-top: 18px;
}

.pagniation {
  margin-top: 1em;
}

/* 防止按钮被页面右下角按钮（如扫码关注按钮）掩盖 */
.page-button-group-safe-padding {
  width: 45px;
}
</style>
