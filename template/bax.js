
import Bax from 'com/bax'

import Element from 'element-ui'
import Vue from 'vue'

Vue.use(Element)

const app = new Vue({
  render: h => h(Bax)
})

app.$mount('#bax')
