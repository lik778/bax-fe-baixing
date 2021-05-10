<template>
  <div class="layout-container">
    <div class="layout-left">
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
  data () {
    return {
      selectedReportKey: 'yesterday'
    }
  },
  components: { Notice },
  fromMobx: {
    isHasSite: () => store.kaSiteData && !!store.kaSiteData.sites.length,
    kaSiteReports: () => store.kaSiteData ? store.kaSiteData.reports : {},
    notices: () => store.notices.kaSite
  },
  computed: {
    selectedReport () {
      return this.kaSiteReports[this.selectedReportKey] || { pv: 0, uv: 0 }
    }
  },
  methods: {
    goKaSiteLList () {
      window.location.href = '/ka/main'
    },
    handleMoreBtnClick () {
      const notices = this.notices
      if (notices.length === 1) {
        // 跳转到站点的留言列表
        const siteId = notices[0].siteId
        location.href = `/ka/edit/sites/${siteId}/messages`
      } else {
        // 跳转到站点列表
        this.goKaSiteLList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
      margin-top: 16px;
      & /deep/ .el-button {
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
.no-site-placeholder {
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  color: #999;
  & > .text {
    margin-bottom: 20px;
  }
}
</style>
