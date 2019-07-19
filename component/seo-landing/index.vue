<template>
  <div>
    <p>
      {{text}}
    </p>
  </div>
</template>

<script>
import {
  normalizeRoles
} from 'util/role'

export default {
  name: 'bw-landing',
  data() {
    text: '支付成功！'
  },
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
          this.text = '支付成功！恭喜获得首页宝预售资格，新建计划功能即将开放，请及时关注站内通知。'
        } else if (this.isAgentAccounting) {
          this.text = '支付成功！如需提单，请从指南车系统重新进入搜索通系统。'
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
