
import Vue from 'vue'

import Huodong from 'com/huodong'

const app = new Vue({
  render: h => h(Huodong)
})

app.$mount(document.getElementById('huodong'))
