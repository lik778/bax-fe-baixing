<template>
  <div class="bg">
    <div class="white-bg">
      <header>我的标王推广计划</header>
      <main>
        <router-link :to="{name: 'bw-query-price'}">
          <el-button class="create-plan" type="primary"><i class="el-icon-plus" ></i>新建标王计划</el-button>
        </router-link>
        <el-form :model="query" label-width="100px" label-position="left" @submit.native.prevent >
          <el-form-item label="关键词">
            <el-input v-model="query.keyword" placeholder="输入关键词查询" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="投放状态">
            <el-checkbox-group v-model="query.promoteStatusFilters">
              <el-checkbox :label="opt.value" v-for="(opt, index) in promoteStatusOpts" :key="index">{{opt.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-checkbox-group v-model="query.auditStatusFilters">
              <el-checkbox :label="opt.value" v-for="(opt, index) in auditStatusOpts" :key="index">{{opt.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <marquee direction="left" scrollamount="6" height="40px" scrolldelay="60"  class="notice"><recent-sold :allAreas="allAreas" /></marquee>
        <el-table :data="promotes" border>
          <el-table-column prop="word" label="关键词" />
          <el-table-column prop="cities" label="城市" :formatter="row => cityFormatter(row.cities)" />
          <el-table-column prop="device" label="平台" :formatter="row => deviceFormatter(row.device)" />
          <el-table-column prop="status" label="投放状态" :formatter="v => statusFormatter(v.status)" />
          <el-table-column prop="auditStatus" label="审核状态">
            <template slot-scope="scope">
              <el-popover v-if="isRejected(scope.row.auditStatus)" :content="scope.row.auditRejectReason" placement="top" trigger="hover">
                <span slot="reference">{{auditStatusFormatter(scope.row.auditStatus)}}</span>
              </el-popover>
              <p v-else>{{auditStatusFormatter(scope.row.auditStatus)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="cpcRanking" label="平均排名" />
          <el-table-column prop="createdAt" label="购买日期" :formatter="dateFormatter" />
          <el-table-column label="投放剩余天数">
            <template slot-scope="scope">
              <div>
                {{leftDays(scope.row)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link v-if="!isBxSales && !isAgentAccounting" :to="{name: 'bw-edit-plan', query: {promoteId: scope.row.id}}"><el-button type="text" size="small">编辑</el-button></router-link>
              <el-button size="small" type="text" @click="onXufei(scope.row)">续费</el-button>
            </template>
          </el-table-column>
        </el-table>
        <bax-pagination :options="query" @current-change="onCurrentChange" />
      </main>

      <el-dialog :visible.sync="xufeiDialogVisible" title="标王续费">
        <el-form :model="xufeiForm" label-width="200px" :rules="rules" ref="xufei">
          <el-form-item label="关键词：">{{xufeiForm.word}}</el-form-item>
          <el-form-item label="城市：">{{cityFormatter(xufeiForm.cities)}}</el-form-item>
          <el-form-item label="投放平台：">{{deviceFormatter(xufeiForm.device)}}</el-form-item>
          <el-form-item label="购买天数：" prop="days">
            <el-radio v-model="xufeiForm.days" :label="+option[0]" v-for="(option, index) in Object.entries(xufeiForm.soldPriceMap)" :key="index">{{option[0]}}天{{f2y(option[1])}}元</el-radio>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="xufeiDialogVisible = false">取消续费</el-button>
            <el-button type="primary" @click="addToCart">加入购物车</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import BaxPagination from 'com/common/pagination'
  import {
    promoteStatusOpts,
    auditStatusOpts,
    DEVICE,
    PROMOTE_STATUS,
    AUDIT_STATUS,
    AUDIT_STATUS_REJECT,
    PROMOTE_STATUS_OFFLINE
  } from 'constant/biaowang'
  import {getPromotes, queryKeywordPrice, getCpcRanking} from 'api/biaowang'
  import {
    f2y,
    getCnName
  } from 'util'
  import dayjs from 'dayjs'
  import {
    normalizeRoles
  } from 'util/role'
  import RecentSold from './recent-sold'

  export default {
    name: 'bw-plan-list',
    components: {
      BaxPagination,
      RecentSold
    },
    props: {
      allAreas: Array,
      salesInfo: Object,
      userInfo: Object
    },
    data() {
      return {
        promoteStatusOpts,
        auditStatusOpts,
        query: {
          keyword: '',
          promoteStatusFilters: [],
          auditStatusFilters: [],
          offset: 0,
          limit: 20,
          total: 0,
        },
        promotes: [],
        xufeiForm: {
          word: '',
          cities: [],
          device: 0,
          soldPriceMap: {},
          days: null
        },
        rules: {
          days: [{required: true, message: '请选择购买天数'}],
        },
        xufeiDialogVisible: false,
      }
    },
    computed: {
      isBxUser() {
        const roles = normalizeRoles(this.userInfo.roles)
        return roles.includes('BAIXING_USER')
      },
      isBxSales() {
        const roles = normalizeRoles(this.userInfo.roles)
        return roles.includes('BAIXING_SALES')
      },
      isAgentAccounting() {
        const roles = normalizeRoles(this.userInfo.roles)
        return roles.includes('AGENT_ACCOUNTING')
      },
    },
    methods: {
      isRejected(status) {
        return AUDIT_STATUS_REJECT.includes(status)
      },
      f2y,
      leftDays(row) {
        if (PROMOTE_STATUS_OFFLINE.includes(row.status)) {
          return '-'
        }
        if (row.startedAt) {
          const ms = row.days - (Date.now() - row.startedAt * 1000) / 86400 / 1000
          return parseFloat(Math.max(ms, 0)).toFixed(1)
        }

        return row.days
      },
      async getPromotes() {
        const {offset, limit, keyword: word, promoteStatusFilters, auditStatusFilters, userId} = this.query
        const {items, total} = await getPromotes({
          page: offset / limit,
          size: limit, word,
          userId,
          status: promoteStatusFilters.flat(),
          auditStatus: auditStatusFilters.flat()
        })
        this.promotes = items
        this.query.total = total

        const rankings = await getCpcRanking(items.map(i => i.id))
        this.promotes = this.promotes.map(p => {
          const one = rankings.find(r => r.promoteId === p.id)
          if (one) {
            return Object.assign({}, p, {cpcRanking: parseFloat(one.cpcRanking).toFixed(2)})
          }
          return p
        })
      },
      async onCurrentChange({offset}) {
        this.query.offset = offset
        await this.getPromotes()
      },
      async onXufei(row) {
        const {word, cities, device} = row
        if (this.leftDays(row) > 15) {
          return this.$message.info('到期前15天才可续费哦')
        }
        const result = await queryKeywordPrice({
          word,
          cities,
          device
        })
        this.xufeiForm = result[0]
        this.xufeiDialogVisible = true
      },
      addToCart() {
        this.$refs.xufei.validate(isValid => {
          if (isValid) {
            const item = {
              ...this.xufeiForm,
              price: this.xufeiForm.soldPriceMap[this.xufeiForm.days],
              xufei: true
            }
            this.$parent.$refs.bwShoppingCart.addToCart([item])
            this.xufeiDialogVisible = false
          } else {
            return false
          }
        })
      },
      cityFormatter(cities) {
        const max = 20
        return cities.slice(0, max).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > max ? `等${cities.length}个城市` : '')
      },
      deviceFormatter(device) {
        return DEVICE[device]
      },
      statusFormatter(status) {
        return Object.entries(PROMOTE_STATUS).find(arr => arr[1].includes(status))[0]
      },
      auditStatusFormatter(auditStatus) {
        return Object.entries(AUDIT_STATUS).find(arr => arr[1].includes(auditStatus))[0]
      },
      dateFormatter({createdAt}) {
        return dayjs(createdAt * 1000).format('YYYY-MM-DD')
      }
    },
    async mounted() {
      this.query.userId = this.salesInfo.userId
      await this.getPromotes()
    },
    watch: {
      'query.keyword': function (v) {
        this.getPromotes()
      },
      'query.promoteStatusFilters': function (v) {
        this.getPromotes()
      },
      'query.auditStatusFilters': function (v) {
        this.getPromotes()
      },
    }
  }
</script>

<style lang="postcss" scoped>
header {
  color: #666;
  border-bottom: 1px solid #E6E6E6;
  padding: 15px;
  font-size: 16px;
}
div.bg {
  padding: 10px 10px 30px 10px;
  background-color: #f4f4f4;

  & > .white-bg {
    background-color: #fff;

    & > main {
      box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, .1);
      min-height: 700px;
      padding: 45px 60px;
    }
  }
}
.create-plan {
  margin-bottom: 35px;
}
.notice {
  background-color: #FFF7EB;
  color: #C6A674;
  display: flex;
  align-items: center;
}
</style>
