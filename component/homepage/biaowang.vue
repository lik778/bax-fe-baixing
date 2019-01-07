<template>
  <div class="layout-container">
    <div class="layout-left">
      <h5 class="layout-header">标王推广概览</h5>
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
          <p>与同行客户相比，您的标王推广为您多获得了</p>
          <p><strong>5%</strong>展现次数</p>
          <p>
            您还有标王关键词没有生效，
            <a href="javascript:;">点此查看</a>
          </p>
          <div class="actions">
            <el-button type="primary">立即购买</el-button>
            <el-button type="primary">立即续费</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="layout-right">
      <h5 class="layout-header">
        标王推广数据概览
        <span class="action">查看详情</span>
      </h5>
      <div class="layout-content">
        <dl class="dl-wrap">
          <dt class="dt wrap">
            <span class="col">有效关键词</span>
            <span class="col">昨日排名</span>
            <span class="col">剩余天数</span>
            <span class="col action"></span>
          </dt>
          <dd class="dd wrap">
            <span class="col">关键词1</span>
            <span class="col">4</span>
            <span class="col">17/30天</span>
            <span class="col action">续费</span>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'homepage-biaowang'
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
  .layout-right {
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
        flex: 1;
        &.action {
          cursor: pointer;
          color:  #ED7D00;
        }
      }
    }
  }
</style>
