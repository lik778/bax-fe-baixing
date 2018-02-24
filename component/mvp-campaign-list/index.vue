
<template>
  <div class="mvp-campaign-list">
    <topbar :user-info="userInfo" :back="false">
    </topbar>
    <campaign-header>
    </campaign-header>
    <campaign-list>
    </campaign-list>
  </div>
</template>

<script>
import CampaignHeader from './header'
import CampaignList from './list'
import Topbar from 'com/topbar'

import store from './store'

export default {
  name: 'mvp-campaign',
  components: {
    CampaignHeader,
    CampaignList,
    Topbar
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  async mounted() {
    await store.getCampaigns()
  }
}
</script>

<style scoped>
@import "../../cssbase/var";

.mvp-campaign-list {
  width: 100%;
  background: var(--qwt-c-gray);
}
</style>
