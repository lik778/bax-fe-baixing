<template>
  <div class="card">
    <header>
      <strong>{{ title }}</strong>
    </header>
    <content>
      <aside>
        <div>
          <span>
            <h3>{{ summary.consume / 100 }}</h3>
            <p>今日消耗</p>
          </span>
          <span class="border">
            <h3>{{ summary.budget / 100 }}</h3>
            <p>今日预算</p>
          </span>
        </div>
        <router-link :to="{name: campaignListName}">
          计划管理
        </router-link>
      </aside>
      <aside>
        <div>
          <span class="border">
            <h3>{{ summary.shows || 0 }}</h3>
            <p>展示量</p>
          </span>
          <span>
            <h3>{{ summary.clicks || 0 }}</h3>
            <p>点击量</p>
          </span>
        </div>
        <router-link :to="{name: dashboardName}"
          @click.native="onClickDetail">
          计划报表
        </router-link>
      </aside>
    </content>
    <footer>
      <bx-icon type="infocircleo"></bx-icon>
      <span>
        以上均为今日数据，了解详细数据请点击计划报表
      </span>
    </footer>
  </div>
</template>

<script>
import BxIcon from 'com/widget/icon'

import track from 'util/track'

export default {
  name: 'qwt-homepage-campaign',
  components: {
    BxIcon
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    summary: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'qwt' // qwt, mvp
    }
  },
  computed: {
    title() {
      return this.type === 'mvp' ? '智能推广情况' : '推广情况'
    },
    dashboardName() {
      return this.type === 'mvp' ? 'mvp-dashboard' : 'qwt-dashboard'
    },
    campaignListName() {
      return this.type === 'mvp' ? 'mvp-campaign-list' : 'qwt-promotion-list'
    }
  },
  methods: {
    onClickDetail() {
      const { userInfo } = this
      const type = this.type === 'mvp' ? 'mvp' : 'qwt'

      track({
        action: `homepage campaign: click ${type} campaign detail`,
        baixingId: userInfo.baixingId,
        baxId: userInfo.id
      })
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/var';
@import 'cssbase/mixin';

.border {
  border-right: solid 1px #e6e6e6;
}

.card {
  width: 694px;
  height: 260px;
  margin-top: 10px;

  & > content {
    display: flex;
    margin-top: 21px;

    & > aside {
      display: flex;
      flex-flow: column;
      align-items: center;
      flex-grow: 0.5;

      & > div {
        display: flex;
        width: 100%;

        & > span {
          display: flex;
          flex-flow: column;
          align-items: center;
          flex-grow: 0.5;
          padding: 10px 0 12px;
          color: #666666;

          & > h3 {
            font-size: 24px;
            font-size: 20px;
            font-weight: 600;
            line-height: 2;
          }

          & > p {
            font-size: 14px;
            font-size: 15px;
            line-height: 1.5;
          }
        }
      }

      & > a {
        @mixin center;
        width: 80px;
        height: 32px;
        margin-top: 32px;
        font-size: 14px;
        border-radius: 4px;
        color: white;
        background: var(--qwt-c-blue);
      }
    }
  }

  & > footer {
    margin-top: 20px;
    font-size: 12px;
    color: #999999;

    & > i {
      margin-right: 10px;
    }
  }
}
</style>
