
<template>
  <div class="qwt-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 推广管理</label>
    </topbar>
    <promotion-header :show-more-filters="showMoreFilters"
      :all-areas="allAreas" :query="localQuery"
      :userId="currentUserId" :canCreate="!isListReadonly">
    </promotion-header>
    <promotion-list :campaigns="campaigns"
      :query="localQuery" :readonly="isListReadonly">
    </promotion-list>
  </div>
</template>

<script>
import PromotionHeader from './header'
import PromotionList from './list'
import Topbar from 'com/topbar'

import {
  isBaixingSales
} from 'util/role'

import store from './store'

export default {
  name: 'qwt-promotion',
  store,
  components: {
    PromotionHeader,
    PromotionList,
    Topbar
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
        userId: currentUserId,
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
