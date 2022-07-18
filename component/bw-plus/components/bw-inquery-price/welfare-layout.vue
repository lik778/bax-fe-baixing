<template>
    <div class="welfare-content">
        <div class="welfare-content_wrapper">
            <WelfareActivity
                v-for="(item, index) in welfareInfo.filter(o => o.show)"
                :key="index"
                :className="`custom-${index+1}`"
                :item="item"
                @emitActivity="acceptActivity"
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
    },
    isInits: {
      type: Boolean,
      default: () => false,
      require: true
    }
  },
  data () {
    return {
      welfareInfo
    }
  },
  methods: {
    acceptActivity (target) {
      const { welfareInfo } = this
      const { duration } = this.currentPrice
      if (duration === 30) return
      this.welfareInfo = welfareInfo.map(item => {
        if (item.id === target && !item.defaultActive) {
          this.$emit('postActivityID', target)
        }
        if (item.id === target) {
          item.defaultActive = true
        } else {
          item.defaultActive = false
        }
        return item
      })
    }
  },
  watch: {
    isInits: { // 每次值改变时，初始化
      immediate: true,
      handler (v) {
        const { welfareInfo } = this
        this.welfareInfo = welfareInfo.map(item => {
          if (item.id === 1) {
            item.defaultActive = true
          } else {
            item.defaultActive = false
          }
          return item
        })
      }
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
