<template>
    <div class="top-tips">
      <p
        class="info"
        v-if="summary && summary.budget"
      >
        您的推广资金可用余额为<span class="red">{{ f2y(currentBalance) }}元</span>，预计可消耗<span class="red">{{ days }}天</span>
        <label v-if="userInfo.allowFmRecharge">为了保证您的广告正常投放，请及时充值</label>
      </p>
    </div>
</template>

<script>
import { f2y } from 'util'
import {
  getCurrentBalance,
  getHomepageSummary
} from 'api/fengming'
export default {
  name: 'top-tips',
  props: [
    'userInfo',
    'salesInfo'
  ],
  data () {
    return {
      summary: undefined,
      currentBalance: 0,
      f2y
    }
  },
  mounted () {
    this.fetchSummary()
  },
  computed: {
    days () {
      return Math.ceil(this.currentBalance / this.summary.budget)
    }
  },
  methods: {
    async fetchSummary () {
      const [currentBalance, summary] = await Promise.all([
        getCurrentBalance({ userId: this.salesInfo.userId }),
        getHomepageSummary({ userId: this.salesInfo.userId })
      ])
      this.summary = summary
      this.currentBalance = currentBalance
    }
  }
}
</script>

<style lang="scss" scoped>
.top-tips {
  background-color: #fff7eb;
  color: #bd975f;
  font-size: 14px;
  padding: 5px 0 5px 30px;
  margin-bottom: 5px;
  border-radius: 2px;
  .info {
    font-size: 14px;
    & > a {
      margin-left: 4px;
      color: #35a5e4;
    }
    & > .red {
      color: red;
      margin: 0 5px;
    }
  }
}
</style>
