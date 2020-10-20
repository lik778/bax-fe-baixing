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
            v-for="item in options.wordStatus"
            :label="item.label"
            :value="item.value"
            :key="item.label"
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
      <el-table-column label="核心词" prop="coreWord" width="160" />
      <el-table-column label="推广地区" :formatter="({ provinces }) => $formatter.join(provinces)" />
      <el-table-column label="平台" prop="plat" :formatter="({ platform }) => $formatter.mapWith(platform, deviceValueLabelMap)" />
      <el-table-column label="投放状态">
        <template slot-scope="{row}">
          <catch-error>
            <span>{{getPutInStatusWith('value', row.semStatus).label}}</span>
          </catch-error>
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="{row}">
          <catch-error>
            <span :class="getExpandingWordStatusWith('value', row.status).uiClass">{{getDisplayExpandingWordStatusWith('value', row.status).label}}</span>
          </catch-error>
        </template>
      </el-table-column>
      <el-table-column label="购买日期" :formatter="({ tradeDate }) => $formatter.date(tradeDate)" />
      <el-table-column label="剩余投放天数" :formatter="restDayFormatter" />
      <el-table-column label="操作" width="160">
        <template slot-scope="{row}">
          <el-button :loading="checkButtonLoading(row)" type="text" size="small" @click="() => goEditCreativePage(row)">修改</el-button>
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

import {
  getExpandingWordStatusWith,
  getDisplayExpandingWordStatusWith,
  deviceValueLabelMap,
  putInStatusOptions,
  getPutInStatusWith,
  auditStatusOptions,
  getAuditStatusOptions
} from 'constant/qianci'
import  { getBusinessLicense } from 'api/seo'
import { getPromoteList } from 'api/qianci'
import { parseQuery, formatReqQuery, getCnName, normalize } from 'util'

export default {
  name: "qc-promote-list",
  props: {
    salesInfo: Object,
  },
  data() {
    return {
      getExpandingWordStatusWith,
      getDisplayExpandingWordStatusWith,
      deviceValueLabelMap,
      putInStatusOptions,
      getPutInStatusWith,
      auditStatusOptions,
      getAuditStatusOptions,
      query: {
        keyword: '',
        status: [],
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
          ...putInStatusOptions,
          ...auditStatusOptions
        ]
      },
      visible: {
        paymentDialog: false
      },
      loading: {
        checkLicense: false
      },
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
    async getQueryList(page = 1) {
      const { salesId, userId } = this.salesInfo || {}
      const query = {
        page: page - 1,
        size: this.pagination.size,
        userId,
        salesId,
        ...formatReqQuery(normalize({
          coreWord: ['keyword']
        }, this.query), {
          status (vals = []) {
            return vals
              .map(x => getDisplayExpandingWordStatusWith('label', x))
              .reduce((h, c) => (h.push(...c.value), h), [])
          }
        }),
      }
      const { data, total } = (await getPromoteList(query)) || {}
      this.queryList = data.map(x => x)
      this.pagination = {
        ...this.pagination,
        current: page,
        total,
      }
    },
    async checkLicense() {
      let businessUrl = null
      this.loading.checkLicense = true
      try {
        businessUrl = await getBusinessLicense()
      } finally {
        setTimeout(() => this.loading.checkLicense = false, 300)
      }
      return !!businessUrl
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
    async goEditCreativePage(row) {
      this.active.selectedItem = row
      const hasBusinessUrl = await this.checkLicense()
      // const hasBusinessUrl = false
      if (hasBusinessUrl) {
        this.$router.push({
          name: 'qc-creative',
          params: { id: row.id }
        })
      } else {
        this.$msgbox({
          title: '提示',
          confirmButtonText: '前往认证',
          showCancelButton: true,
          cancelButtonText: '取消',
          message: this.$createElement('p', null, [
            this.$createElement('p', null, '根据《网络安全法》规定，请认证营业执照后再进入计划编辑。'),
            this.$createElement('p', null, '您尚未提交审核或未通过审核，请进行营业执照认证,如您已经通过认证审核，请关闭本弹窗后重新点击【编辑】。')
          ]),
          beforeClose(action, instance, done) {
            if (action === 'confirm') {
              window.open('https://www.baixing.com/bind/#bindList')
            }
            done()
          }
        })
      }
    },

    /*********************************************************** calculation */

    checkButtonLoading(row) {
      return this.active.selectedItem === row && this.loading.checkLicense
    },
    platformFormatter({ plat }) {
      switch (plat) {
        case 'pc': return '电脑'
        case 'mobile': return '手机'
        default: return '未知'
      }
    },
    restDayFormatter({ remainDate }) {
      const restDays = Math.max(0, (dayjs(remainDate * 1000) - dayjs())) / (24 * 60 * 60 * 1000)
      return parseFloat(restDays).toFixed(1)
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
