<template>
  <div class="payment-success-page-container">
    <div class="icon el-icon-circle-check"></div>
    <div>
      支付成功！
      <span v-if="isAgent">如需提单，请从指南车系统重新进入搜索通系统。</span>
    </div>
    <div class="desc" v-if="countdown !== null">
      正在跳转{{'....'.slice(countdown)}}({{countdown}}s)
    </div>
  </div>
</template>

<script>
import gStore from '../store'
const redirectPathname = {
  'fm': '/main/qwt/promotions',
  'bw': '/main/bw/plan-list',
  'seo': '/main/seo/promotions'
}

import {
  normalizeRoles
} from 'util/role'

export default {
  name: 'payment-success',
  data() {
    return {
      isAgent: false,
      countdown: null,
      product: this.$route.query.product
    }
  },
  fromMobx: {
    currentUser: () => gStore.currentUser
  },
  created () {
    this.disposeWatcher = this.$watch(() => {
      const roles = normalizeRoles(this.currentUser.roles)
      return {
        product: this.product,
        isAgent: roles.includes('AGENT_ACCOUNTING')
      }
    }, ({ product, isAgent }) => {
      this.isAgent = isAgent
      if (!isAgent) {
        this.countdown = 3
        this.interval = setInterval(() => {
          if (this.countdown === 1) {
            return this.$router.replace(redirectPathname[product])
          } 
          this.countdown -= 1
        }, 1000)
      }
    })
  },
  beforeDestroy() {
    clearInterval(this.interval)
    this.disposeWatcher && this.disposeWatcher()
  }
}
</script>

<style lang="postcss" scoped>
  .payment-success-page-container {
    background-color: #fff;
    padding-top: 90px;
    margin: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 24px;
    letter-spacing: 0.1em;

    & > .icon {
      margin-bottom: 24px;
      font-size: 72px;
      color: rgb(255, 99, 80);
    }

    & .desc {
      color: #666;
      font-size: 15px;
      margin-top: 10px;
    }
  }
</style>
