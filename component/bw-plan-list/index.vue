<template>
  <div class="bg">
    <div class="white-bg">
      <header>我的标王推广计划</header>
      <main>
        <div style="color: red; font-size: 14px;margin-bottom: 20px">(近期会将现有投放中的计划迁移至标王2.0，显示为“已迁移”的数据可以到标王2.0查看，如有任何问题请及时联系您的销售或客服。)
        </div>
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
          <el-table-column prop="cities" label="城市">
            <template slot-scope="scope">
                <el-tooltip popper-class="city-tooltip" v-if="scope.row.cities.length > 10" class="item" effect="light" :content="cityFormatter(scope.row.cities, scope.row.cities.length)" placement="right">
                    <p>{{ cityFormatter(scope.row.cities, 10) }}</p>
                </el-tooltip>
                <p v-else>{{ cityFormatter(scope.row.cities) }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="device" label="平台" :formatter="row => deviceFormatter(row.device)" />
          <el-table-column prop="status" label="投放状态" :formatter="v => statusFormatter(v.status)" />
          <el-table-column label="审核状态">
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
          <el-table-column prop="cpcRanking" label="昨日排名" :formatter="({cpcRanking}) => cpcRanking && fmtCpcRanking(cpcRanking, false)" />
          <el-table-column prop="createdAt" label="购买日期" :formatter="dateFormatter" />
          <el-table-column prop="remainDays" label="投放剩余天数" />
          <!-- <el-table-column label="投放剩余天数">
            <template slot-scope="scope">
              <div>
                {{leftDays(scope.row)}}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" min-width="160px">
            <template slot-scope="scope">
              <router-link v-if="!isAgentAccounting && ![...PROMOTE_STATUS_PAUSE, ...PROMOTE_STATUS_ONLINE, ...PROMOTE_STATUS_MIGRATE].includes(scope.row.status)" :to="{name: 'bw-edit-plan', query: {promoteId: scope.row.id}}"><el-button type="text" size="small">编辑</el-button></router-link>
              <!-- <el-button v-if="canXufei(scope.row) && !userInfo.shAgent" size="small" type="text"
                         :disabled="disabledXuFeiBtn(scope.row)"
                         @click="onXufei(scope.row)">续费</el-button> -->
              <router-link v-if="!PROMOTE_STATUS_MIGRATE.includes(scope.row.status)" :to="{name: 'bw-dashboard', query: {promoteId: scope.row.id, keyword: scope.row.word}}">
                <el-button type="text" size="small">查看报告</el-button>
              </router-link>
              <span v-if="canSeeLiveBtn(scope.row)">
                <el-button type="text" slot="reference" size="small"
                          @click="handleLiveSituation(scope.row)">推广实况</el-button>
                <el-tooltip effect="dark" placement="top-start">
                  <i class="el-icon-info" style="color: rgb(151, 168, 190);cursor: pointer"></i>
                  <div slot="content">
                    <p>1、为您显示网民看到的平均推广实况，可能与您在百度搜索框直接搜索结果有差别, 实际结果会受地域/网络环境/机型等用户的个性化因素影响产生差异。</p>
                    <p>2、如您购买的关键词同时推广多个城市，为您显示其中某个城市的推广实况</p>
                    <p>3、如您的关键词刚进行推广或在近期修改过推广内容，可能暂时无法提供推广实况结果，请稍后再试</p>
                  </div>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <bax-pagination :options="query" @current-change="onCurrentChange" />
      </main>

      <el-dialog :visible.sync="xufeiDialogVisible" width="600px" title="标王续费">
        <el-form :model="xufeiForm" label-width="200px" :rules="rules" ref="xufei">
          <el-form-item label="关键词：">{{xufeiForm.word}}</el-form-item>
          <el-form-item label="城市：">{{cityFormatter(xufeiForm.cities)}}</el-form-item>
          <el-form-item label="投放平台：">{{deviceFormatter(xufeiForm.device)}}</el-form-item>
          <el-form-item label="购买天数：" prop="days">
            <el-radio v-model="xufeiForm.days" :label="+option[0]" v-for="(option, index) in Object.entries(xufeiForm.soldPriceMap)" :key="index">{{option[0]}}天{{f2y(option[1])}}元</el-radio>
            <template v-if="showManualBtn || showLongOrder">
              <el-button size="small" type="primary" @click="manualDialogVisible = true">
                <span v-if="showManualBtn">人工报价</span>
                <span v-if="!showManualBtn && showLongOrder">申请年单</span>
              </el-button>
              <el-tooltip effect="light" placement="top-start">
                <manual-tooltip slot="content" />
                <i class="el-icon-info icon"></i>
              </el-tooltip>
            </template>
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
      <el-dialog :visible="liveDialogVisible"
                 custom-class="fixed-center"
                 title="选择平台"
                 width="420px"
                 :show-close="false">
        <el-radio-group v-model="liveType">
          <el-radio v-for="(item, key) in liveDevices" :key="key" :label="Number(key)">
            {{item.label}}
          </el-radio>
        </el-radio-group>
        <span slot="footer">
          <el-button @click="liveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="goToLivePageByType">确定</el-button>
        </span>
      </el-dialog>

      <manual-dialog :visible="manualDialogVisible"
                     @cancel="manualDialogVisible = false"
                     :all-areas="allAreas"
                     :manual-data="manualData" />
    </div>
  </div>
</template>

<script>
import BaxPagination from 'com/common/pagination'
import ManualTooltip from 'com/common/bw/manual-tooltip'
import ManualDialog from 'com/common/bw/manual-dialog'
import {
  promoteStatusOpts,
  auditStatusOpts,
  DEVICE,
  DEVICE_ALL,
  DEVICE_PC,
  DEVICE_WAP,
  PROMOTE_STATUS,
  AUDIT_STATUS,
  AUDIT_STATUS_REJECT,
  PROMOTE_STATUS_ONLINE,
  PROMOTE_STATUS_PENDING_ONLINE,
  PROMOTE_STATUS_OFFLINE,
  PRICE_NEED_MANUAL_QUOTA,
  ORDER_APPLY_TYPE_NOT,
  GET_DAYS_MAP,
  THIRTY_DAYS,
  PROMOTE_STATUS_PAUSE,
  NOT_SPECIALRENEW_LIST,
  PROMOTE_STATUS_MIGRATE
} from 'constant/biaowang'
import { getPromotes, queryKeywordPriceNew, getUserLive, getUserRanking, specialRenew } from 'api/biaowang'
import {
  f2y,
  getCnName,
  fmtAreasInBw
} from 'util'
import dayjs from 'dayjs'
import { normalizeRoles } from 'util/role'
import flatten from 'lodash.flatten'
import { fmtCpcRanking } from 'util/campaign'
import auditRejectReasonDialog from 'com/common/audit-reject-reason-dialog'
import { orderServiceHost, preKeywordPath } from 'config'

const liveDevices = {
  [DEVICE_WAP]: {
    label: DEVICE[DEVICE_WAP],
    urlKey: 'wapUrl',
    msg: '手机端实况展现升级中，请以实际展现情况为准'
  },
  [DEVICE_PC]: {
    label: DEVICE[DEVICE_PC],
    urlKey: 'pcUrl',
    msg: '暂无电脑端实况数据，请稍后再试'
  }
}

export default {
  name: 'bw-plan-list',
  components: {
    BaxPagination,
    auditRejectReasonDialog,
    ManualTooltip,
    ManualDialog
  },
  props: {
    allAreas: Array,
    salesInfo: Object,
    userInfo: Object
  },
  data () {
    return {
      PROMOTE_STATUS_PAUSE,
      PROMOTE_STATUS_ONLINE,
      promoteStatusOpts,
      auditStatusOpts,
      PROMOTE_STATUS_MIGRATE,
      payUrl: '',
      query: {
        keyword: '',
        promoteStatusFilters: [],
        auditStatusFilters: [],
        offset: 0,
        limit: 20,
        total: 0
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
        days: [{ required: true, message: '请选择购买天数' }]
      },
      xufeiDialogVisible: false,
      auditRejectReasonDialogVisible: false,

      liveDialogVisible: false,
      liveType: DEVICE_WAP,
      liveDevices,
      currentPromoteLive: null,
      manualDialogVisible: false,
      specialRenewVisible: false
    }
  },
  computed: {
    promotesDue () {
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
    // eslint-disable-next-line
    promotesDueText () {
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
        const storageObj = Object.assign(times, arr.reduce((s, a) => { s[a.id] = a.times; return s }, {}))
        storageObj.date = dateStr

        localStorage.setItem(key, JSON.stringify(storageObj))

        return arr.map(p => `今日 ${p.word} 关键词被查价 ${p.times} 次，如需继续投放，请在到期后尽快续费，以免被同行客户抢单`)
          .join('。 ')
      }
    },
    isBxUser () {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('BAIXING_USER')
    },
    isBxSales () {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('BAIXING_SALES')
    },
    isAgentAccounting () {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('AGENT_ACCOUNTING')
    },
    showManualBtn () {
      const { manualPriced, price } = this.xufeiForm
      return !manualPriced && price >= PRICE_NEED_MANUAL_QUOTA
    },
    showLongOrder () {
      const { orderApplyType, price } = this.xufeiForm
      return orderApplyType === ORDER_APPLY_TYPE_NOT && price < PRICE_NEED_MANUAL_QUOTA
    },
    manualCities () {
      return fmtAreasInBw(this.xufeiForm.cities, this.allAreas)
    },
    manualData () {
      const { device, cities, word } = this.xufeiForm
      return {
        manualCities: this.manualCities,
        word,
        cities,
        targetUserId: this.getFinalUserId(),
        devices: [device]
      }
    }
  },
  methods: {
    fmtCpcRanking,
    getFinalUserId () {
      const { user_id: userId } = this.$route.query
      if (userId) {
        return userId
      }
      const { userInfo } = this
      return userInfo.id
    },
    async specialRenewHandel (xufeiform) {
      const { salesInfo } = this
      const params = {
        targetUserId: salesInfo.userId,
        salesId: salesInfo.salesId,
        promoteId: xufeiform.promoteId
      }
      const { data: preTradeId } = await specialRenew(params)
      if (preTradeId !== '0') {
        if (this.isUser('BAIXING_USER')) {
          location.href = `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}`
        } else if (this.isUser('AGENT_ACCOUNTING')) {
          location.href = `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}&agentId=${this.userInfo.id}`
        } else if (this.isUser('BAIXING_SALES')) {
          this.payUrl = `${orderServiceHost}/${preKeywordPath}/?appId=105&seq=${preTradeId}`
        }
      } else {
        this.$message({
          message: '恭喜你，续费成功',
          type: 'success'
        })
      }
      await this.getPromotes()
    },
    isUser (roleString) {
      return normalizeRoles(this.userInfo.roles).includes(roleString)
    },
    getRandomQueryTimes () {
      let r = Math.random()
      while (r > 1 || r < 0.3) {
        r = Math.random()
      }
      return Math.floor(r * 10)
    },
    isRejected (status) {
      return AUDIT_STATUS_REJECT.includes(status)
    },
    f2y,
    leftDays (row) {
      if (!PROMOTE_STATUS_PENDING_ONLINE.concat(PROMOTE_STATUS_OFFLINE).includes(row.status)) {
        const daysLeft = row.remainDays
        // if (row.startedAt) {
        //   // 可能是负值
        //   daysLeft = row.days - (Date.now() - row.startedAt * 1000) / 86400 / 1000
        // }
        return parseFloat(Math.max(daysLeft, 0)).toFixed(1)
      }
    },
    disabledXuFeiBtn (row) {
      // tip: 时间为2020-03-27 12:16:40.213743之前的不能续费
      return dayjs(row.createdAt * 1000).isBefore('2020-03-27 12:16:40.213743')
    },
    canXufei (row) {
      if (NOT_SPECIALRENEW_LIST.includes(row.id)) {
        return false
      }
      return (PROMOTE_STATUS_ONLINE.includes(row.status) && this.leftDays(row) <= 15)
    },
    canSeeLiveBtn (row) {
      return PROMOTE_STATUS_ONLINE.includes(row.status)
    },
    async getPromotes () {
      const { query: { user_id: userId } } = this.$route
      const { offset, limit, keyword: word, promoteStatusFilters, auditStatusFilters } = this.query
      const { items, total } = await getPromotes({
        page: offset / limit,
        size: limit,
        word,
        userId: userId,
        status: flatten(promoteStatusFilters),
        auditStatus: flatten(auditStatusFilters)
      })
      this.promotes = items
      this.query.total = total

      const yesterday = dayjs().subtract(1, 'day').startOf('day').unix()
      const rankings = await getUserRanking({
        startTime: yesterday,
        endTime: yesterday,
        promoteList: items.map(i => i.id),
        userId
      })

      if (rankings.length) {
        this.promotes = this.promotes.map(p => {
          const one = rankings.find(r => r.promoteId === p.id)
          if (one && one.rankList.length) {
            return Object.assign(p, { cpcRanking: parseFloat(one.rankList[0]).toFixed(2) })
          }
          return p
        })
      }
    },
    async onCurrentChange ({ offset }) {
      this.query.offset = offset
      await this.getPromotes()
    },
    async onXufei (row) {
      this.payUrl = ''
      const { word, cities, device } = row
      if (!this.canXufei(row)) {
        return this.$message.info('到期前15天才可续费哦')
      }
      const result = await queryKeywordPriceNew({
        targetUserId: this.getFinalUserId(),
        word,
        cities,
        device
      })
      const priceObj = result[0].priceList[0]
      const soldPriceMap = GET_DAYS_MAP(priceObj.orderApplyType).reduce((curr, prev) => {
        return Object.assign(curr, {
          [prev]: prev / THIRTY_DAYS * priceObj.price
        })
      }, {})
      this.xufeiForm = {
        ...result[0],
        ...priceObj,
        soldPriceMap
      }
      this.xufeiDialogVisible = true
    },
    addToCart () {
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
    cityFormatter (cities, max = 20) {
      return cities.slice(0, max).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > max ? `等${cities.length}个城市` : '')
    },
    deviceFormatter (device) {
      return DEVICE[device]
    },
    statusFormatter (status) {
      const res = Object.entries(PROMOTE_STATUS).find(arr => arr[1].includes(status))
      return res && res[0]
    },
    auditStatusFormatter (auditStatus) {
      const res = Object.entries(AUDIT_STATUS).find(arr => arr[1].includes(auditStatus))
      return res && res[0]
    },
    dateFormatter ({ createdAt }) {
      return dayjs(createdAt * 1000).format('YYYY-MM-DD')
    },
    goToLivePageByType () {
      const promote = this.currentPromoteLive
      const currentLiveObj = this.liveDevices[this.liveType]
      const { urlKey, msg } = currentLiveObj
      this.goToLivePage(promote[urlKey], msg)
    },
    goToLivePage (url, msg) {
      if (url) {
        window.open(url)
      } else {
        this.$alert(msg, '提示', {
          showClose: false
        })
      }
    },
    async handleLiveSituation (promote) {
      const promoteLive = await getUserLive({ promoteId: promote.id })
      const { device, pcUrl, wapUrl } = promoteLive

      if (device === DEVICE_ALL) {
        this.currentPromoteLive = promoteLive
        this.liveDialogVisible = true
        return
      }
      if (device === DEVICE_PC) {
        this.goToLivePage(pcUrl, this.liveDevices[DEVICE_PC].msg)
        return
      }
      if (device === DEVICE_WAP) {
        this.goToLivePage(wapUrl, this.liveDevices[DEVICE_WAP].msg)
      }
    }
  },
  async mounted () {
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
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  color: #666;
  border-bottom: 1px solid #e6e6e6;
  padding: 15px;
  font-size: 16px;
}
div.bg {
  & > .white-bg {
    background-color: #fff;

    & > main {
      box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, 0.1);
      min-height: 700px;
      padding: 45px 60px;
    }
  }
}
.create-plan {
  margin-bottom: 35px;
}
marquee {
  background-color: #fff7eb;
  color: #c6a674;
  display: flex;
  align-items: center;
}
.audit-reject-review {
  color: #ff6350;
  cursor: pointer;
}
.xufei-btn {
  cursor: not-allowed;
  color: #999;
}
.el-icon-info {
  cursor: pointer;
}
</style>

<style lang="scss">
.city-tooltip {
  width: 320px;
}
</style>
