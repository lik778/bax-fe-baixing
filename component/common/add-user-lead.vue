
<template>
  <el-dialog title="请留下您的联系方式" :visible="visible"
    :close-on-click-modal="false" :show-close="true"
    :before-close="cancel">
    <el-form label-width="110px">
      <el-form-item label="您的联系方式" required>
        <el-input v-model="mobile"></el-input>
      </el-form-item>
      <section class="tip">
        <i>*</i>
        <p>请务必确保您的手机号正确，我们的顾问会尽快与您联系</p>
      </section>
    </el-form>
    <footer slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'

import {
  addUserLead
} from 'api/fengming'

export default {
  name: 'qwt-add-lead',
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      mobile: ''
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.$router.push({
        name: 'root'
      })
    },
    cancel() {
      this.close()
    },
    async submit() {
      const { mobile } = this

      Message.success('提交成功！我们的顾问会尽快与您联系哟~')

      if (!mobile) {
        return Message.error('请填写手机号')
      }

      await addUserLead({
        mobile
      })

      this.close()
    }
  },
  watch: {
    userInfo(info) {
      if (this.loaded) {
        return
      }

      if (info && info.id) {
        this.loaded = true
        if (info.mobile) {
          this.mobile = info.mobile
        }
      }
    }
  }
}
</script>

<style scoped>
.tip {
  display: flex;
  align-items: center;
  margin-left: 3px;
  font-size: 14px;

  & > i {
    margin-right: 5px;
    color: red;
  }
}
</style>
