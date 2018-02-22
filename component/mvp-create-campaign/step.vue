<template>
  <bax-step title="新建推广流程" :steps="steps" :step="step">
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
        name: '设置推广内容'
      }, {
        name: '设置推广价格'
      }, {
        name: '创建推广'
      }]
    }
  }
}
</script>
