
<template>
  <div class="ad">
    <topbar :userInfo="userInfo">
      <label slot="title">投放管理</label>
    </topbar>
    <ad-header
      :ads="ads"
      :query="query"
      :showMoreFilters="showMoreFilters"
    />
    <ad-list
      :materials="materials"
      :items="items" :query="query"
      :all-categories="allCategories"
      :all-areas="allAreas"
      :user-info="userInfo"
    />
  </div>
</template>

<script>
import AdHeader from './header'
import Topbar from 'com/topbar'
import AdList from './list'

import store from './store'

export default {
  name: 'ad',
  store,
  components: {
    AdHeader,
    AdList,
    Topbar
  },
  fromMobx: {
    showMoreFilters: () => store.showMoreFilters,
    materials: () => store.materials,
    ads: () => store.ads,

    query: () => store.query,
    items: () => store.items
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allCategories: {
      type: Array,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  async mounted() {
    await Promise.all([
      store.getAdItems({...this.query}),
      store.getAds()
    ])
  }
}
</script>

<style scoped>
.ad {
  padding: 0 35px;
  width: 100%;
}
</style>
