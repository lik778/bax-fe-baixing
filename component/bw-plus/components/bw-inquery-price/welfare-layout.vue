<template>
    <div class="welfare-content">
        <Title class="wefare-title" title="超值福利，满额即送" extra="满足规则即可解锁福利"/>
        <div class="welfare-content_wrapper">
            <WelfareActivity
                v-for="(item, index) in welfareInfo.filter(o => o.show)"
                :key="index" :title="item.title"
                :className="`custom-${index+1}`"
                :desc="item.desc"
                :value="item.value(currentPrice.price)"
                :tag="item.isActive(currentPrice.duration, currentPrice.price).tag"
                :content="item.content(currentPrice.price, item.switch[0])"
                :active="item.isActive(currentPrice.duration, currentPrice.price).active"/>
        </div>
    </div>
</template>
<script>
import Title from './title.vue'
import WelfareActivity from './welfare-activity.vue'
import { welfareInfo } from 'constant/bw-plus'
export default {
  name: 'welfare-layout',
  components: { Title, WelfareActivity },
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
