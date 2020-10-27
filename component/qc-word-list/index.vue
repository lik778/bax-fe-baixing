<template>
  <div class="page">
    <header>查词记录</header>
    <!-- 搜索表单 -->
    <el-form class="query-form" :inline="true" :model="query" label-width="80px">
      <el-form-item label="核心词">
        <el-input
          v-model="query.coreWord"
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
      <el-table-column label="查询日期" width="160" :formatter="({createdTime}) => $formatter.date(createdTime)" />
      <el-table-column label="核心词" prop="coreWord" width="160" />
      <el-table-column label="推广地区" prop="provinces" :formatter="({ provinces }) => $formatter.join(provinces)" />
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <catch-error>
            <span :class="isExpandWordStatusError(row.status) ? 'error' : ''">{{getEWStatusWith('value', row.status).label}}</span>
            <template v-if="isExpandWordStatusError(row.status)">
              <el-tooltip placement="top" :content="row.reason || '失败原因未知'">
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
      :keyword="safeSelectedItem.coreWord"
      :provinces="safeSelectedItem.provinces"
      @onClose="visible.paymentDialog = false"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'

import PaymentDialog from './payment-dialog'

import { orderServiceHost, preKeywordPath } from 'config'
import {
  isExpandWordStatusError,
  getEWStatusWith,
  EW_OPTIONS
} from 'constant/qianci'
import { createPreOrder, getKeywordsList } from 'api/qianci'
import { parseQuery, normalize, formatReqQuery, getCnName } from 'util'
import { normalizeRoles } from 'util/role'

export default {
  name: "qc-word-list",
  components: {
    PaymentDialog
  },
  props: {
    allAreas: Array,
    userInfo: Object,
  },
  data() {
    return {
      isExpandWordStatusError,
      getEWStatusWith,
      query: {
        coreWord: '',
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
        userId: null,
        salesId: null
      },
      options: {
        wordStatus: [
          { label: '所有状态', value: '' },
          ...EW_OPTIONS,
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
  created() {
    const query = parseQuery(window.location.search)
    this.store.userId = query.user_id
    this.store.salesId = query.sales_id
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
        salesId: this.store.salesId,
        ...formatReqQuery(this.query),
      }
      const { content = [], totalElements = 0 } = (await getKeywordsList(query)) || {}
      this.queryList = content.map(x => ({
        ...x,
        provinces: x.provinces.map(x => getCnName(x, this.allAreas))
      }))
      this.pagination = {
        ...this.pagination,
        current: page,
        total: totalElements,
      }
    },
    // 生成付款 URL
    async genPaymentURL(item) {
      const { data: preTradeId } = await createPreOrder({
        promoteId: item.id,
        // targetUserId: this.store.userId
      })
      if (this.isUser('BAIXING_SALES')) {
        return `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}`
      }
      if (this.isUser('AGENT_ACCOUNTING')) {
        location.href = `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}&agentId=${this.userInfo.id}`
        }
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
      const search = window.location.search
        ? window.location.search + `&promoteId=${id}`
        : `?promoteId=${id}`
      this.$router.push(`/main/qc/keyword-list` + search)
    },
    goEditWordsPage(row) {
      const { id } = row
      this.$router.push({ name: 'qc-query-price', query: { ...this.$route.query, id } })
    },
    resetQuery() {
      this.query = {
        coreWord: '',
        status: '',
        date: '',
      }
      this.getQueryListWithTip(0)
    },

    /*********************************************************** calculation */

    enableCheckButton(status) {
      return [
        ...getEWStatusWith('label', '待支付').value
      ].includes(status)
    },
    enableEditButton(status) {
      return [
        ...getEWStatusWith('label', '拓词失败').value,
      ].includes(status)
    },
    enablePayButton(status) {
      return [
        ...getEWStatusWith('label', '待支付').value
      ].includes(status)
    },
    isUser(role) {
      return normalizeRoles(this.userInfo.roles).includes(role)
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
