
import Vue from 'vue'

import AuthorizationPage from 'com/authorization-page'

const app = new Vue({
  render: h => h(AuthorizationPage)
})

app.$mount(document.getElementById('authorization'))
