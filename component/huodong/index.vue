<template>
  <div>
    <div class="nav-bar">
      <div class="nav-container">
        <a href="http://www.baixing.com"><img src="http://file.baixing.net/201810/82ace1fa56397b063c085fd1109cabf9.png" alt=""></a>|<a href="http://bax.baixing.com.cn/main"><img src="http://file.baixing.net/201810/75dcdf51eb762b8eaad557b7d5d3d85f.png" alt=""></a></div>
    </div>
    <div class="hd-container">
      <main>
        <div class="tabs">
          <div class="tab" :class="{'active': activeTab === index, 'over': tab.status === '已结束'}"
            v-for="(tab, index) in tabs" :key="index"
            @click="onTabClick(tab, index)">
            <h3>{{tab.title}} / <small>{{tab.timeRange}}</small></h3>
            <div class="status">{{tab.status}}</div>
          </div>
        </div>
        <div class="tab-info">
          {{currentDesc}}
        </div>
        <div class="tab-pane">
          <div v-if="activeTab === 0">
            <xian-shi :status="tabs[0].status" :user-discounts="userDiscounts"
            :user-id="query.userId" :sales-id="query.salesId" :user="user"/>
          </div>
          <div v-if="activeTab === 1">
            <man-song :status="tabs[1].status" :user-discounts="userDiscounts" :user-id="query.userId" :sales-id="query.salesId" :user="user"/>
          </div>
          <div v-if="activeTab === 2">
            <biao-wang :status="tabs[2].status" :user="user" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>

import ManSong from './ManSong'
import BiaoWang from './BiaoWang'
import XianShi from './XianShi'
import {Message} from 'element-ui'

import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'
import * as aapi from 'api/account'

import {
  allowGetOrderPayUrl,
  normalizeRoles,
  allowPayOrder,
  parseQuery,
} from 'util'
import track from 'util/track'

export default {
  name: 'huodong',
  components: {
    ManSong,
    BiaoWang,
    XianShi
  },
  data() {
    return {
      activeTab: 0,
      tabs: [{
        title: '限时买一送一',
        timeRange: '10.25-11.5',
        status: '预热中',
        desc: '优惠规则：活动期间买精品官网，加送1年官网使用时长。任意套餐和单独买精品官网均可享受！',
        period: [Date.UTC(2018, 9, 24, 9), Date.UTC(2018, 10, 5, 16)],
      }, {
        title: '满送(最高1500)',
        timeRange: '11.6-11.20',
        status: '预热中',
        desc: '优惠规则：活动期间买任意产品（推广资金+精品官网）实付满1000送50元；满4000送350元；满10000送1500元 无门槛推广资金券 ，有效期30天',
        period: [Date.UTC(2018, 10, 5, 16), Date.UTC(2018, 10, 20, 16)],
      }, {
        title: '标王折上折',
        timeRange: '10.25-11.20',
        status: '预热中',
        desc: '优惠规则：活动期间买任意标王关键词满5000－9999，8折；10000-14999，7折；15000及以上，7折且赠送1年精品官网',
        period: [Date.UTC(2018, 9, 24, 9), Date.UTC(2018, 10, 20, 16)],
      }],
      discounts: [],

      now: +new Date(), // 从后端取
      user: {},

      query: {},
      sendLeads: false
    }
  },
  created() {
    const query = parseQuery(window.location.search.substring(1))
    this.query = {
      userId: query.user_id,
      salesId: query.sales_id
    }
  },
  computed: {
    currentDesc() {
      return this.tabs[this.activeTab].desc
    },
    isAgent() {
      const roles = normalizeRoles(this.user.roles)
      return roles.includes('AGENT_ACCOUNTING')
    },
    userDiscounts() {
      if(this.isAgent) {
        return this.discounts
      }
      return []
    },

  },
  methods: {
    onTabClick(tab, index) {
      if (tab.status !== '已结束'){
        this.activeTab = index
      } else {
        Message.info('活动已结束')
      }
    },
    async getTime() {
      // 必须取服务器时间
      const dateHeader = await fapi.getServerTime()
      return +new Date(dateHeader) || Date.now()
    }
  },
  async mounted() {
    this.user = await aapi.getCurrentUser()
    this.discounts = await mapi.getProductDiscounts([3, 4])

    const now = await this.getTime()
    console.log({now})

    for (let tab of this.tabs) {
      if (now < tab.period[0]) {
        tab.status = '预热中'
      } else if (now <= tab.period[1]) {
        tab.status = '进行中'
      } else if (now > tab.period[1]) {
        tab.status = '已结束'
      }
    }
    // 选中当前活动
    const inProgress = this.tabs.find(tab => tab.status === '进行中')
    if (inProgress) {
      this.activeTab = this.tabs.indexOf(inProgress)
    }

    const bindHandler = onPageClick.bind(this)
    document.body.addEventListener('click', bindHandler)

    async function onPageClick(e) {
      if (!this.sendLeads) {
        this.sendLeads = true
        await fapi.huodongLeads({
          contactId: this.user.mobile,
          contactName: this.user.name
        })
      }

      track({
        action: 'page-click: huodong',
        baxId: this.user.id,
        tab: this.activeTab
      })
    }
  },
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-family: sans-serif;
}
</style>
<style scoped lang="postcss">
.nav-bar {
  height: 48px;
  background-color: #fff;

  & > .nav-container {
    height: 48px;
    padding-top: 10px;
    width: 1000px;
    margin: auto;

    & > a:first-of-type > img {
      height: 25px;
      margin-right: 10px;
    }
    & > a:last-of-type > img {
      height: 16px;
      margin-left: 10px;
    }
  }
}
.hd-container {
  background-image: url('http://file.baixing.net/201810/666580479c1bf083f2012ff0f8bd7ecd.png');
  background-position: center 0;
  background-color: #3E00C1;
  background-repeat: no-repeat;
  padding-bottom: 50px;

  & > main {
    width: 1000px;
    padding-top: 343px;
    margin: auto;

    & > .tabs {
      display: flex;
      justify-content: space-around;

      & > .tab {
        flex: 1;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #CFA5FF;
        background-color: #5F00C9;
        border-radius: 50px 50px 0 0;
        cursor: pointer;

        & > h3 {
          font-size: 24px;
          margin: 10px 0;
        }
        & > .status {
          padding: 3px 21px;
          color: #C189FF;
          border-radius: 20px;
          background-color: #380098;
          font-size: 14px;
        }
      }
      & > .tab.active {
        color: #5F00C9;
        background-color: #ffd500;

        & > .status {
          color: #AE3A09;
          background-color: #FFAE00;
        }
      }
      & > .tab.over {
        color: #666;
        background-color: #dbdbdb;
        & > .status {
          color: #fff;
          background-color: #A8A8A8;
        }
      }
    }
    & > .tab-info {
      text-align: center;
      line-height: 50px;
      height: 50px;
      font-size: 14px;
      color: #AE3A09;
      border-radius: 0 0 10px 10px;
      background-color: #ffd500;
      margin-bottom: 20px;
    }

    & > .tab-pane {

    }
  }
}
.gw-content {
  display: flex;
  justify-content: space-between;
  & > .gw-info {
    padding-inline-start: 20px;
    margin-block-start: 0;
    margin-block-end: 0;
  }
}


</style>
