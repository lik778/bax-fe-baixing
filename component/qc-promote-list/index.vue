<template>
  <div class="page">
    <header>我的推广计划</header>
    <!-- 搜索表单 -->
    <el-form
      class="query-form"
      :inline="true"
      :model="query"
      label-width="80px"
    >
      <el-form-item label="核心产品">
        <el-input
          v-model="query.coreWord"
          placeholder="请输入核心产品"
          suffix-icon="el-icon-search"
        />
      </el-form-item>
      <el-form-item label="计划状态">
        <el-select v-model="query.status" placeholder="请选择计划状态">
          <el-option key="全部" label="全部" value="" />
          <el-option
            v-for="(value, key) in PROMOTE_STATUS_MAPPING"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="query.auditStatus" placeholder="请选择审核状态">
          <el-option key="全部" label="全部" value="" />
          <el-option
            v-for="(item, index) in AUDIT_STATUS_OPTIONS"
            :key="index"
            :label="item.label"
            :value="item.values"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" plain @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button class="go-chart-page-btn" type="primary" @click="goChartPage"
      >查看计划报表</el-button
    >
    <!-- 列表 -->
    <el-table class="query-table" border :data="queryList">
      <el-table-column label="核心产品" prop="coreWords" width="160">
        <template slot-scope="{ row }">
          <a
            class="link-btn"
            @click="
              $router.push({
                name: 'qc-keyword-list',
                query: { promoteId: row.id, ...$route.query },
              })
            "
          >
            {{ row.coreWords.join(',') }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="推广地区"
        :formatter="({ provinces }) => $formatter.join(provinces)"
      />
      <el-table-column
        label="平台"
        prop="plat"
        :formatter="({ device }) => DEVICE[device]"
      />
      <el-table-column label="计划状态">
        <template slot-scope="{ row }">
          <catch-error>
            <span>{{ PROMOTE_STATUS[row.status] }}</span>
          </catch-error>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" min-width="200">
        <template slot-scope="{ row }">
          <catch-error>
            <div v-if="showAuditFailReason(row.auditStatus)">
              <el-tooltip
                placement="top"
                :content="row.lastFailedReason || '失败原因未知'"
              >
                <span>
                  <span style="color: #ff3c3c">{{
                    getPromoteAuditStatus('values', row.auditStatus).label
                  }}</span>
                  <i class="error el-icon-question pointer" />
                </span>
              </el-tooltip>
            </div>
            <span v-else>{{
              getPromoteAuditStatus('values', row.auditStatus).label
            }}</span>
          </catch-error>
        </template>
      </el-table-column>
      <el-table-column
        label="购买日期"
        :formatter="({ createdTime }) => $formatter.date(createdTime)"
      />
      <el-table-column label="剩余投放天数" prop="remainDays" />
      <el-table-column label="操作" width="160">
        <template slot-scope="{ row }">
          <el-button
            :disabled="!(userInfo.shAgent && canEditPromote(row.status))"
            :loading="checkButtonLoading(row)"
            type="text"
            size="small"
            @click="() => goEditCreativePage(row)"
            >编辑</el-button
          >
          <el-button
            :disabled="
              !(userInfo.shAgent && canGotoSeo(row.seoPromoteStatus)) ||
              promoteStatusDisabled(row.status)
            "
            type="text"
            size="small"
            @click="() => gotoSeo(row.id, row.seoType)"
          >
            <span v-if="row.seoType === SEO_WAN_CI_91">管理SEO</span>
            <span v-else>管理店铺</span>
          </el-button>
          <div class="page-button-group-safe-padding" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagniation"
      layout="total,prev,pager,next"
      :total="pagination.total"
      :page-size="pagination.size"
      @current-change="handleCurrentPage"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  DEVICE,
  PROMOTE_STATUS_MAPPING,
  PROMOTE_STATUS,
  PROMOTE_STATUS_PENDING_EDIT,
  PROMOTE_STATUS_ON_PROMOTE,
  PROMOTE_STATUS_ONLINE,
  PROMOTE_STATUS_EDITED,
  AUDIT_STATUS_REJECT_B2B,
  AUDIT_STATUS_REJECT_SUPPLIES,
  AUDIT_STATUS_REJECT_SEM,
  AUDIT_STATUS_REJECT_KEYWORD,
  SEO_STATUS_BOUGHT,
  PROMOTE_STATUS_FINISHED,
  PROMOTE_STATUS_CEASED,
  AUDIT_STATUS_OPTIONS,
  getPromoteAuditStatus,
  SEO_WAN_CI_91
} from 'constant/qianci'
import { getBusinessLicense } from 'api/seo'
import { getPromoteList, getWanciSeoRedirect } from 'api/qianci'
import { isPro } from 'config'

export default {
  name: 'qc-promote-list',
  props: {
    salesInfo: Object,
    userInfo: Object
  },
  data () {
    return {
      PROMOTE_STATUS_MAPPING,
      PROMOTE_STATUS,
      AUDIT_STATUS_OPTIONS,
      query: {
        coreWord: '',
        status: '',
        auditStatus: ''
      },
      pagination: {
        total: 0,
        page: 0,
        size: 10
      },
      queryList: [],
      active: {
        selectedItem: null,
        selectedItemURL: ''
      },
      visible: {
        paymentDialog: false
      },
      loading: {
        checkLicense: false
      },
      DEVICE,
      SEO_WAN_CI_91
    }
  },
  mounted () {
    this.getQueryList()
  },
  methods: {
    getPromoteAuditStatus,
    showAuditFailReason (status) {
      return [
        AUDIT_STATUS_REJECT_B2B,
        AUDIT_STATUS_REJECT_SUPPLIES,
        AUDIT_STATUS_REJECT_KEYWORD,
        AUDIT_STATUS_REJECT_SEM
      ].includes(status)
    },
    canEditPromote (status) {
      return [
        PROMOTE_STATUS_PENDING_EDIT,
        PROMOTE_STATUS_EDITED,
        PROMOTE_STATUS_ONLINE,
        PROMOTE_STATUS_ON_PROMOTE
      ].includes(status)
    },
    canGotoSeo (status) {
      return [SEO_STATUS_BOUGHT].includes(status)
    },
    promoteStatusDisabled (status) {
      return [PROMOTE_STATUS_FINISHED, PROMOTE_STATUS_CEASED].includes(status)
    },
    getQueryParams () {
      const params = {}
      Object.keys(this.query).forEach((k) => {
        if (this.query[k]) {
          params[k] = this.query[k]
        }
      })
      return params
    },
    handleCurrentPage (page) {
      this.pagination.page = page - 1
      this.getQueryList(this.getQueryParams(page))
    },
    search () {
      this.pagination.page = 0
      this.getQueryList(this.getQueryParams())
    },
    reset () {
      this.query = {
        coreWord: '',
        auditStatus: '',
        status: ''
      }
    },
    async getQueryList (params) {
      const { sales_id: salesId, user_id: targetUserId } = this.$route.query
      const query = {
        size: this.pagination.size,
        page: this.pagination.page,
        targetUserId,
        salesId,
        ...params
      }
      const { total, content } = await getPromoteList(query)
      this.queryList = content
      this.pagination.total = total
      this.$set(this, 'pagination', this.pagination)
    },
    async checkLicense () {
      let businessUrl = null
      this.loading.checkLicense = true
      try {
        businessUrl = await getBusinessLicense()
      } finally {
        setTimeout(() => (this.loading.checkLicense = false), 300)
      }
      return !!businessUrl
    },
    goChartPage () {
      this.$router.push({ name: 'qc-dashboard' })
    },
    gotoSeo (promoteId, seoType) {
      if (seoType === SEO_WAN_CI_91) {
        const link = getWanciSeoRedirect(promoteId)
        window.open(link)
        return
      }
      const shopLink = isPro
        ? '//shop.baixing.com/management/'
        : '//shop-test.baixing.cn/management/'
      window.open(shopLink)
    },
    async goEditCreativePage (row) {
      this.active.selectedItem = row
      const hasBusinessUrl = await this.checkLicense()
      if (hasBusinessUrl) {
        const id = row.id
        const search = window.location.search
          ? window.location.search + `&promoteId=${id}`
          : `?promoteId=${id}`
        this.$router.push('/main/qc/creative' + search)
      } else {
        this.$msgbox({
          title: '提示',
          confirmButtonText: '前往认证',
          showCancelButton: true,
          cancelButtonText: '取消',
          message: this.$createElement('p', null, [
            this.$createElement(
              'p',
              null,
              '根据《网络安全法》规定，请认证营业执照后再进入计划编辑。'
            ),
            this.$createElement(
              'p',
              null,
              '您尚未提交审核或未通过审核，请进行营业执照认证,如您已经通过认证审核，请关闭本弹窗后重新点击【编辑】。'
            )
          ]),
          beforeClose (action, instance, done) {
            if (action === 'confirm') {
              window.open('https://www.baixing.com/bind/#bindList')
            }
            done()
          }
        }).catch((e) => e)
      }
    },
    checkButtonLoading (row) {
      return this.active.selectedItem === row && this.loading.checkLicense
    },
    restDayFormatter ({ remainDate }) {
      const restDays =
        Math.max(0, dayjs(remainDate * 1000) - dayjs()) / (24 * 60 * 60 * 1000)
      return parseFloat(restDays).toFixed(1)
    }
  }
}
</script>

<style lang="scss" scoped>
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

.link-btn {
  color: #35a5e4;
  cursor: pointer;
}
</style>
