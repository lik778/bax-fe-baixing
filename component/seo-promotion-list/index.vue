<template>
  <div class="promotion-list">
    <header>我的首页宝推广计划<small>您的首页宝推广余额为 {{f2y(balance)}} 元</small></header>

    <router-link :to="{name: 'seo-create-promotion'}">
      <el-button class="create"
                 type="primary">新建首页宝计划</el-button>
    </router-link>
    <div class="choose-type">
      <el-radio-group v-model="type">
        <el-radio v-for="(value,label) in promotionTypes"
                  :key="label"
                  :label="Number(label)">
          {{value}}
        </el-radio>
      </el-radio-group>
    </div>
    <template v-if="type===ZIXUAN_TYPE">
      <div class="list-header">推广落地页</div>
      <ul v-loading="loading"
          class="list-content">
        <li v-for="item in promotionsGroupByLanding"
            :key="item.landingPage"
            class="list-item">
          <div class="top-col"
               @click="currentItem === item ? currentItem = {} : currentItem = item">
            <i class="icon"
               :class="item === currentItem ? 'el-icon-minus' : 'el-icon-plus'" />
            <p class="title">{{item.landingPage}} -
              {{item.seoIncludedAt ? formatTime(item.seoIncludedAt * 1000) + ' 收录' : '未收录'}}</p>
          </div>
          <div class="batch"
               v-if="item === currentItem">
            <el-button :disabled="!canBatchOpen"
                       @click="batchOpen"
                       type="text">批量开启</el-button>
            <el-button :disabled="!canBatchClose"
                       @click="batchClose"
                       type="text">批量关闭</el-button>
          </div>
          <table v-if="item === currentItem"
                 class="table-container">
            <thead class="row header">
              <th class="col1">多选</th>
              <th class="col2">计划id</th>
              <th class="col3">
                <top-tip label="计划状态"
                         tip="待投放的状态解释：请至少开启4个审核通过的关键词进行投放" />
              </th>
              <th class="col4">审核状态</th>
              <th class="col5">关键词</th>
              <!-- <th>关键词来源</th> -->
              <th class="col6">创建时间</th>
              <th class="col7">
                <top-tip wrap-class="top-tip"
                         label-class="label"
                         label="最新排名<span>(电脑/手机)</span>"
                         tip="前10名即认为在首页;10~100名表示在上浮中;100+表示仍需优化，超过30天100+可换词" />
              </th>
              <th class="col8">
                <top-tip wrap-class="top-tip"
                         label-class="label"
                         label="达标天数<span>(电脑/手机)</span>"
                         tip="上首页即为达标，达标后产生扣费" />
              </th>
              <th class="col9">当前单价<p>(每端)</p>
              </th>
              <th class="col10">总扣款</th>
              <th class="col11">操作</th>
            </thead>
            <tbody v-if="!loading">
              <template v-for="promotion in currentPromotions">
                <tr v-for="keyword in promotion.words.slice(0, 1)"
                    :key="keyword.id"
                    class="row body">
                  <td class="col1">
                    <el-checkbox :checked="checkedPromotions.includes(promotion)"
                                 @change="v => onCheck(promotion, v)" />
                  </td>
                  <td class="col2">{{promotion.id}}</td>
                  <td class="col3">{{statusMap[promotion.status]}}</td>
                  <td class="col4">{{auditStatusMap[keyword.auditStatus]}}</td>
                  <td class="col5">{{keyword.word}}</td>
                  <!-- <td>{{keywordType[keyword.source]}}</td> -->
                  <td class="col6">{{formatTime(keyword.createdAt * 1000)}}</td>
                  <td class="col7">{{formatRanking(keyword.ranking)}} /
                    {{formatRanking(promotion.words[1].ranking)}}</td>
                  <td class="col8">{{keyword.qualifiedDays}} / {{promotion.words[1].qualifiedDays}}
                  </td>
                  <td class="col9">{{f2y(keyword.price)}}</td>
                  <td class="col10">{{f2y(keyword.totalCost + promotion.words[1].totalCost) }}</td>
                  <td class="col11">
                    <span v-if="!canUpdate(promotion, item) && !canRestart(promotion)">-</span>
                    <el-button v-if="canUpdate(promotion)"
                               type="text"
                               @click="$router.push({name: 'seo-update-zixuan-promotion', params: {id: promotion.id}})">
                      修改</el-button>
                    <el-button v-if="canRestart(promotion)"
                               type="text"
                               @click="onRestart(promotion)">重新投放</el-button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </li>
      </ul>
    </template>

    <el-table v-else
              :data="promotionCibaoList"
              class="cibao-table">
      <el-table-column prop="landingPage"
                       label="推广落地页"
                       fixed
                       min-width="130"></el-table-column>
      <el-table-column prop="id"
                       align="center"
                       label="计划id"
                       width="60"></el-table-column>
      <el-table-column prop="status"
                       align="center"
                       label="计划状态"
                       width="70">
        <span slot-scope="{row}">
          <el-tag :type="row.status === AUDIT_STATUS_REJECTED ?'danger':
                         row.status === AUDIT_STATUS_PASSED ? 'success':
                         row.status === AUDIT_STATUS_PENDING ? 'warning':'info'">
            {{cibaoStatus[row.status]}}
          </el-tag>
        </span>
      </el-table-column>
      <el-table-column label="计划类型^^(时长/词量)"
                       align="center"
                       :render-header="renderHeader"
                       width="126">
        <span slot-scope="{row}">{{row.duration}}天/{{row.volume}}词</span>
      </el-table-column>
      <el-table-column prop="createdAt"
                       align="center"
                       label="创建时间"
                       width="126">
        <span slot-scope="{row}">{{formatTime(row.createdAt * 1000)}}</span>
      </el-table-column>
      <el-table-column prop="onlineAt"
                       align="center"
                       label="上线时间"
                       width="126">
        <span slot-scope="{row}">{{row.onlineAt?formatTime(row.onlineAt * 1000):'--'}}</span>
      </el-table-column>
      <el-table-column prop="firstCompletionAt"
                       label="达标时间"
                       align="center"
                       width="126">
        <span slot-scope="{row}">
          {{row.firstCompletionAt?formatTime(row.firstCompletionAt * 1000):'--'}}
        </span>
      </el-table-column>
      <el-table-column prop="recentlyCompleted"
                       label="首页词数量^^(电脑/手机)"
                       align="center"
                       :render-header="renderHeader"
                       min-width="126">
        <span slot-scope="{row}">{{row.recentlyCompleted.pc}}/{{row.recentlyCompleted.app}}</span>
      </el-table-column>
      <el-table-column prop="achieved"
                       label="达标天数"
                       align="center"
                       min-width="70"></el-table-column>
      <el-table-column label="剩余推广天数"
                       align="center"
                       min-width="80">
        <span slot-scope="{row}">{{parseInt(row.duration + row.renewDuration -row.achieved)}}</span>
      </el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       min-width="200">
        <template slot-scope="{row}">
          <el-button type="text"
                     @click="routerToCibaoUpdatePromotion(row)"
                     :disabled="row.status !== AUDIT_STATUS_PASSED ">编辑
          </el-button>
          <el-button type="text"
                     style="margin-left:4px"
                     :disabled="row.status !== AUDIT_STATUS_PASSED"
                     @click="renewPromotion(row)">续费</el-button>
          <el-button type="text"
                     style="margin-left:4px"
                     @click="exportCSV(row)">导出首页词列表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="total, prev, pager, next"
                   @current-change="handlePageChange"
                   :page-size="pageSize"
                   :total="total" />
  </div>
</template>

<script>
import TopTip from '../qwt-promotion-list/topTip'
import { getUserSites } from 'api/ka'
import  { 
  queryPromotion,
  queryPromotionByIds, 
  start, 
  stop, 
  getBalance, 
  restart, 
  renewCibaoPromotion,
  getCiBaoPromotionList,
  exportCibaoPromotion
} from 'api/seo'
import {
  status as statusMap,
  auditStatus as auditStatusMap,
  STATUS_ONLINE,
  STATUS_OFFLINE,
  STATUS_CREATED,
  platform,
  keywordType,
  AUDIT_STATUS_REJECTED,
  AUDIT_STATUS_PASSED,
  AUDIT_STATUS_PENDING,
  ZIXUAN_TYPE,
  CIBAO_TYPE,
  types as promotionTypes,
  chargeList,
  cibaoStatus,
  NINETY_DAYS,
  BAIDU_TYPE,
  QIHU_360
  } from 'constant/seo'
import dayjs from 'dayjs';
import { f2y } from 'util'
import { Parser }  from 'json2csv'
import FileSaver from 'file-saver'

export default {
  name:'SeoPromotionList',
  components: {
    TopTip
  },
  data() {
    return {
      promotionsGroupByLanding: [],
      checkedPromotions: [],
      currentItem: {},
      currentPromotions: [],
      loading: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      statusMap,
      auditStatusMap,
      platform,
      keywordType,
      balance: 0,

      promotionTypes,
      type: ZIXUAN_TYPE,
      ZIXUAN_TYPE,
      promotionCibaoList: null,
      cibaoStatus, 
      AUDIT_STATUS_PASSED,
      AUDIT_STATUS_PENDING,
      AUDIT_STATUS_REJECTED,
      sites: null
    }
  },
  computed: {
    canBatchOpen() {
      return this.checkedPromotions.length && this.checkedPromotions.every(p => [STATUS_CREATED].includes(p.status) && p.auditStatus === AUDIT_STATUS_PASSED)
    },
    canBatchClose() {
      console.log(this.checkedPromotions)
      return this.checkedPromotions.length && this.checkedPromotions.every(p => [STATUS_CREATED].includes(p.status) || (p.isRenewed && ![STATUS_OFFLINE].includes(p.status)))
    }
  },
  methods: {
    async onRestart(promotion) {
      this.$confirm(`重新投放关键词 【${promotion.words.map(k => k.word)[0]}】，将预扣款600元`, '重新投放确认')
      .then(() => {
        return restart(promotion.id)
      })
      .then(() => {
        this.$message.success('重新投放成功')
        window.location.reload()
      })
      .catch(() => {})
    },
    async loadBalance() {
      const d = await getBalance()
      this.balance = d.balance
    },
    f2y,
    formatTime(date) {
      return dayjs(date).format('YYYY.MM.DD HH:mm')
    },
    formatRanking(ranking) {
      return ranking === null ? '-' : (ranking > 100 ? '100+' : ranking)
    },
    canRestart(promotion) {
      return promotion.status === STATUS_OFFLINE
    },
    canUpdate(promotion) {
      if (promotion.status === STATUS_OFFLINE) return false
      if (promotion.auditStatus === AUDIT_STATUS_REJECTED) return true
      return promotion.isModifiable
    },
    async loadPromotions() {
      const {list, total} = await queryPromotion({page: this.currentPage - 1, size: this.pageSize})
      this.promotionsGroupByLanding = list
      this.total = total
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    onCheck(promotion, v) {
      if (v) {
        this.checkedPromotions.push(promotion)
      } else {
        const index = this.checkedPromotions.indexOf(promotion)
        this.checkedPromotions.splice(index, 1)
      }
    },
    async batchOpen() {
      await start(this.checkedPromotions.map(p => p.id))
      return await this.refreshCurrent()
    },
    async batchClose() {
      await stop(this.checkedPromotions.map(p => p.id))
      await this.refreshCurrent()
    },
    async refreshCurrent() {
      this.loading = true
      const currentPromotions = await queryPromotionByIds(this.currentItem.campaignIds)
      this.currentPromotions = this.sortCurrentPromotionsByStatus(currentPromotions)
      this.loading = false
    },
    sortCurrentPromotionsByStatus(promotions) {
      const sequence = [STATUS_ONLINE, STATUS_CREATED, STATUS_OFFLINE]
      return promotions.sort((pre, next) => sequence.indexOf(pre.status) - sequence.indexOf(next.status))
    },
    renewPromotion(promotion) {
      const { landingPage, duration, volume, id, achieved, renewDuration } = promotion
      const charge = chargeList.find(o => o.duration === duration && o.volume === volume).charge
      if (charge > this.f2y(this.balance)) {
        return this.$confirm('余额不足，请前往充值', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false
        }).then(res => {
          this.$router.push({ name: 'seo-charge'})
        }).catch(()=>{})
      }
  
      let oldPromotion = this.sites.find(v =>{
        const oldLandingPage = 'http://' + v.domain + '.mvp.baixing.com'
        return landingPage.trim() === oldLandingPage.trim()
      })
      if (!oldPromotion) {
        return this.$message.error('该官网不在用户官网列表中')
      }
      let avaliableTime = Math.ceil(2 * duration + renewDuration - achieved ) 
      const showExpireWarning = dayjs(oldPromotion.expireAt).subtract(avaliableTime, 'day').isBefore(dayjs(), 'day')
      if (showExpireWarning) {
        return this.$confirm('官网时长不足，请前往购买官网', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false
        }).then(res => {
          this.$router.push({ name: 'seo-charge'})
        }).catch(()=>{})
      }

      this.$confirm(`您正在对${landingPage}站点延长加速词包的推广服务时长，
      此次延长时长为${duration}天，将从您的扩资金池冻结${charge}元，请确认。`, '续费申请', {
          confirmButtonText: '确定续费',
          cancelButtonText: '我在想想'
        }).then(async () => {
          await renewCibaoPromotion({id, duration})
          await getCiBaoPromotionList()
        }).catch(() => {})
    },
    routerToCibaoUpdatePromotion(promotion) {
      this.$router.push({
        name:'seo-update-cibao-promotion',
        params: {
          id: promotion.id
        }
      })
    },
    async getCibaoPromotionList() {
      const { list, total } = await getCiBaoPromotionList({
        size: this.pageSize,
        page: this.currentPage
      })
      this.promotionCibaoList = list
      this.total = total
    },
    getResourceList() {
      if (this.type === CIBAO_TYPE) {
        this.getCibaoPromotionList()
      } else {
        this.loadPromotions()
      }
    },
    renderHeader(h,{column,index}) {
      let label = column.label;
      let labelArr = label.split('^^');
      return h('div',{
        style:{
         display:'flex',
         flexDirection:'column',
        }
      },[
        h('div',{
          style: {
            lineHeight: 1.5
          }
        },[labelArr[0]]),
        h('div', {
          style: {
            lineHeight: 1.5
          }
        },[labelArr[1]])
      ])
    },
    async exportCSV({id}){
      const date = dayjs().subtract(1, 'day').format('YYYYMMDD')
      const result = await exportCibaoPromotion({date, id})
      const { mobileList, pcList, type } = result
      const typeName = +type === +BAIDU_TYPE ? '百度':'360' 
      if (!mobileList && !pcList) {
        return this.$message.error('暂无数据，请稍后再试')
      }

      const json2csvParser = new Parser()
      if (mobileList) {
        const csvData = json2csvParser.parse(mobileList)
        const filename = `${typeName}移动[待填充]${date}`
        const blob = new Blob(['\uFEFF' + csvData], 
          { type: 'text/csv;charset=utf-8;' })
        FileSaver.saveAs(blob, filename)
      }

      if (pcList) {
        const csvData = json2csvParser.parse(pcList)
        const filename = `${typeName}pc[待填充]${date}`
        const blob = new Blob(['\uFEFF' + csvData], 
          { type: 'text/csv;charset=utf-8;' })
        FileSaver.saveAs(blob, filename)
      }
    }
  },
 async mounted() {
    let sites = await getUserSites()
    this.sites = sites 
    this.loadPromotions()
    this.loadBalance()
  },
  watch: {
    async currentItem(v) {
      if (v.campaignIds) {
        this.refreshCurrent()
      }
    },
    currentPage(v) {
      this.getResourceList()
    },
    type (newVal, oldVal) {
      this.currentPage = 1
      this.getResourceList()
    }
  }
}
</script>

<style lang="postcss" scoped>
.promotion-list {
  color: #666;
  border-radius: 4px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);

  & > header {
    font-weight: bold;
    margin-bottom: 20px;

    & > small {
      font-weight: normal;
      font-size: 0.8em;
      margin-left: 5px;
    }
  }
  & .create {
    margin-bottom: 20px;
  }
  & .choose-type {
    margin-bottom: 20px;
  }
}
.list-content {
  border-bottom: 1px solid #e9e9e9;
}
.list-header {
  text-indent: 18px;
  font-weight: 600;
  line-height: 38px;
  background-color: #ffebc8;
}
.list-item {
  border-left: 1px solid #e9e9e9;
  border-right: 1px solid #e9e9e9;
  cursor: default;
  line-height: 38px;
  user-select: none;
  &:nth-of-type(2n) {
    background-color: #fafafa;
  }
  & .batch {
    margin-left: 40px;
  }
  & .top-col {
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
    & .icon {
      color: #63b2e4;
      font-size: 16px;
      display: inline-block;
      width: 42px;
      line-height: 38px;
      text-indent: 14px;
    }
    & .title {
      margin-right: 26px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  font-size: 14px;

  & > thead {
    font-weight: bold;
  }
  & > tbody {
    & td {
      border-bottom: 1px solid #ddd;
    }
    & > tr:hover {
      background-color: #f0f0f0;
    }
  }
}

.top-tip {
  padding-left: 20px;
  & .label {
    line-height: 1.3;
    & >>> span {
      display: block;
    }
  }
}

.row {
  display: flex;
  align-items: center;
  padding-left: 40px;
  & > * {
    text-align: center;
  }
  &.header {
    & .col3 {
      text-indent: 10px;
      & >>> .el-tooltip {
        margin-left: -2px !important;
      }
    }
    & .col6 {
      text-indent: 1.5em;
    }
    & .col9 {
      line-height: 1.3;
    }
  }
  &.body {
    & .col1 {
      padding-left: 8px;
    }
    & .col3 {
      text-indent: -8px;
    }
  }
}
.col1 {
  text-align: left;
  width: 4%;
}
.col2 {
  width: 5%;
}
.col3 {
  width: 95px;
}
.col4 {
  width: 6%;
}
.col5 {
  min-width: 15em;
  width: 14%;
}
.col6 {
  min-width: 120px;
  text-align: left;
  width: 10%;
}
.col7 {
  width: 110px;
}
.col8 {
  width: 110px;
}
.col9 {
  width: 100px;
}
.col10 {
  width: 7%;
}
.col11 {
  width: 12%;
}
</style>

<style lang="postcss">
.cibao-table {
  border: 1px solid #e9e9e9;
  border-bottom: 0;
  & tr {
    & th {
      background: #ffebc8;
      padding: 6px 0;
      color: #666;
    }
    & td {
      padding: 6px 0;
    }
  }
  & .cell {
    padding: 0 6px 0 6px;
  }
}
</style>
