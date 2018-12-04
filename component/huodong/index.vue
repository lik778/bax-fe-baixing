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
          <!-- <div v-if="activeTab === 1">
            <man-song :status="tabs[1].status" :user-discounts="userDiscounts" :user-id="query.userId" :sales-id="query.salesId" :user="user"/>
          </div> -->
          <div v-if="activeTab === 1">
            <biao-wang :status="tabs[1].status" :user="user" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>

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

const start = Date.UTC(2018, 11, 4, 9)
const biaowangStart = Date.UTC(2018, 11, 4, 16)
const end = Date.UTC(2018, 11, 31, 16)

export default {
  name: 'huodong',
  components: {
    BiaoWang,
    XianShi
  },
  data() {
    return {
      activeTab: 0,
      tabs: [{
        title: '精品官网/买1年送半年',
        timeRange: '12.5-12.31',
        status: '预热中',
        desc: '优惠规则：12.05-12.31期间买精品官网，加送6个月官网使用时长。任意套餐和单独买精品官网均可享受！',
        period: [start, end],
      }, {
        title: '标王折扣狂欢',
        timeRange: '12.5-12.31',
        status: '预热中',
        desc: '温馨提示：标王，官网券抢购方式，请联系您的专属销售或者咨询客服：400-036-3650 查价购买',
        period: [biaowangStart, end],
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
    width: 1150px;
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
  background-image: url('http://file.baixing.net/201811/e55485a14b37581e54b5e827a8cb1fdd.png');
  background-position: center 0;
  background-color: #CE0054;
  background-repeat: no-repeat;
  padding-bottom: 50px;

  & > main {
    width: 1150px;
    padding-top: 670px;
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
        color: #FFC1E7;
        background-color: #BF0076;
        border-radius: 50px 50px 0 0;
        cursor: pointer;

        & > h3 {
          font-size: 24px;
          margin: 10px 0;
        }
        & > .status {
          padding: 3px 21px;
          color: #E0C4FF;
          border-radius: 20px;
          background-color: #9B0060;
          font-size: 14px;
        }
      }
      & > .tab.active {
        color: #9B0060;
        background-color: #FFBD89;

        & > .status {
          color: #AE3A09;
          background-color: #FFB679;
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
      background-color: #FFBD89;
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
