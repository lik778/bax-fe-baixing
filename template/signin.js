
import Element from 'element-ui'
import Vue from 'vue'

import Signin from 'com/signin'

Vue.use(Element)

const app = new Vue({
  render: h => h(Signin)
})

app.$mount('#signin')
