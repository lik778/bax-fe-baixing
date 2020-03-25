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
          <el-form-item >
            <el-checkbox-group v-model="query.auditStatusFilters">
              <el-checkbox :label="opt.value" v-for="(opt, index) in auditStatusOpts" :key="index">{{opt.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <marquee v-if="promotesDue.length" direction="left" scrollamount="6" height="40px" scrolldelay="60">
          {{promotesDueText}}
        </marquee>
        <el-table :data="promotes" border>
          <el-table-column prop="word" label="关键词" />
          <el-table-column prop="cities" label="城市" :formatter="row => cityFormatter(row.cities)" />
          <el-table-column prop="device" label="平台" :formatter="row => deviceFormatter(row.device)" />
          <el-table-column prop="status" label="投放状态" :formatter="v => statusFormatter(v.status)" />
          <el-table-column>
            <template slot="header">
                审核状态
                <el-tooltip content="指您最近一次提交内容的审核状态，系统将以最近一次通过审核的版本投放。">
                  <i class="el-icon-info"></i>
                </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-popover v-if="isRejected(scope.row.auditStatus)" placement="top" trigger="hover">
                <span slot="reference">{{auditStatusFormatter(scope.row.auditStatus)}}</span>
                <div>{{scope.row.auditRejectReason}}
                  <span class="audit-reject-review" @click="auditRejectReasonDialogVisible=true">查看常见驳回原因</span>
                </div>
              </el-popover>
              <p v-else>{{auditStatusFormatter(scope.row.auditStatus)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="cpcRanking" label="平均排名" :formatter="({cpcRanking}) => cpcRanking && fmtCpcRanking(cpcRanking)" />
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
              <el-button class="xufei-btn" v-if="canXufei(scope.row)" size="small" type="text" @click="onXufei(scope.row)">续费</el-button>
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
      <audit-reject-reason-dialog :show="auditRejectReasonDialogVisible" 
                                  @close="auditRejectReasonDialogVisible = false">
      </audit-reject-reason-dialog>
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
    PROMOTE_STATUS_ONLINE,
    PROMOTE_STATUS_PENDING_ONLINE,
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
  import flatten from 'lodash.flatten'
  import {fmtCpcRanking} from 'util/campaign'
  import auditRejectReasonDialog from 'com/common/audit-reject-reason-dialog'

  export default {
    name: 'bw-plan-list',
    components: {
      BaxPagination,
      auditRejectReasonDialog
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
        auditRejectReasonDialogVisible: false
      }
    },
    computed: {
      promotesDue() {
        const arr = this.promotes
        .map(p => ({
          id: p.id,
          word: p.word,
          leftDays: this.leftDays(p)
        }))
        .filter(p => p.leftDays)
        return arr
          .sort((a, b) => a.leftDays - b.leftDays)
      },
      promotesDueText() {
        const key = 'bw-word-query-times'
        const raw = localStorage.getItem(key)
        let times = {}
        if (raw) {
          times = JSON.parse(raw)
        }
        const dateStr = dayjs().format('YYYY-MM-DD')

        if (this.promotesDue.length) {
          const arr = this.promotesDue
            .slice(0, 3)
            .map(p => ({
              ...p,
              times: dateStr === times.date ? (times[p.id] || this.getRandomQueryTimes()) : this.getRandomQueryTimes()
            }))
          const storageObj = Object.assign(times, arr.reduce((s, a) => {s[a.id] = a.times; return s}, {}))
          storageObj.date = dateStr

          localStorage.setItem(key, JSON.stringify(storageObj))

          return arr.map(p => `今日 ${p.word} 关键词被查价 ${p.times} 次，如需继续投放，请在关键词到期前续费，以免被同行客户抢单`)
            .join('。 ')
        }
      },
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
      fmtCpcRanking,
      getRandomQueryTimes() {
        let r = Math.random()
        while(r > 1 || r < .3) {
          r = Math.random()
        }
        return Math.floor(r * 10)
      },
      isRejected(status) {
        return AUDIT_STATUS_REJECT.includes(status)
      },
      f2y,
      leftDays(row) {
        if (!PROMOTE_STATUS_PENDING_ONLINE.concat(PROMOTE_STATUS_OFFLINE).includes(row.status)) {
          let daysLeft = row.days
          if (row.startedAt) {
            // 可能是负值
            daysLeft = row.days - (Date.now() - row.startedAt * 1000) / 86400 / 1000
          }
          return parseFloat(Math.max(daysLeft, 0)).toFixed(1)
        }
      },
      canXufei(row) {
        return PROMOTE_STATUS_ONLINE.includes(row.status) && this.leftDays(row) <= 15
      },
      async getPromotes() {
        const {offset, limit, keyword: word, promoteStatusFilters, auditStatusFilters, userId} = this.query
        const {items, total} = await getPromotes({
          page: offset / limit,
          size: limit, word,
          userId,
          status: flatten(promoteStatusFilters),
          auditStatus: flatten(auditStatusFilters)
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
        // 关闭续费功能, 续费功能上线后关闭
        const h = this.$createElement
        this.$msgbox({
          title: '提示',
          message: h('p', null, '功能升级中，如需续费，请在关键词到期后重新购买。'),
          showCancelButton: false,
          showConfirmButton: false,
          showClose: false,
        })
        const timer = setTimeout(() => {
          this.$msgbox.close()
          timer && clearTimeout(timer)
        }, 3000)
        return 

        // 续费逻辑
        const {word, cities, device} = row
        if (!this.canXufei(row)) {
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
        const res = Object.entries(PROMOTE_STATUS).find(arr => arr[1].includes(status))
        return res && res[0]
      },
      auditStatusFormatter(auditStatus) {
        const res = Object.entries(AUDIT_STATUS).find(arr => arr[1].includes(auditStatus))
        return res && res[0]
      },
      dateFormatter({createdAt}) {
        return dayjs(createdAt * 1000).format('YYYY-MM-DD')
      }
    },
    async mounted() {
      const promote = this.$route.params.promote
      this.query.userId = this.salesInfo.userId
      await this.getPromotes()
      if (promote && promote.id) {
        // 首页续费直接加入购物车
        this.onXufei(promote)
      }
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
marquee {
  background-color: #FFF7EB;
  color: #C6A674;
  display: flex;
  align-items: center;
}
.audit-reject-review{
  color: #FF6350;
  cursor: pointer;
}
.xufei-btn {
  cursor: not-allowed;
  color: #999;
}
</style>
