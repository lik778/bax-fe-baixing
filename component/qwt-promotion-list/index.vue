
<template>
  <div class="qwt-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 推广管理</label>
    </topbar>
    <promotion-header :show-more-filters="showMoreFilters"
      :all-areas="allAreas" :query="query">
    </promotion-header>
    <promotion-list :campaigns="campaigns"
      :query="query">
    </promotion-list>
  </div>
</template>

<script>
import PromotionHeader from './header'
import PromotionList from './list'
import Topbar from 'com/topbar'

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
  }
}
</script>

<style scoped>

.qwt-promotion {
  padding: 0 35px;
  width: 100%;
}

</style>
