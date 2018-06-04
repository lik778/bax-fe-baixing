
<template>
  <div class="qwt-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 推广管理</label>
    </topbar>
    <promotion-header :show-more-filters="showMoreFilters"
      :all-areas="allAreas" :query="localQuery"
      :userId="currentUserId" :canCreate="!isListReadonly">
    </promotion-header>
    <promotion-list :user-info="userInfo" :campaigns="campaigns"
      :query="localQuery" :readonly="isListReadonly">
    </promotion-list>
  </div>
</template>

<script>
import uuid from 'uuid/v4'

import FlatBtn from 'com/common/flat-btn'
import Topbar from 'com/topbar'

import PromotionHeader from './header'
import PromotionList from './list'

import {
  isBaixingSales
} from 'util/role'

import gStore from '../store'
import store from './store'

export default {
  name: 'qwt-promotion',
  components: {
    PromotionHeader,
    PromotionList,
    Topbar,
    FlatBtn
  },
  fromMobx: {
    showMoreFilters: () => store.showMoreFilters,
    campaigns: () => store.campaigns,
    query: () => store.query
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
      actionTrackId: uuid()
    }
  },
  computed: {
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
  }
}
</script>

<style scoped>
.qwt-promotion {
  padding: 0 35px;
  width: 100%;
}
</style>
