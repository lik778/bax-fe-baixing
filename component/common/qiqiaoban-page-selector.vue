
<template>
  <span>
    <bax-select v-if="options.length"
      class="qiqiaoban-page-selector"
      placeholder="请选择投放官网"
      :disabled="disabled"
      :value="isSiteLandingType(value) ? value : ''"
      :options="options"
      @change="onChange">
    </bax-select>
    <a v-else-if="ticketCount" target="_blank"
      href="//bax.baixing.com.cn/ka/main">
      您已经购买了官网，点击创建！
    </a>
    <a v-else target="_blank"
      href="//www.baixing.com/a/quanwangtong?src=haina_topbar#five">
      还没官网？了解并创建！
    </a>
  </span>
</template>

<script>
import BaxSelect from './select'
import { isSiteLandingType } from 'util/kit'
import {
  getUserTicketCount,
  baxUserLogin,
  getUserSites
} from 'api/ka'

export default {
  name: 'qiqiaoban-page-selector',
  components: {
    BaxSelect
  },
  props: {
    value: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    // FIXME: 老官网
    isSpecialLandingpage: {
      type: Boolean,
      default: false
    },
    // 精品官网产品类型
    productType: {
      type: Number
    },
    // 是否显示官网url
    displayLandingPage: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      ticketCount: 0,
      options: [],
      list: []
    }
  },
  methods: {
    isSiteLandingType,
    onChange (v) {
      this.$emit('change', v)
      this.$emit('change-obj', this.list.find(s => v.includes(s.domain)))
      this.$emit('input', v)
    }
  },
  async mounted () {
    // FIXME: 老官网
    let currentSpecialLandingpageOption = []
    if (this.isSpecialLandingpage && this.value) {
      currentSpecialLandingpageOption = [{
        label: this.value,
        value: this.value
      }]
    }
    await baxUserLogin()

    const [list, count] = await Promise.all([
      getUserSites(),
      getUserTicketCount({ productId: this.productType })
    ])

    if (this.productType) {
      this.list = list.filter(item => item.productId === this.productType)
    } else {
      this.list = list
    }
    this.ticketCount = count
    // FIXME: 老官网
    this.options = [
      ...currentSpecialLandingpageOption,
      ...this.list.map(p => ({
        label: p.name,
        value: 'http://' + p.domain + '.mvp.baixing.com'
      }))
    ]

    // 显示官网名称
    if (this.displayLandingPage) {
      this.options = this.options.map(({ label, value }) => {
        return {
          label: `${label}（${value}）`,
          value
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.qiqiaoban-page-selector {
  width: 560px;
}

a,
a:visited {
  margin-left: 20px;
  font-size: 14px;
  color: red;
  cursor: pointer;
}
</style>
