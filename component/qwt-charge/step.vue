<template>
  <bax-step :title="title" hint="账户内推广资金暂不支持购买标王，如需标王推广请直接进入标王页面进行购买">
  </bax-step>
</template>

<script>
import BaxStep from 'com/widget/step'

export default {
  name: 'qwt-charge-step',
  components: {
    BaxStep
  },
  props: {
    step: {
      type: Number
    }
  },
  data () {
    return {
      title: '充值与购买'
    }
  }
}
</script>
