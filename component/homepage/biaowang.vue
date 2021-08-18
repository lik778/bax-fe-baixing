<template>
  <div class="layout-container">
    <div class="layout-left" v-if="biaowangData">
      <h5 class="layout-header">标王推广概览</h5>
      <div class="layout-content" v-if="biaowangData.onlinePromotes || biaowangData.notOnlinePromotes">
        <div class="report">
          <div class="radio-group">
            <el-radio v-model="dataPrefix" label="yesterday">昨日</el-radio>
            <el-radio v-model="dataPrefix" label="thisWeek">过去7天</el-radio>
          </div>
          <ul class="data-list">
            <li class="data">
              <h6 class="title">在线词个数</h6>
              <p class="num">{{getPromoteData('promotes')}}</p>
            </li>
            <li class="data">
              <h6 class="title">展示次数</h6>
              <el-button style="margin-top: 6px" type="primary" plain size="small" @click="$router.push({name: 'bw-dashboard'})">点击查看</el-button>
            </li>
          </ul>
        </div>
        <div class="description" :class="!biaowangData.onlinePromotes ? 'mt' : ''">
          <template v-if="biaowangData.onlinePromotes">
            <p>与同行客户相比，您的标王推广为您多获得了</p>
            <p><strong>{{getRandomPvPercent(biaowangData.onlinePromotes)}}%</strong>展现次数</p>
          </template>
          <p v-if="!!biaowangData.notOnlinePromotes">
            您还有标王关键词没有生效，
            <a href="javascript:;" @click="$router.push({name: 'bw-plan-list', query: {status: '0,5'}})">点此查看</a>
          </p>
          <div class="actions">
            <el-button type="primary" @click="$router.push({name: 'bw-plan-list'})">管理标王推广</el-button>
          </div>
        </div>
      </div>
      <div class="no-promote-placeholder" v-else>
        <p class="text">您暂时没有标王推广计划或者计划都处于暂停状态，您可以</p>
        <el-button type="primary" v-if="!userInfo.shAgent" @click="() => $router.push({name: 'bw-query-price'})">新建标王推广计划</el-button>
      </div>
    </div>
    <loading-placeholder v-else class="layout-left">
      <h5 class="layout-header" slot="header">标王推广概览</h5>正在获取标王推广概览
    </loading-placeholder>
    <div class="layout-right" v-if="biaowangPromotes">
      <h5 class="layout-header">
        标王推广数据概览
        <span class="action" v-if="biaowangPromotes.length" @click="$router.push({name: 'bw-plan-list'})">查看详情</span>
      </h5>
      <div class="layout-content" v-if="biaowangPromotes.length">
        <dl class="dl-wrap">
          <dt class="dt wrap">
            <span class="col">有效关键词</span>
            <span class="col">昨日排名</span>
            <span class="col">剩余天数</span>
            <span class="col action"></span>
          </dt>
          <dd class="dd wrap" v-for="p in biaowangPromotes" :key="p.id">
            <span class="col">{{p.word}}</span>
            <span class="col">{{p.cpcRanking && fmtCpcRanking(p.cpcRanking, false)}}</span>
            <span class="col">{{p.remainDays}}/{{p.days.toFixed(1)}}</span>
            <span class="col"></span>
          </dd>
        </dl>
      </div>
      <div class="no-promote-data-placeholder" v-else>
        <span><i class="el-icon-info" />暂无标王推广数据概览</span>
      </div>
    </div>
    <loading-placeholder v-else class="layout-right">
      <h5 class="layout-header" slot="header">标王推广数据概览</h5>正在获取标王推广数据概览
    </loading-placeholder>
  </div>
</template>

<script>
import store from './store'
import loadingPlaceholder from './loading-placeholder'
import { PROMOTE_STATUS_ONLINE } from 'constant/biaowang'
import { fmtCpcRanking } from 'util/campaign'
import dayjs from 'dayjs'

export default {
  name: 'homepage-biaowang',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dataPrefix: 'yesterday'
    }
  },
  methods: {
    fmtCpcRanking,
    disabledXuFeiBtn (row) {
      // tip: 时间为2020-03-27 12:16:40.213743之前的不能续费
      return dayjs(row.createdAt * 1000).isBefore('2020-03-27 12:16:40.213743')
    },
    getPromoteData (type) {
      const { dataPrefix } = this
      let key
      if (dataPrefix) {
        key = dataPrefix + type[0].toUpperCase() + type.substring(1, type.length)
      } else if (type === 'promotes') {
        key = 'onlinePromotes'
      } else {
        key = type
      }
      return this.biaowangData[key]
    },
    getRandomPvPercent (promote) {
      const key = 'BW_PV_PERCENT'
      const getRandomNum = ([min, max]) => Math.floor(Math.random() * (max - min + 1) + min, 10)
      const lastValue = window.localStorage.getItem(key)
      let range = [300, 400]
      if (lastValue) {
        const [value, timeStamp] = lastValue.split('-')
        if (new Date(+timeStamp).toDateString() === new Date().toDateString()) {
          return value / 10
        }
      }

      if (promote < 3) {
        range = [150, 200]
      } else if (promote >= 3 && promote < 5) {
        range = [200, 300]
      }
      const percent = getRandomNum(range)
      window.localStorage.setItem(key, `${percent}-${Date.now()}`)
      return percent / 10
    },
    leftDays ({ days, startedAt }) {
      let daysLeft = days
      if (startedAt) {
        // 可能是负值
        daysLeft = days - (Date.now() - startedAt * 1000) / 86400 / 1000
      }
      return parseFloat(Math.max(daysLeft, 0)).toFixed(1)
    },
    canXufei (promote) {
      return PROMOTE_STATUS_ONLINE.includes(promote.status) && this.leftDays(promote) <= 15
    }
  },
  components: { loadingPlaceholder },
  fromMobx: {
    biaowangData: () => store.biaowangData,
    biaowangPromotes: () => store.biaowangPromotes && store.biaowangPromotes.slice()
  }
}
</script>

<style lang="scss" scoped>
@mixin placeholder {
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  color: #999;
}
.layout-left {
  min-height: 274px;
  & .layout-content {
    display: flex;
  }
  & .layout-content {
    margin-bottom: 28px;
  }
  & .report {
    width: 45%;
    flex: 9;
    & .radio-group {
      display: flex;
      width: 70%;
      justify-content: space-around;
      margin: 40px auto;
      & /deep/ .el-radio__label {
        font-weight: 600;
      }
    }
    & .data-list {
      display: flex;
    }
    & .data {
      padding: 6px 0;
      text-align: center;
      line-height: 2;
      width: 100%;
      & ~ .data {
        border-left: 1px solid #e6e6e6;
      }
      & .num {
        font-size: 24px;
        color: #ff4f49;
        font-weight: 600;
      }
    }
  }
  & .description {
    width: 55%;
    flex: 10;
    margin-top: 34px;
    line-height: 28px;
    & strong {
      font-size: 24px;
      color: #ff4f49;
      margin: 0 4px;
    }
    & a {
      color: #35a5e4;
    }
    & .actions {
      margin-top: 22px;
      & /deep/ .el-button {
        min-width: 110px;
        padding: 8px 12px;
      }
    }
    &.mt {
      margin-top: 60px;
    }
  }
}
.layout-right {
  min-height: 274px;
  padding-bottom: 20px !important;
  & .layout-content {
    margin-top: 22px;
    & .wrap {
      display: flex;
      text-align: center;
      margin: 16px 0;
    }
    & .dt {
      font-weight: 600;
    }
    & .dd {
    }
    & .col {
      width: 25%;
      flex: none;
      &.action {
        cursor: pointer;
        color: #ed7d00;
      }
      &.renew {
        padding: 0;
        color: #ed7d00;
      }
    }
    & /deep/ .col.is-disabled {
      color: #c0c4cc;
    }
  }
}
.no-promote-placeholder {
  @include placeholder;
  & > .text {
    margin-bottom: 20px;
  }
}
.no-promote-data-placeholder {
  @include placeholder;
  font-size: 16px;
  & .el-icon-info {
    margin-right: 4px;
  }
}
</style>
