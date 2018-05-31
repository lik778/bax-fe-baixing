
<template>
  <bax-step
    :title="title"
    :steps="steps"
    :step="step" />
</template>

<script>
import BaxStep from 'com/widget/step'

export default {
  name: 'gw-charge-step',
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
      title: '官网购买',
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
