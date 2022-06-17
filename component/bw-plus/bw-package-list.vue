<template>
  <div class="bw-plus-plan-list">
    <header>管理推广</header>
    <main>
      <el-form :model="query"
               label-width="100px"
               label-position="left"
               class="search"
               @submit.native.prevent>
        <el-form-item label="关键词">
          <el-input v-model="query.keyword"
                    placeholder="输入关键词查询"
                    style="width: 300px;" />
        </el-form-item>
        <el-form-item label="客户公司">
          <el-input v-model="query.customerName"
                    placeholder="输入公司名称查询"
                    style="width: 300px;" />
        </el-form-item>
        <el-form-item label="客户id">
          <el-input v-model="query.customerId"
                    placeholder="输入客户id查询"
                    style="width: 300px;" />
        </el-form-item>
          <el-form-item label="词包id">
          <el-input v-model="query.packageId"
                    placeholder="输入词包id查询"
                    style="width: 300px;" />
        </el-form-item>
      </el-form>

      <div v-for="item in promotes" :key="item.packageId">
        <div class="table-titles" >
          <ul>
            <li>词包id：{{item.packageId}}</li>
            <li>关键词：
               <el-tooltip  effect="dark"  :content="keywordsFormater(item.keywords).detail" placement="top">
                  <el-button  style="backgroundColor:#FFF1E4;border:0;fontSize:13px;padding:0;">{{ keywordsFormater(item.keywords).text }}</el-button>
              </el-tooltip>
            </li>
            <li>所选城市：
              <el-tooltip  effect="dark"  :content="citiesFormater(item.cities).detail" placement="top">
                  <el-button style="backgroundColor:#FFF1E4;border:0;fontSize:13px;padding:0;">{{ citiesFormater(item.cities).text }}</el-button>
              </el-tooltip>
            </li>
            <li>客户公司：{{item.customerName}}</li>
            <li>客户id：{{item.customerId}}</li>
          </ul>
          <el-button type="text" v-if="isRolesId(userInfo.roles, userInfo.agentId) && item.skuList.some(cur => cur.skuId === 301)" @click="renew(item)">续费</el-button>
        </div>
        <el-table
            :data="item.skuList"
            class="table"
            border
            :cell-style="cellStyle"
            :header-cell-style="headerCellStyle"
            style="width: 100%">
            <el-table-column
              label="项目名称"
              min-width="380"
              class-name="project-name"
              >
              <template slot-scope="{row}">
                <div class="project-name">
                  <img :src="row.logoImageUrl" alt="logo">
                  <span>{{row.name}}</span>
                  <template v-if="row.displayType === 0">
                    <span>&nbsp;|&nbsp;{{ DEVICE[row.device] }}&nbsp;|</span>
                    <span>&nbsp;{{ SCHEDULE_TYPE[row.scheduleType] }}</span>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :formatter="({ totalDays }) =>  `${totalDays}天`"
              label="时长"
              min-width="100"
              >
            </el-table-column>
            <el-table-column
              prop="auditStatus"
              :formatter="({ skuId, auditStatus }) =>  skuId === 301 ? AUDIT_STATUS_MAP[auditStatus]: '--'"
              min-width="110"
              label="审核状态">
            </el-table-column>
            <el-table-column
              prop="status"
              :formatter="({ status }) => PACKEAGE_STATUS_MAP[status]"
              min-width="110"
              label="投放状态">
            </el-table-column>
            <el-table-column
              :formatter="({ remainDays }) =>  `${remainDays}天`"
              min-width="110"
              label="剩余天数">
            </el-table-column>
            <el-table-column
              prop="address"
              width="300"
              align="center"
              label="操作">
              <template slot-scope="{ row }">
                <template  v-if="row.skuId === 301">
                <el-row type="flex" justify="space-around">
                  <el-col :span="8">
                    <el-button  style="width: 100%" @click="goToPlanList(item)">设置推广</el-button>
                  </el-col>
                </el-row>
                </template>
                <p v-else style="textAlign: center">--</p>
              </template>
            </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
        layout="prev, pager, next, total"
        :total="total"
        :page-size="query.size"
        @current-change="handleCurrentChange"
        :current-page="query.page + 1">
        </el-pagination>
      </div>
    </main>
    <PreOrderDetail :isRenew="true" @preOrder="submit" @cancel="visible=false" :allAreas="allAreas" :dialogVisible="visible"  :userInfo="userInfo" :preInfo="renewInfo"/>
    <el-dialog
      :visible.sync="dialogVisible"
      width="26%"
      custom-class="query-price-dialog"
    >
      <el-alert
        title="推广已到期，续费推广需重新购买"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <p>因推广到期，关键词有被抢购风险，去查价重新购买快速锁定关键词</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="goQueryPrice">去查价</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserPackageList, renewOrder, getRenewPriceByPackageId, submitPreOrder } from 'api/biaowang-plus'
import PreOrderDetail from './components/bw-price-records/pre-order-detail.vue'
import {
  AUDIT_STATUS_MAP,
  PACKEAGE_STATUS_MAP,
  DEVICE,
  SCHEDULE_TYPE,
  SERVICE_DAYS,
  PROMOTE_STATUS_COLOR_MAP,
  AUDIT_STATUS_COLOR_MAP,
  THIRTY_DAYS,
  RENEW_OPRATION_STATUS_DISABLED,
  RENEW_OPRATION_STATUS_COPY,
  BAIDU_PRODUCT_SOURCE,
  PROMOTE_STATUS_OFFLINE
} from 'constant/bw-plus'
import { getCnName } from 'util'
import debounce from 'lodash.debounce'
import { Message } from 'element-ui'
import { isSales, isRolesId } from 'util/role'
import gStore from '../store'

export default {
  name: 'bw-plus-package-list',
  components: {
    PreOrderDetail
  },
  props: {
    allAreas: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      AUDIT_STATUS_MAP,
      PACKEAGE_STATUS_MAP,
      PROMOTE_STATUS_COLOR_MAP,
      AUDIT_STATUS_COLOR_MAP,
      DEVICE,
      SCHEDULE_TYPE,
      SERVICE_DAYS,
      THIRTY_DAYS,
      RENEW_OPRATION_STATUS_DISABLED,
      RENEW_OPRATION_STATUS_COPY,
      query: {
        keyword: '',
        size: 10,
        page: 0,
        customerName: '',
        customerId: '',
        packageId: ''
      },
      total: 0,
      promotes: [],
      loading: false,
      isRenew: false,
      renewInfo: {},
      dialogVisible: false,
      commitSkuDetailList: [],
      visible: false,
      renewPackgeInfo: {}
    }
  },
  methods: {
    async submit () {
      const params = {
        applyId: this.renewInfo.applyId,
        skuList: this.renewInfo.additionProductMap
      }
      try {
        const { data: { url } } = await submitPreOrder(params)
        this.$copyText(url).then(async (e) => {
          Message.success('提单链接已复制到剪切板')
        }, function (e) {})
      } catch (error) {
        console.log(error)
      }
    },
    handleCurrentChange (page) {
      this.query.page = page - 1
    },
    allowRenew (item) {
      const { roles } = this.userInfo
      const { skuList } = item
      return isSales(roles) && skuList.some(s => s.skuId === BAIDU_PRODUCT_SOURCE)
    },
    queryPackageList: debounce(async function (params) {
      const { user_id: userId } = this.$route.query
      try {
        this.loading = true
        const { items, total } = await getUserPackageList({
          ...params,
          ...this.query,
          userId
        })
        this.total = total
        this.promotes = items
      } finally {
        this.loading = false
      }
    }, 300),
    goToPlanList ({ packageId, phoenixsVersion }) {
      this.$router.push({ name: 'bw-plus-plan-list', params: { id: packageId }, query: { phoenixsVersion } })
    },
    goQueryPrice () {
      this.$router.push({ name: 'bw-plus-query-price', query: { renew: 1 } })
    },
    async renew (item) {
      const { packageId, skuList } = item
      {
        const { cities, coreCity, industry, keywords: words } = item
        gStore.getQueryInfo({ cities, coreCity, industry, words })
      }
      const target = skuList.find(s => s.skuId === BAIDU_PRODUCT_SOURCE)
      if (target && target.status === PROMOTE_STATUS_OFFLINE) {
        this.dialogVisible = true
        return
      }
      const {
        data: {
          applyId, commitSkuDetailList, cities, words: keywords, mobile = '', salesId: saleId, userId:
            userBxId, customerId, customerDesc
        }
      } = await getRenewPriceByPackageId({ packageId })
      if (commitSkuDetailList && commitSkuDetailList.length) {
        this.visible = true
        this.renewInfo = {
          customerDesc,
          customerId,
          applyId,
          packageId,
          additionProductMap: commitSkuDetailList,
          cities,
          keywords,
          saleId,
          mobile,
          userBxId
        }
      } else {
        this.$router.push({ name: 'renew-upgrade', query: { packageId } })
      }
    },
    async renewPreOrder (applyId) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code, data: { url }, message } = await renewOrder({ applyId })
        if (code === 0) {
          this.$copyText(url).then(async (e) => {
            Message.success('提单链接已复制到剪切板')
            await this.queryPackageList()
            this.isRenew = false
          }, function (e) {})
          return
        }
        if (code === 4080) {
          Message.error(message || '关键词已经被售出!')
        }
        if (code === 4014) {
          Message.error('超出最大续费时长，目前最大续费（剩余投放天数）为3年')
        }
      } finally {
        loading.close()
      }
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'border-color:#FFDECF !important;text-align: left'
      } else {
        return 'border-color:#FFDECF !important;text-align: left;padding-left: 15px'
      }
    },
    headerCellStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && rowIndex === 0) {
        return 'border-color:#FFDECF !important;color:#C67C49;font-size:13px;text-align: left'
      } else if (columnIndex === 5 && rowIndex === 0) {
        return 'border-color:#FFDECF !important;color:#C67C49;font-size:13px;text-align: center'
      } else {
        return 'border-color:#FFDECF !important;color:#C67C49;padding-left:15px !important;font-size:13px;text-align: left'
      }
    },
    citiesFormater (row) {
      if (row && row.length > 0) {
        const detail = row.map(city => getCnName(city, this.allAreas)).join('、')
        const detailTwo = row.slice(0, 2).map(city => getCnName(city, this.allAreas)).join('、') + `等${row.length}个城市`
        if (row.length >= 362) {
          return {
            text: '全国',
            detail
          }
        }
        return {
          text: detailTwo,
          detail
        }
      } else {
        return {
          detail: '暂无城市',
          text: '暂无城市'
        }
      }
    },
    keywordsFormater (args) {
      if (args && args.length > 0) {
        const detail = args.map(keyword => getCnName(keyword, this.allAreas)).join('、')
        const text = args.slice(0, 3).map(keyword => getCnName(keyword, this.allAreas)).join('、')
        return {
          text: text,
          detail: detail
        }
      } else {
        return {
          text: '暂无关键词',
          detail: '暂无关键词'
        }
      }
    },
    isRolesId
  },
  watch: {
    query: {
      immediate: true,
      deep: true,
      handler () {
        this.queryPackageList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bw-plus-plan-list {
  margin: 10px;
  background: #fff;
  padding: 0;
  > header {
    color: #666;
    border-bottom: 1px solid #e6e6e6;
    padding: 14px;
    font-size: 16px;
  }
  > main {
    padding: 30px 40px;
  }
  .promote-id {
    color: $--color-primary;
    cursor: pointer;
  }
  .btn-text {
    padding: 0;
  }
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin: 20px;
}
/deep/ .query-price-dialog{
  .el-dialog__header{
    display: none;
  }
  .el-dialog__body{
    padding-bottom: 10px;
    p{
      padding-left: 35px;
    }
  }
  .el-alert{
    background: none;
    padding: 0;
    .el-icon-warning{
      font-size: 24px;
      margin-right: 10px;
    }
    .el-alert__content{
      color: #303133;
      font-size: 14px;
    }
  }
}
.el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
    border-color: #FFDECF;
}
.el-table--border::after, .el-table--group::after, .el-table::before{
    background-color: #FFDECF;
}
.table {
  margin-bottom: 20px;
}

.table-titles {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
  padding-left: 13px;
  margin-bottom: 20px;
  background: #FFF1E4;
  box-sizing: border-box;
  padding: 0 20px;
  ul {
    display: flex;
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      list-style: none;
      margin-right: 30px;
      font-size: 13px;
      color: #666666;
    }
  }
}
.project-name {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 76px;
    height: 46px;
    margin-right: 10px;
  }
}
</style>
