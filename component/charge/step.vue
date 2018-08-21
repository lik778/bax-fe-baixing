<template>
  <bax-step :title="title" hint="账户内推广资金暂不支持购买标王，如需标王推广请直接进入标王页面进行购买" :steps="steps" :step="step" >
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
      type: Number,
      required: true
    }
  },
  data() {
    return {
      title: '套餐购买',
      steps: [{
        name: '选择产品'
      }, {
        name: '核对订单'
      }, {
        name: '确认购买'
      }]
    }
  }
}
</script>
