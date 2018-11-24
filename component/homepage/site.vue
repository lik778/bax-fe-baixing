<template>
  <div class="layout-container">
    <div class="layout-left">
      <h5 class="layout-header">精品官网概览</h5>
      <div class="layout-content">
        <div class="report">
          <div class="radio-group">
            <el-radio v-model="selectedReportKey" label="yesterday">昨日</el-radio>
            <el-radio v-model="selectedReportKey" label="weekly">过去7天</el-radio>
          </div>
          <ul class="data-list">
            <li class="data">
              <h6 class="title">访问量</h6>
              <p class="num">{{selectedReport.pv}}</p>
            </li>
            <li class="data">
              <h6 class="title">访问人数</h6>
              <p class="num">{{selectedReport.uv}}</p>
            </li>
          </ul>
        </div>
        <div class="description">
          <p>您当前的官网的浏览量较低，</p>
          <p>打败了<strong>{{siteBeatPercent}}%</strong>同行业客户</p>
          <p>建议您进行
            <a href="javascript:;" @click="() => $router.push({name: 'qwt-create-promotion'})">站外推广</a>或
            <a href="javascript:;">标王推广</a>，提升官网访问量
          </p>
          <div class="actions">
            <el-button type="primary" @click="() => $router.push({name: 'qwt-charge', query: {select_gw: 1}})">购买与续费</el-button>
            <el-button type="primary" @click="goKaSiteLList">查看详情</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="layout-right">
      <h5 class="layout-header">
        官网留言通知
        <span class="action" v-if="notices && notices.length" @click="handleMoreBtnClick">更多</span>
      </h5>
      <notice :notice-list="notices" type="site" height="198px">
        <p slot-scope="{notice}" class="notice">
          {{notice.formatDate(new Date(notice.createdAt))}}&nbsp;&nbsp;
          {{notice.name}} ({{notice.mobile}}) 给您留言：
          <br />{{notice.content}}
        </p>
      </notice>
    </div>
  </div>
</template>

<script>
import store from './store'
import Notice from './notice'


export default {
  name: 'homepage-site',
  data() {
    return {
      selectedReportKey: 'today'
    }
  },
  components: {Notice},
  fromMobx: {
    kaSiteReports: () => store.kaSiteData ? store.kaSiteData.reports : {},
    siteBeatPercent: () => store.fengmingData && store.fengmingData.beatPeerPercent.toFixed(1),
    notices: () => store.notices.kaSite
  },
  computed: {
    selectedReport() {
      return this.kaSiteReports[this.selectedReportKey] || {pv: 0, uv: 0}
    }
  },
  methods: {
    goKaSiteLList() {
      window.location.href = '/ka/main'
    },
    handleMoreBtnClick() {
      const notices = this.notices
      if (notices.length === 1) {
        // 跳转到站点的留言列表
        const siteId = notices[0].siteId
      } else {
        // 跳转到站点列表
        this.goKaSiteLList()
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
  .layout-left {
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
        margin-top: 16px;
        & >>> .el-button {
          min-width: 110px;
          padding: 8px 12px;
        }
      }
    }
  }
  .notice {
    text-indent: 0;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
</style>
