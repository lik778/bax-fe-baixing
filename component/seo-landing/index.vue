<template>
  <div v-if="isAgentAccounting">
    <p>
      支付成功！如需提单，请从指南车系统重新进入搜索通系统。
    </p>
  </div>
</template>

<script>
import {
  normalizeRoles
} from 'util/role'

export default {
  name: 'bw-landing',
  props: {
    userInfo: Object
  },
  computed: {
    isBxUser() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('BAIXING_USER')
    },
    isAgentAccounting() {
      const roles = normalizeRoles(this.userInfo.roles)
      return roles.includes('AGENT_ACCOUNTING')
    }
  },
  watch: {
    userInfo(v) {
      if (v.id) {
        if (this.isBxUser) {
          // this.$router.push({name: 'seo-promotion-list'})
        }
      }
    }
  },
}
</script>

<style lang="postcss" scoped>
div {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
