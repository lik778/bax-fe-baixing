<template>
  <section class="bw-query-price_item">
    <el-alert
      class="lock-tips"
      title="手机端、电脑端的“部分词的部分城市”已售出，详情如下。若想购买的渠道已售出，请更换已售出关键词/城市重新查价~"
      type="warning"
      :closable="false"
      show-icon
    />
    <SoldCity :tableData="keywordsLockDetails" :allAreas="allAreas" />
  </section>
</template>
<script>
import SoldCity from './sold-city.vue'
export default {
  name: 'sold-city-layout',
  components: { SoldCity },
  props: {
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
