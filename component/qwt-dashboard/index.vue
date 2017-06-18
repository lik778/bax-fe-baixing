
<template>
  <div class="qwt-dashboard">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 数据报表</label>
    </topbar>
    <main>
      <section>
        <aside>选择渠道:</aside>
        <span>
          <bax-select :options="[]" />
        </span>
      </section>
      <section>
        <aside>数据维度:</aside>
        <span>
          <i>计划维度</i>
          <i style="width: 94px;">关键词维度</i>
        </span>
      </section>
      <section>
        <aside>推广日期:</aside>
        <span>
          <i>近7天</i>
          <i>近1个月</i>
          <i>自定义</i>
        </span>
      </section>
      <section>
        <aside>推广设备:</aside>
        <span>
          <i>全部</i>
          <i>PC</i>
          <i>WAP</i>
        </span>
      </section>
      <section>
        <aside>时间单位:</aside>
        <span>
          <i>每日</i>
          <i>每周</i>
          <i>每月</i>
        </span>
      </section>
      <section>
        <aside>计划/关键词筛选:</aside>
        <span>
          <bax-select :options="[]" />
        </span>
      </section>
      <data-trend />
      <data-detail />
    </main>
  </div>
</template>

<script>

import BaxSelect from 'com/common/select'
import DataDetail from './data-detail'
import DataTrend from './data-trend'
import Topbar from 'com/topbar'

export default {
  name: 'qwt-dashboard',
  components: {
    DataDetail,
    DataTrend,
    BaxSelect,
    Topbar
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  }
}

</script>

<style scoped>

@import 'cssbase/mixin';

.qwt-dashboard {
  padding: 0 35px;
  width: 100%;

  & > main {
    & > section {
      margin: 20px 0;

      & > aside {
        font-size: 14px;
        color: #6a778c;
        min-width: 90px;
      }

      & > span {
        display: inline-flex;
        align-items: center;

        & i {
          @mixin center;
          height: 22px;
          min-width: 74px;
          margin-right: 30px;
          cursor: pointer;
          border-radius: 4px;
          background: #eff2f7;
          font-size: 13px;
          line-height: 1.08;
          text-align: center;
          color: #6a778c;
        }
      }
    }

    & > section:last-child {
      & > aside {
        width: 135px;
        min-width: 135px;
      }
    }
  }
}

</style>
