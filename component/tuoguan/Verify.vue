<template>
  <div class="wrapper">
    <el-checkbox class="checkbox" v-model="contractChecked">我已阅读<a class="link" @click="showContract">托管协议</a></el-checkbox>
    <el-button class="btn" @click="onTuoguan">我要托管</el-button>

    <el-dialog :visible.sync="contractDialogVisible" size="full">
      <contract />
    </el-dialog>

  </div>
</template>

<script>
import Contract from './Contract'
import {verifyTuoguan} from 'api/fengming'

export default {
  components: {
    Contract
  },

  data() {
    return {
      contractDialogVisible: false,
      contractChecked: false
    }
  },

  methods: {
    showContract(e) {
      e.preventDefault()
      this.contractDialogVisible = true
    },

    onTuoguan() {
      if (!this.contractChecked) {
        return this.$alert('请阅读并同意托管协议后参与', '温馨提示', {
          confirmButtonText: '我知道了'
        })
      }

      this.$prompt('请补全手机号码', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d{3}$/,
        inputErrorMessage: '请填写手机尾号3位'
      }).then(({ value }) => {
        return verifyTuoguan({ phone: value })
      }).then(() => {
        this.$alert('您正在使用托管服务，本次服务有效期为 6 个月，取消或延期请到“广告系统”进行修改', {
          confirmButtonText: '我知道了'
        })
      }).catch(err => {
        if (err !== 'cancel') {
          this.$message.warning('号码输入错误')
        }
      })
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
</style>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-image: url(http://file.baixing.net/201801/ab3f7b8bab3772ca3a60d60963b9249c.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.checkbox {
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
}
.link {
  color: red;
  text-decoration: underline;
}
.btn {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
