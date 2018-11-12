<template>
  <div class="layout-container">
    <div class="layout-left">
      <h5 class="layout-header">精品官网概览</h5>
      <div class="layout-content">
        <div class="report">
          <div class="radio-group">
            <el-radio>今日</el-radio>
            <el-radio>昨日</el-radio>
            <el-radio>过去7天</el-radio>
          </div>
          <ul class="data-list">
            <li class="data">
              <h6 class="title">访问量</h6>
              <p class="num">12</p>
            </li>
            <li class="data">
              <h6 class="title">访问人数</h6>
              <p class="num">12</p>
            </li>
          </ul>
        </div>
        <div class="description">
          <p>您当前的官网的浏览量较低，</p>
          <p>打败了<strong>5%</strong>同行业客户</p>
          <p>建议您进行<a href="javascript:;">站外推广</a>或<a href="javascript:;">标王推广</a>，提升官网访问量</p>
          <div class="actions">
            <el-button type="primary">购买与续费</el-button>
            <el-button type="primary">查看详情</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="layout-right">
      <h5 class="layout-header">
        官网留言通知
        <span class="action" v-if="notices && notices.length">更多</span>
      </h5>
      <ul class="notice-list" v-if="notices">
        <template v-if="notices.length">
          <li
            class="notice-item"
            v-for="notice in notices"
            :key="notice.id"
          >
            2018.9.21 【站外推广】您的计划（id）由于（xx原因）未通过，请去广告系统修改后重新提交！
          </li>
        </template>
        <div v-else class="notice-placeholder"><i class="el-icon-info" />暂无官网留言通知</div>
      </ul>
    </div>
  </div>
</template>

<script>
import store from './store'

export default {
  name: 'homepage-site',
  fromMobx: {
    notices: () => store.notices.fengming
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
          padding: 8px 12px;
        }
      }
    }
  }
  .notice-list {
    color: #666;
    font-size: 14px;
    & .notice-item {
      margin-top: 20px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .notice-placeholder {
    height: 184px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 16px;
    & .el-icon-info {
      margin-right: 4px;
    }
  }
</style>
