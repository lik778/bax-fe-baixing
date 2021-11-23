<template>
    <section class="bw-query-price_item">
        <el-alert
            class="lock-tips"
            :title="keywordLockText"
            type="warning"
            :closable="false"
            show-icon />
        <SoldCity :tableData="keywordsLockDetails" :allAreas="allAreas"/>
    </section>
</template>
<script>
import SoldCity from './sold-city.vue'
export default {
  name: 'sold-city-layout',
  components: { SoldCity },
  props: {
    keywordLockText: {
      type: String,
      default: '',
      require: false
    },
    keywordsLockDetails: {
      type: Array,
      default: () => [],
      require: true
    },
    allAreas: {
      type: Array,
      default: () => [],
      require: true
    }
  }
}
</script>
