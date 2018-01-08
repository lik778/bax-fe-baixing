
import Element from 'element-ui'
import Vue from 'vue'

import Verify from 'com/tuoguan/Verify'

Vue.use(Element)

const app = new Vue({
  render: h => h(Verify)
})

app.$mount('#tuoguan')
