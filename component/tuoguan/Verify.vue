<template>
  <div class="wrapper">
    <el-checkbox class="checkbox" v-model="contractChecked">
      我已阅读<a class="link" @click="showContract">托管协议</a>
    </el-checkbox>
    <el-button class="btn" @click="onTuoguan"></el-button>

    <el-dialog :visible.sync="contractDialogVisible"
      fullscreen class="dialog">
      <contract />
    </el-dialog>

  </div>
</template>

<script>
import Contract from './Contract'
import {verifyTuoguan, tuoguanCode} from 'api/fengming'
import querystring from 'query-string'
import { redirectTo } from 'utils'
import track from 'util/track'
import uuid from 'uuid/v4'

export default {
  components: {
    Contract
  },

  data() {
    return {
      contractDialogVisible: false,
      contractChecked: false,
      uid: '',
      phone: '',
      actionTrackId: uuid()
    }
  },

  methods: {
    showContract(e) {
      e.preventDefault()
      this.contractDialogVisible = true
    },

    track(action) {
      track({
        action,
        time: Date.now() / 1000 | 0,
        url: window.location.href,
        actionTrackId: this.actionTrackId
      })
    },

    onTuoguan() {
      this.track('tuoguan:i-want-tuoguan:click')

      if (!this.contractChecked) {
        return this.$alert('请阅读并同意托管协议后参与', '温馨提示', {
          confirmButtonText: '我知道了'
        })
      }

      this.$prompt(`请补全手机号中间4位: ${this.phone}`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d{4}$/,
        inputErrorMessage: '请填写手机号中间4位'
      }).then(({ value }) => {
        const arr = this.phone.split('****')
        arr.splice(1, 0, value)
        const phone = arr.join('')
        return verifyTuoguan({ phone, uid: this.uid })
      }).then(() => {
        this.$alert('您正在使用托管服务，本次服务有效期为 6 个月，取消或延期请到“广告系统”进行修改', {
          confirmButtonText: '我知道了'
        })

        this.track('tuoguan:verify:success')
      }).catch(err => {
        if (err !== 'cancel') {
          this.track('tuoguan:verify:fail')
        }
      })
    }
  },

  async mounted() {
    const q = querystring.parse(window.location.search)
    if (q.t) {
      const {uid, phone} = await tuoguanCode(q.t)
      this.uid = uid
      this.phone = phone

      this.track('tuoguan:enter-verify:success')
    } else {
      redirectTo('signin')
    }
  }

}
</script>

<style>
html,body {
  height: 100%;
}
.el-message-box {
  width: 90% !important;
}
.el-dialog--full {
  background: rgba(0,0,0,0.4);
}
.el-dialog__body {
  color: #ddd;
}
</style>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-image: url(http://file.baixing.net/201801/d1f59c90a0a080cb14bdaaf5f17c629f.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.checkbox {
  position: absolute;
  bottom: 24%;
  left: 50%;
  transform: translateX(-50%);
}
.link {
  color: red;
  text-decoration: underline;
}
.btn {
  width: 90%;
  height: 60px;
  background-size: contain;
  background-image: url(http://file.baixing.net/201801/570650badc156f8bc8141a5cea6d2c2a.png);
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  bottom: 12%;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  border: none;
}
.dialog {
  color: #ddd;
}
</style>
