<template>
  <div class="page">
    <header>我的推广计划</header>
    <!-- 搜索表单 -->
    <el-form class="query-form" :inline="true" :model="query" label-width="60px" @submit.native.prevent="() => getQueryListWithTip()">
      <el-form-item label="核心词">
        <el-input
          v-model="query.keyword"
          placeholder="请输入核心词"
          suffix-icon="el-icon-search"
        />
      </el-form-item>
      <div />
      <el-form-item label="状态">
        <el-checkbox-group v-model="query.status">
          <el-checkbox
            v-for="(v, k) in options.wordStatus"
            :label="v"
            :value="k"
            :key="k"
          />
        </el-checkbox-group>
      </el-form-item>
      <div />
      <el-form-item class="actions" label=" ">
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
      <el-table-column label="核心词" prop="word" width="160" />
      <el-table-column label="推广地区" prop="areas">
        <template slot-scope="{row}">
          <span>{{row.areas.join('、')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台" prop="plat" :formatter="platformFormatter" />
      <el-table-column label="投放状态">
        <template slot-scope="{row}">
          <el-tag :type="mapAuditStatusToType(row)">
            {{row.status}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="{row}">
          <el-tag :type="mapAuditStatusToType(row)">
            {{row.status}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="购买日期" prop="buyAt" :formatter="dateFormatter" />
      <el-table-column label="剩余投放天数" prop="expired" :formatter="restDayFormatter" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="() => goEditCreativePage(row)">修改</el-button>
          <el-button type="text" size="small" @click="() => goChartPage(row)">查看状态</el-button>
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
  </div>
</template>

<script>
import dayjs from 'dayjs'

import { getKeywordsList } from 'api/qianci'
import { parseQuery, formatReqQuery, getCnName } from 'util'

export default {
  name: "qc-promote-list",
  props: {
    allAreas: Array
  },
  data() {
    return {
      query: {
        keyword: '',
        status: [],
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
        // wordStatus: [
        //   { label: '待设置', value: '待设置' },
        //   { label: '待投放', value: '待投放' },
        //   { label: '已下线', value: '已下线' },
        //   { label: '待审核', value: '待审核' },
        //   { label: '审核中', value: '审核中' },
        //   { label: '审核通过', value: '审核通过' },
        //   { label: '审核驳回', value: '审核驳回' },
        // ]
        wordStatus: [
          '待设置',
          '待投放',
          '已下线',
          '待审核',
          '审核中',
          '审核通过',
          '审核驳回',
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
    goChartPage({ id }) {
      this.$router.push({
        name: 'qc-dashboard',
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
    goEditCreativePage(row) {
      this.$router.push({
        name: 'qc-creative',
        params: {
          id: row.id
        }
      })
    },

    /*********************************************************** calculation */

    platformFormatter({ plat }) {
      switch (plat) {
        case 'pc': return '电脑'
        case 'mobile': return '手机'
        default: return '未知'
      }
    },
    mapAuditStatusToType(row) {
      const { auditStatus } = row
      return 'normal'
    },
    dateFormatter({buyAt}) {
      return dayjs(buyAt * 1000).format('YYYY-MM-DD HH:MM')
    },
    restDayFormatter() {
      return '180'
    },
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

  & .el-form-item {
    margin-top: 1em;
  }
  & .el-form-item:first-child {
    margin-top: 0;
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
