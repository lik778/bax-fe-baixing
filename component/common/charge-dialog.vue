<template>
  <el-dialog :visible="visible" width="350px"
    class="qwt-charge-dialog"
    :close-on-click-modal="false"
    :before-close="cancel">
    <main class="main">
      <bx-icon type="checkcircleo"></bx-icon>
      <strong>创建成功</strong>
      <div v-if="!userInfo.allowFmRecharge">
        <p>已进入审核，推广可用资金不足，请前去充值</p>
        <router-link style="display: block" :to="{name: 'qwt-charge', query: { mode: 'charge-only'}}">
          <button>立即充值</button>
        </router-link>
      </div>
      <div v-else>
        <p>已进入审核，推广可用资金不足，请联系你的销售充值</p>
        <router-link style="display: block" :to="{name: 'qwt-promotion-list'}">
          <button>管理站外推广</button>
        </router-link>
      </div>
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
    },
    userInfo: {
      type: Object
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="postcss" scoped>
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

  &  button {
    @mixin center;
    margin: 10px auto 0 auto;
    height: 28px;
    border-radius: 14px;
    padding: 10px;
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
