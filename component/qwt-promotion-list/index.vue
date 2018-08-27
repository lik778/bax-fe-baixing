
<template>
  <div class="qwt-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 推广管理</label>
    </topbar>

    <p v-if="summary.budget" class="info">您的推广资金可用余额为<span class="red">{{f2y(usableBalance)}}元</span>，预计可消耗<span class="red">{{days}}天</span>，为了保证您的广告正常投放，请及时<router-link :to="{name: 'qwt-charge'}">充值</router-link></p>

    <promotion-list :user-info="userInfo" :campaigns="campaigns"
      :query="localQuery" :readonly="isListReadonly"
      :show-more-filters="showMoreFilters" :all-areas="allAreas"
      :userId="currentUserId" :canCreate="!isListReadonly">
    </promotion-list>
  </div>
</template>

<script>
import uuid from 'uuid/v4'

import FlatBtn from 'com/common/flat-btn'
import Topbar from 'com/topbar'

import PromotionList from './list'

import {
  isBaixingSales,
  f2y
} from 'util'

import store from './store'

export default {
  name: 'qwt-promotion',
  components: {
    PromotionList,
    Topbar,
    FlatBtn
  },
  fromMobx: {
    showMoreFilters: () => store.showMoreFilters,
    campaigns: () => store.campaigns,
    query: () => store.query,
    usableBalance: () => store.usableBalance,
    summary: () => store.summary
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      actionTrackId: uuid(),
    }
  },
  computed: {
    days() {
      return Math.ceil(this.usableBalance / this.summary.budget)
    },
    isListReadonly() {
      return this.isBaixingSale
    },
    isBaixingSale() {
      const { userInfo } = this
      return isBaixingSales(userInfo.roles)
    },
    currentUserId() {
      return this.$route.query.userId
    },
    localQuery() {
      const { currentUserId } = this
      if (!currentUserId) {
        return this.query
      }
      return {
        ...this.query,
        userId: currentUserId
      }
    }
  },
  methods: {
    f2y
  },
  async mounted() {
    await Promise.all([store.getUsableBalance(), store.getSummary()])
  },
}
</script>

<style lang="postcss" scoped>
.qwt-promotion {
  padding: 0 35px;
  width: 100%;
}
.info {
  font-size: 12px;
  &>.red {
    color: red;
    margin: 0 5px;
  }
}
</style>
