
import Vue from 'vue'

import Signin from 'com/signin'

const app = new Vue({
  render: h => h(Signin)
})

app.$mount('#signin')
