<template>
  <bax-step title="智能投放数据报表" :steps="steps" :step="step">
  </bax-step>
</template>

<script>
import BaxStep from 'com/widget/step'

export default {
  name: 'mvp-create-campaign-step',
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
      steps: [{
        name: '选择数据维度'
      }, {
        name: '查看走势图'
      }, {
        name: '查看详情'
      }]
    }
  }
}
</script>
