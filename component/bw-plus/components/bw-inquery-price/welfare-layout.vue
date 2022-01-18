<template>
    <div class="welfare-content">
        <div class="welfare-content_wrapper">
            <WelfareActivity
                v-for="(item, index) in welfareInfo.filter(o => o.show)"
                :key="index"
                :className="`custom-${index+1}`"
                :item="item"
                :currentPrice="currentPrice" />
        </div>
    </div>
</template>
<script>
import WelfareActivity from './welfare-activity.vue'
import { welfareInfo } from 'constant/bw-plus'
export default {
  name: 'welfare-layout',
  components: { WelfareActivity },
  props: {
    currentPrice: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  data () {
    return {
      welfareInfo
    }
  }
}
</script>
<style lang="scss" scoped>
    .welfare-content{
        flex-shrink: 0;
      &_wrapper{
        display: flex;
      }
    }
    /deep/ .wefare-title{
        h4{
            font-size: 18px;
            color: #FF6350;
        }
    }
</style>
