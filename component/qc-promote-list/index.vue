<template>
  <div class="page">
    <header>我的推广计划</header>
    <!-- 搜索表单 -->
    <el-form class="query-form" :inline="true" :model="query" label-width="80px">
      <el-form-item label="核心词">
        <el-input v-model="query.coreWord" placeholder="请输入核心词" suffix-icon="el-icon-search"/>
      </el-form-item>
      <el-form-item label="投放状态">
        <el-select v-model="query.status" placeholder="请选择投放状态">
          <el-option key="全部" label="全部" value=""/>
          <el-option v-for="(value, key) in PROMOTE_STATUS_MAPPING" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="query.auditStatus" placeholder="请选择审核状态">
          <el-option key="全部" label="全部" value=""/>
          <el-option v-for="(value, key) in AUDIT_STATUS_MAPPING" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button class="go-chart-page-btn" type="primary" @click="goChartPage">查看计划报表</el-button>
    <!-- 列表 -->
    <el-table class="query-table" border :data="queryList">
      <el-table-column label="核心词" prop="coreWord" width="160" />
      <el-table-column label="推广地区" :formatter="({ provinces }) => $formatter.join(provinces)" />
      <el-table-column label="平台" prop="plat" :formatter="({ device }) => DEVICE[device]" />
      <el-table-column label="投放状态">
        <template slot-scope="{row}">
          <catch-error>
            <span>{{PROMOTE_STATUS_MAPPING[row.status]}}</span>
          </catch-error>
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="{row}">
          <catch-error>
            <span>{{AUDIT_STATUS_MAPPING[row.auditStatus]}}</span>
          </catch-error>
        </template>
      </el-table-column>
      <el-table-column label="购买日期" :formatter="({ createdTime }) => $formatter.date(createdTime)" />
      <el-table-column label="剩余投放天数" :formatter="restDayFormatter" />
      <el-table-column label="操作" width="160">
        <template slot-scope="{row}">
          <el-button :loading="checkButtonLoading(row)" type="text" size="small" @click="() => goEditCreativePage(row)">修改</el-button>
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
      @current-change="handleCurrentPage"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { DEVICE, AUDIT_STATUS_MAPPING, PROMOTE_STATUS_MAPPING } from 'constant/qianci'
import  { getBusinessLicense } from 'api/seo'
import { getPromoteList } from 'api/qianci'
import { parseQuery, formatReqQuery, debounce, normalize } from 'util'

export default {
  name: "qc-promote-list",
  props: {
    salesInfo: Object,
  },
  data() {
    return {
      PROMOTE_STATUS_MAPPING,
      AUDIT_STATUS_MAPPING,
      query: {
        coreWord: '',
        status: '',
        auditStatus: ''
      },
      pagination: {
        total: 0,
        page: 0,
        size: 15,
      },
      queryList: [],
      active: {
        selectedItem: null,
        selectedItemURL: '',
      },
      visible: {
        paymentDialog: false
      },
      loading: {
        checkLicense: false
      },
      DEVICE
    }
  },
  mounted() {
    this.getQueryList()
  },
  methods: {
    getQueryParams() {
      const params = {}
      Object.keys(this.query).forEach(k => { 
        if (this.query[k]) {  params[k] = this.query[k] }
      })
      return params
    },
    handleCurrentPage(page) {
      this.pagination.page = (page - 1)
      this.getQueryList(this.getQueryParams(page))
    },
    search() {
      this.pagination.page = 0
      this.getQueryList(this.getQueryParams())
    },
    async getQueryList(params) {
      const { sales_id: salesId, user_id: userId } = this.$route.query
      const query = {
        size: this.pagination.size,
        page: this.pagination.page,
        userId,
        salesId,
        ...params
      }
      const { total, content } = await getPromoteList(query)
      this.queryList = content
      this.pagination.total = total
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
    goChartPage() {
      this.$router.push({ name: 'qc-dashboard' })
    },
    async goEditCreativePage(row) {
      this.active.selectedItem = row
      console.log(row)
      const hasBusinessUrl = await this.checkLicense()
      if (hasBusinessUrl) {
        this.$router.push({
          name: 'qc-creative',
          params: { promoteId: row.id }
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
    checkButtonLoading(row) {
      return this.active.selectedItem === row && this.loading.checkLicense
    },
    restDayFormatter({ remainDate }) {
      const restDays = Math.max(0, (dayjs(remainDate * 1000) - dayjs())) / (24 * 60 * 60 * 1000)
      return parseFloat(restDays).toFixed(1)
    }
  },
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
}

.go-chart-page-btn,
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
