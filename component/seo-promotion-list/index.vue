<template>
  <div class="promotion-list">
    <header>我的首页宝推广计划<small>您的首页宝推广余额为 {{f2y(balance)}} 元</small></header>

    <router-link :to="{name: 'seo-create-promotion'}"><el-button class="create" type="primary">新建首页宝计划</el-button></router-link>

    <div class="list-header">推广落地页</div>
    <ul v-loading="loading" class="list-content">
      <li v-for="item in promotionsGroupByLanding" :key="item.landingPage" class="list-item">
        <div class="top-col" @click="currentItem === item ? currentItem = {} : currentItem = item">
          <i
            class="icon"
            :class="item === currentItem ? 'el-icon-minus' : 'el-icon-plus'"
          />
          <p class="title">{{item.landingPage}} - {{item.seoIncludedAt ? formatTime(item.seoIncludedAt * 1000) + ' 收录' : '未收录'}}</p>
        </div>
        <div class="batch" v-if="item === currentItem" >
          <el-button :disabled="!canBatchOpen" @click="batchOpen" type="text">批量开启</el-button>
          <el-button :disabled="!canBatchClose" @click="batchClose" type="text">批量关闭</el-button>
        </div>
        <table v-if="item === currentItem" class="table-container">
          <thead class="row header">
            <th class="col1">多选</th>
            <th class="col2">计划id</th>
            <th class="col3"><top-tip label="计划状态" tip="计划状态中待投放的状态解释：您有效的关键词推广计划不足4个，请至少创建4个关键词后开启投放" /></th>
            <th class="col4">审核状态</th>
            <th class="col5">关键词</th>
            <!-- <th>关键词来源</th> -->
            <th class="col6">创建时间</th>
            <th class="col7"><top-tip wrap-class="top-tip" label-class="label" label="最新排名<span>(PC/手机)</span>" tip="前10名即认为在首页;10~100名表示在上浮中;100+表示仍需优化，超过30天100+可换词"/></th>
            <th class="col8"><top-tip wrap-class="top-tip" label-class="label" label="达标天数<span>(PC/手机)</span>" tip="上首页即为达标，达标后产生扣费" /></th>
            <th class="col9">当前单价<p>(每端)</p></th>
            <th class="col10">总扣款</th>
            <th class="col11">操作</th>
          </thead>
          <tbody v-if="!loading">
            <template v-for="promotion in currentPromotions">
              <tr v-for="keyword in promotion.words.slice(0, 1)" :key="keyword.id" class="row body">
                <td class="col1">
                  <el-checkbox :checked="checkedPromotions.includes(promotion)" @change="v => onCheck(promotion, v)" />
                </td>
                <td class="col2">{{promotion.id}}</td>
                <td class="col3">{{statusMap[promotion.status]}}</td>
                <td class="col4">{{auditStatusMap[keyword.auditStatus]}}</td>
                <td class="col5">{{keyword.word}}</td>
                <!-- <td>{{keywordType[keyword.source]}}</td> -->
                <td class="col6">{{formatTime(keyword.createdAt * 1000)}}</td>
                <td class="col7">{{formatRanking(keyword.ranking)}} / {{formatRanking(promotion.words[1].ranking)}}</td>
                <td class="col8">{{keyword.qualifiedDays}} / {{promotion.words[1].qualifiedDays}}</td>
                <td class="col9">{{f2y(keyword.price)}}</td>
                <td class="col10">{{f2y(keyword.totalCost + promotion.words[1].totalCost) }}</td>
                <td class="col11">
                  <span v-if="!canUpdate(promotion) && !canRestart(promotion)">-</span>
                  <el-button v-if="canUpdate(promotion)" type="text" @click="$router.push({name: 'seo-update-promotion', params: {id: promotion.id}})">修改</el-button>
                  <el-button v-if="canRestart(promotion)" type="text" @click="onRestart(promotion)">重新投放</el-button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </li>
    </ul>

    <el-pagination
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
      :page-size="pageSize"
      :total="total"
    />

  </div>
</template>

<script>
import TopTip from '../qwt-promotion-list/topTip'
import  {queryPromotion, queryPromotionByIds, start, stop, getBalance, restart} from 'api/seo'
import {
  status as statusMap,
  auditStatus as auditStatusMap,
  STATUS_OFFLINE,
  STATUS_CREATED,
  platform,
  keywordType,
  AUDIT_STATUS_REJECTED,
  AUDIT_STATUS_PASSED
  } from 'constant/seo'
import dayjs from 'dayjs';
import {
  f2y
} from 'util'

export default {
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
      balance: 0
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
        return this.refreshCurrent()
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
      const {createdAt, seoIncludedAt, rank} = promotion
      const nearest = Math.max(createdAt, seoIncludedAt)
      return dayjs(nearest).add(30, 'days').isAfter(dayjs(), 'day') && rank > 100
    },
    async loadPromotions() {
      const {list, total} = await queryPromotion({page: this.currentPage - 1, size: this.pageSize})
      this.promotionsGroupByLanding = list
      this.total = total
    },
    handlePageChange(page) {
      this.currentPage = page
      console.log(this.currentPage)
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
      this.currentPromotions = await queryPromotionByIds(this.currentItem.campaignIds)
      this.loading = false
    }
  },
  mounted() {
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
      this.loadPromotions()
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
  box-shadow: 0 2px 9px 0 rgba(83,95,127,.1);

  & > header {
    font-weight: bold;
    margin-bottom: 20px;

    & > small {
      font-weight: normal;
      font-size: .8em;
      margin-left: 5px;
    }
  }
  & .create {
    margin-bottom: 40px;
  }
}
.list-content {
  border-bottom: 1px solid #e9e9e9;
}
.list-header {
  text-indent: 18px;
  font-weight: 600;
  line-height: 38px;
  background-color: #FFEBC8;
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
      color: #63B2E4;
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
