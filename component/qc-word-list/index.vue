<template>
  <div class="page">
    <header>查词记录</header>
    <!-- 搜索表单 -->
    <el-form class="query-form" :inline="true" :model="query" label-width="60px" @submit.native.prevent="() => getQueryListWithTip()">
      <el-form-item label="核心词">
        <el-input v-model="query.keyword" placeholder="请输入核心词" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" placeholder="所有状态" clearable>
          <el-option
            v-for="(v, k) in options.wordStatus"
            :label="v"
            :value="k"
            :key="k"
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
      <el-table-column label="查询日期" prop="createdAt"  width="160" :formatter="dateFormatter" />
      <el-table-column label="核心词" prop="word" width="160" />
      <el-table-column label="推广地区" prop="areas">
        <template slot-scope="{row}">
          <span>{{row.areas.join('、')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="{row}">
          <el-tooltip
            v-if="row.note"
            popper-class="city-tooltip"
            class="item"
            effect="light"
            placement="top"
            :content="row.note" >
              <el-tag v-if="!row.isExpired" :type="mapStatusToUIType(row)">
                {{row.status}}
              </el-tag>
          </el-tooltip>
          <el-tag v-else :type="mapStatusToUIType(row)">
            {{row.status}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="() => goPreferredWordsListPage(row)">查看</el-button>
          <el-button type="text" size="small" @click="() => goEditWordsPage(row)">修改</el-button>
          <el-button type="text" size="small" @click="() => showPaymentDialog(row)">去抢购</el-button>
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
      :areas="safeSelectedItem.areas"
      @onClose="visible.paymentDialog = false"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'

import PaymentDialog from './payment-dialog'

import { getKeywordsList } from 'api/qianci'
import { parseQuery, formatReqQuery, getCnName } from 'util'

export default {
  name: "qc-word-list",
  components: {
    PaymentDialog
  },
  props: {
    allAreas: Array
  },
  data() {
    return {
      query: {
        keyword: '',
        status: '',
        date: '',
      },
      pagination: {
        current: 0,
        total: 0,
        size: 20,
        sizes: [10, 20, 50, 100],
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
        wordStatus: []
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
    canPayForWords() {
      return this.store.saleId && this.store.userId
    }
  },
  created() {
    const query = parseQuery(window.location.search)
    const { saleId, userId } = query
    this.store = { saleId, userId }
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
    async getQueryList(page = 0) {
      const query = {
        size: this.pagination.size,
        page,
        ...formatReqQuery(this.query, {
          // date: val => val && +new Date(this.query.date)
        }),
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
    initPaymentURL(item) {
      return 'www.baidu.com'
    },

    /*********************************************************** ux */

    selectItem(item) {
      this.active.selectedItem = item
    },
    showPaymentDialog(item) {
      this.selectItem(item)
      this.visible.paymentDialog = true

      const url = this.initPaymentURL(item)
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

    mapStatusToUIType(row) {
      const { status, auditStatus } = row
      return 'normal'
    },

    dateFormatter({createdAt}) {
      return dayjs(createdAt * 1000).format('YYYY-MM-DD HH:MM')
    }
  }
}
</script>

<style lang="postcss" scoped>
.query-form {
  margin-top: 18px;
  padding: 16px;
  background: #eff2f7;
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
