<template>
  <el-dialog :visible="visible" width="320px"
    class="qwt-charge-dialog"
    :close-on-click-modal="false"
    :before-close="cancel">
    <main class="main">
      <bx-icon type="checkcircleo"></bx-icon>
      <strong>创建成功</strong>
      <p>已进入审核，推广可用资金不足，请前去充值</p>
      <button @click="charge">立即充值</button>
    </main>
  </el-dialog>
</template>

<script>
import BxIcon from 'com/widget/icon'

export default {
  name: 'qwt-charge-dialog',
  components: {
    BxIcon
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    charge() {
      this.$router.push({
        name: 'qwt-charge',
        query: {
          mode: 'charge-only'
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/var';
@import 'cssbase/mixin';

.main {
  display: flex;
  flex-flow: column;
  align-items: center;

  & > i {
    color: var(--qwt-c-blue);
    font-size: 28px;
  }

  & > strong {
    margin: 5px 0;
  }

  & > p {
    font-size: 14px;
  }

  & > button {
    @mixin center;
    margin-top: 10px;
    height: 28px;
    width: 80px;
    border-radius: 14px;
    background: var(--qwt-c-blue);
    color: white;
    cursor: pointer;
  }
}
</style>

<style>
.qwt-charge-dialog {
  & .el-icon-close {
    position: relative;
    top: -20px;
    right: -10px;
  }

  & .el-dialog__header {
    padding-top: 5px;
  }

  & .el-dialog__body {
    padding: unset;
    padding-bottom: 18px;
  }

  & .el-icon-close {
    font-size: 9px;
  }
}
</style>
