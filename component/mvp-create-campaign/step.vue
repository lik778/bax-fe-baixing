<template>
  <bax-step title="新建推广流程" :steps="steps" :step="step">
    <tip slot="tip" />
  </bax-step>
</template>

<script>
import BaxStep from 'com/widget/step'
import Tip from 'com/widget/mvp-tip'

export default {
  name: 'mvp-create-campaign-step',
  components: {
    BaxStep,
    Tip
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
