
import Vue from 'vue'

import AuthorizationPage from 'com/authorization-page'
import { MessageBox, Message, Button } from 'element-ui'
Vue.use(Button)
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert

const app = new Vue({
  render: h => h(AuthorizationPage)
})

app.$mount(document.getElementById('authorization'))
