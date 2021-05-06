<template>
  <div>
    <p v-if="loading" class="loading">
      <i class="el-icon-loading" /> 正在载入...
    </p>
    <template v-else>
      <p class="invalid" v-if="isValueInvalid">所选官网已失效，请重新选择！</p>
      <bax-select
        v-if="options.length"
        class="gw-page-selector"
        placeholder="请选择投放官网"
        :disabled="disabled"
        :value="isSiteLandingType(value) ? computedVal : ''"
        :options="options"
        @change="onChange"
      />
      <a
        v-else-if="ticketCount"
        target="_blank"
        href="//bax.baixing.com.cn/ka/main"
      >
        您已经购买了官网，点击创建！
      </a>
      <a
        v-else
        target="_blank"
        href="//www.baixing.com/a/quanwangtong?src=haina_topbar#five"
      >
        还没官网？了解并创建！
      </a>
    </template>
  </div>
</template>

<script>
import BaxSelect from './select'
import { isSiteLandingType } from 'util/kit'
import { getUserTicketCount, getUserSites } from 'api/ka'
import { isPro } from 'config/index.js'

const GW_URL_REG = /\/\/([\w-]+)\./i

export default {
  name: 'gw-page-selector',
  components: {
    BaxSelect
  },
  props: {
    initValue: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    productType: {
      type: Number
    },
    displayLandingPage: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    computedVal () {
      return this.value.split('?')[0]
    },
    isValueInvalid () {
      const isInvalid = !this.loading && (this.initValue && !this.value)
      this.$emit('valid-change', !isInvalid)
      return isInvalid
    }
  },
  data () {
    return {
      value: '',
      ticketCount: 0,
      list: [],
      options: [],

      loading: true
    }
  },
  async mounted () {
    await this.getGwPages()
    if (this.initValue) {
      const isValid = this.checkIsCurStoreValid(this.initValue)
      if (isValid) this.value = this.initValue
    }
  },
  methods: {
    isSiteLandingType,
    checkIsCurStoreValid (url = this.initValue) {
      if (!GW_URL_REG.test(url)) return false
      const [, domain] = GW_URL_REG.exec(url)
      const currGwObj = this.list.find(o => o.domain === domain)
      return !!currGwObj
    },
    onChange (url) {
      this.value = url
      this.$emit('change', url)
    },
    async getGwPages () {
      let response = {}
      try {
        this.loading = true
        response = await Promise.all([
          getUserSites(),
          getUserTicketCount({ productId: this.productType })
        ])
      } finally {
        this.loading = false
      }

      let [list = [], count] = response
      if (this.productType) {
        list = list.filter((item) => item.productId === this.productType)
      }
      this.list = list
      this.ticketCount = count
      this.options = this.getGwOptions(list)
    },
    getGwOptions (list) {
      let options = list.map(p => ({
        label: p.name,
        value: `http://${p.domain}.mvp.baixing.${isPro ? 'com' : 'cn'}`
      }))
      if (this.displayLandingPage) {
        options = options.map(({ label, value }) => ({
          label: `${label} ${value}`,
          value
        }))
      }
      return options
    }
  }
}
</script>

<style lang="scss" scoped>
.gw-page-selector {
  width: 530px;
}
.loading {
  padding: 10px;
  color: #c0c4cc;
}
a,
a:visited {
  margin-left: 20px;
  font-size: 14px;
  color: $--color-primary;
  cursor: pointer;
}
.invalid {
  color: $--color-primary;
  margin: 10px 0;
}
</style>
