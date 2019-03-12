<template>
  <div class="layout-container">
    <div class="layout-left" v-if="biaowangData">
      <h5 class="layout-header">标王推广概览</h5>
      <div class="layout-content">
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
              <p class="num">{{getPromoteData('pv')}}</p>
            </li>
          </ul>
        </div>
        <div class="description">
          <p>与同行客户相比，您的标王推广为您多获得了</p>
          <p><strong>{{getRandomPvPercent(biaowangData.onlinePromotes)}}%</strong>展现次数</p>
          <p v-if="!!biaowangData.notOnlinePromotes">
            您还有标王关键词没有生效，
            <a href="javascript:;" @click="$router.push({name: 'bw-plan-list', query: {status: '0,5'}})">点此查看</a>
          </p>
          <div class="actions">
            <el-button type="primary" @click="$router.push({name: 'bw-query-price'})">立即购买</el-button>
            <el-button type="primary" @click="$router.push({name: 'qwt-charge'})">立即续费</el-button>
          </div>
        </div>
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
      <div class="layout-content">
        <dl class="dl-wrap">
          <dt class="dt wrap">
            <span class="col">有效关键词</span>
            <span class="col">昨日排名</span>
            <span class="col">剩余天数</span>
            <span class="col action"></span>
          </dt>
          <dd class="dd wrap" v-for="p in biaowangPromotes" :key="p.id">
            <span class="col">{{p.word}}</span>
            <span class="col">{{p.cpcRank}}</span>
            <span class="col">{{leftDays(p)}}/{{p.days.toFixed(1)}}</span>
            <span v-if="canXufei(p)" class="col action" @click="$router.push({name: 'bw-plan-list', params: {promote: p}})">续费</span>
            <span class="col"></span>
          </dd>
        </dl>
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

export default {
  name: 'homepage-biaowang',
  data() {
    return {
      dataPrefix: 'yesterday'
    }
  },
  methods: {
    getPromoteData(type) {
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
    getRandomPvPercent(promote) {
      const key = 'BW_PV_PERCENT'
      const getRandomNum = ([min, max]) => Math.floor(Math.random()*(max-min+1)+min,10)
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
    leftDays({days, startedAt}) {
      let daysLeft = days
      if (startedAt) {
        // 可能是负值
        daysLeft = days - (Date.now() - startedAt * 1000) / 86400 / 1000
      }
      return parseFloat(Math.max(daysLeft, 0)).toFixed(1)
    },
    canXufei(promote) {
      return PROMOTE_STATUS_ONLINE.includes(promote.status) && this.leftDays(promote) <= 15
    },
  },
  components: {loadingPlaceholder},
  fromMobx: {
    biaowangData: () => store.biaowangData,
    biaowangPromotes: () => store.biaowangPromotes && store.biaowangPromotes.slice()
  }
}
</script>

<style lang="postcss" scoped>
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
        & >>> .el-radio__label {
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
          color: #FF4F49;
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
        color: #FF4F49;
        margin: 0 4px;
      }
      & a {
        color: #35A5E4;
      }
      & .actions {
        margin-top: 22px;
        & >>> .el-button {
          min-width: 110px;
          padding: 8px 12px;
        }
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
          color:  #ED7D00;
        }
      }
    }
  }
</style>
