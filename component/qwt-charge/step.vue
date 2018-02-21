<template>
  <bax-step :title="title" :steps="steps" :step="step">
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
    mode: {
      type: String,
      required: true
    },
    step: {
      type: Number,
      required: true
    }
  },
  data() {
    const { mode } = this

    return {
      title: mode === 'buy-service' ? '套餐购买' : '资金充值',
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
