<template>
  <div class="list-container">
    <div class="list-header">推广落地页</div>
    <ul class="list-content">
      <li class="list-item">
        <div class="top-col">
          <i class="el-icon-plus icon" />
          <span class="title">标题标题标标题标题题</span>
          <strong class="type">帖</strong>
          <strong class="type">官</strong>
          <strong class="hint">渠</strong>
        </div>
        <table class="table-container">
          <tr class="tr">
            <th class="col1">计划id</th>
            <th class="col2">状态</th>
            <th class="col3">渠道</th>
            <th class="col4"><top-tip label="今日预算" tip="该计划今日已消耗的上限"/></th>
            <th class="col5"><top-tip label="今日消耗" tip="该计划今日已消耗的金额"/></th>
            <th class="col6">关键词平均排名</th>
            <th class="col7">操作</th>
          </tr>
          <tr class="tr">
            <td class="col1">
              <span class="t">1234</span>
              <strong class="hint">创</strong>
              <strong class="hint">词</strong>
              <strong class="hint">设</strong>
              <strong class="hint">关</strong>
            </td>
            <td class="col2">
              <span>推广中</span>
            </td>
            <td class="col3">百度</td>
            <td class="col4">
              <span>100</span>
            </td>
            <td class="col5">20</td>
            <td class="col6">3.5</td>
            <td class="col7">
              <a href="javascript:;" class="btn">暂停</a>
              <a href="javascript:;" class="btn">优化</a>
              <a href="javascript:;" class="btn">复制</a>
            </td>
          </tr>
        </table>
      </li>
    </ul>
  </div>
</template>

<script>
import TopTip from './topTip.js'
export default {
  name: 'promotion-list',
  data() {
    return {
      expands: []
    }
  },
  components: {TopTip}
}
</script>

<style lang="postcss" scoped>
  .list-header {
    text-indent: 18px;
    font-weight: 600;
    line-height: 38px;
    background-color: #FFEBC8;
  }
  .list-content {
    border-bottom: 1px solid #e9e9e9;
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
    & .top-col {
      & .icon {
        color: #63B2E4;
        font-size: 16px;
        cursor: pointer;
        display: inline-block;
        width: 42px;
        line-height: 38px;
        text-indent: 14px;
      }
      & .title {
        width: 28%;
      }
    }
    & .type {
      color: #B08F31;
      text-shadow: 0px 1px 1px #f8d36b; 
    }
    & .hint {
      color: #B66969;
      text-shadow: 0px 1px 1px #f5b1b1; 
    }
  }
  .table-container {
    width: 100%;
    & > .tr {
      &:not(:last-child) {
        & .col {
          border-bottom: 1px solid #f0f0f0;
        }
      }
    }
    /* width: 985 */
    & .col1 {
      width: 30%;
      padding-left: 74px;
      & .t {
        margin-right: 20px;
      }
    }
    & .col2 {
      width: 9%;
    }
    & .col3 {
      width: 5%;
      text-align: center;
    }
    & .col4 {
      width: 12%;
      text-align: center;
    }
    & .col5 {
      width: 8%;
      text-align: center;
    }
    & .col6 {
      text-align: center;
    }
    & .col7 {
      text-align: center;
      & .btn {
        color: #35A5E4;
        margin-right: 8px;
      }
    }
  }
</style>
