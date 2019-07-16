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
          <p class="title">{{item.landingPage}} - {{item.seoIncludedAt ? formatTime(item.seoIncludedAt) + '收录' : '未收录'}}</p>
        </div>
        <div class="batch" v-if="item === currentItem" >
          <el-button :disabled="!canBatchOpen" @click="batchOpen" type="text">批量开启</el-button>
          <el-button :disabled="!canBatchClose" @click="batchClose" type="text">批量关闭</el-button>
        </div>
        <table v-if="item === currentItem" class="table-container">
          <thead>
            <th>多选</th>
            <th>计划id</th>
            <th><top-tip label="计划状态" tip="计划状态中待投放的状态解释：您有效的关键词推广计划不足4个，请至少创建4个关键词后开启投放" /></th>
            <th>审核状态</th>
            <th>关键词</th>
            <!-- <th>关键词来源</th> -->
            <th>投放平台</th>
            <th>创建时间</th>
            <th><top-tip label="最新排名" tip="前10名即认为在首页;10~100名表示在上浮中;100+表示仍需优化，超过30天100+可换词"/></th>
            <th><top-tip label="达标天数" tip="上首页即为达标，达标后产生扣费" /></th>
            <th>当前单价</th>
            <th>总扣款</th>
            <th>操作</th>
          </thead>
          <tbody v-if="!loading">
            <template v-for="promotion in currentPromotions">
              <tr v-for="(keyword, index) in promotion.words" :key="keyword.id">
                <td class="checkbox" rowspan="2" v-if="index === 0"><el-checkbox :checked="checkedPromotions.includes(promotion)" @change="v => onCheck(promotion, v)" /></td>
                <td>{{promotion.id}}</td>
                <td>{{statusMap[keyword.status]}}</td>
                <td>{{auditStatusMap[keyword.auditStatus]}}</td>
                <td>{{keyword.word}}</td>
                <!-- <td>{{keywordType[keyword.source]}}</td> -->
                <td>{{platform[keyword.platform]}}</td>
                <td>{{formatTime(keyword.createdAt * 1000)}}</td>
                <td>{{keyword.ranking}}</td>
                <td>{{keyword.qualifiedDays}}</td>
                <td>{{f2y(keyword.price)}}</td>
                <td>{{f2y(keyword.totalCost)}}</td>
                <td rowspan="2" v-if="index === 0"><el-button v-if="canUpdate(promotion)" type="text" @click="$router.push({name: 'seo-update-promotion', params: {id: promotion.id}})">修改</el-button></td>
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
import  {queryPromotion, queryPromotionByIds, start, pause, getBalance} from 'api/seo'
import {
  status as statusMap,
  auditStatus as auditStatusMap,
  STATUS_OFFLINE,
  STATUS_CREATED,
  platform,
  keywordType,
  AUDIT_STATUS_REJECTED
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
      currentPage: 0,
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
      return this.checkedPromotions.length && this.checkedPromotions.every(p => [STATUS_OFFLINE, STATUS_CREATED].includes(p.status))
    },
    canBatchClose() {
      return this.checkedPromotions.length && this.checkedPromotions.every(p => [STATUS_CREATED].includes(p.status) || p.isRenewed)
    }
  },
  methods: {
    async loadBalance() {
      const d = await getBalance()
      this.balance = d.balance
    },
    f2y,
    formatTime(date) {
      return dayjs(date).format('YYYY.MM.DD HH:mm')
    },
    canUpdate(promotion) {
      if (promotion.auditStatus === AUDIT_STATUS_REJECTED) return true
      const {createdAt, seoIncludedAt, rank} = promotion
      const nearest = Math.max(createdAt, seoIncludedAt)
      return dayjs(nearest).add(30, 'days').isAfter(dayjs(), 'day') && rank > 100
    },
    async loadPromotions() {
      const {list, total} = await queryPromotion({page: this.currentPage, size: this.pageSize})
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
      await this.refreshCurrent()
    },
    async batchClose() {
      await pause(this.checkedPromotions.map(p => p.id))
      await this.refreshCurrent()
    },
    async refreshCurrent() {
      this.loading = true
      this.currentPromotions = await queryPromotionByIds(this.currentItem.campaignIds)
      console.log(this.currentPromotions)
      this.loading = false
    }
  },
  mounted() {
    console.log(this.auditStatusMap)
    this.loadPromotions()
    this.loadBalance()
  },
  watch: {
    async currentItem(v) {
      if (v.campaignIds) {
        this.refreshCurrent()
      }
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
      width: 33%;
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
    & > th:first-of-type {
      padding-left: 40px;
    }
    & > th {
      padding-right: 20px;
    }
  }
  & > tbody {
    & td.checkbox {
      padding-left: 40px;
    }
    & td {
      border-bottom: 1px solid #ddd;
    }
    & > tr::hover {
      background-color: #f0f0f0;
    }
  }
}
</style>
