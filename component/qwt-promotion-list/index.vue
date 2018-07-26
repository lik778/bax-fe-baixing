
<template>
  <div class="qwt-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 推广管理</label>
    </topbar>
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
  isBaixingSales
} from 'util/role'

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

<style lang="postcss" scoped>
.qwt-promotion {
  padding: 0 35px;
  width: 100%;
}
</style>
