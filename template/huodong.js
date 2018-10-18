
import Vue from 'vue'

import Huodong from 'com/huodong'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

const app = new Vue({
  render: h => h(Huodong)
})

app.$mount('#huodong')
