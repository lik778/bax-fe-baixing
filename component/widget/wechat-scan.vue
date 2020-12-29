
<template>
<div>
  <div class="wechat-scan" @click="toggleWechatModalVisible(true)">
    <transition-group name="el-fade-in-linear" style="display:block;height:100%;">
      <span v-show="!iconVisible" class="text" key="text">扫码关注</span>
      <i class="icon" v-show="iconVisible" key="icon"></i>
    </transition-group>
  </div>
  <transition name="el-fade-in">
    <div class="wx-modal" v-if="modalVisible">
      <div class="img-wrap" @click="toggleWechatModalVisible(false)">
        <img src="//file.baixing.net/201903/a7560ecf7d023a1fbe63101f21504652.png" width="138" height="138">
        <span class="close-btn">&times;</span>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
export default {
  name: 'wechat-scan-btn',
  data () {
    return {
      iconVisible: true,
      modalVisible: false
    }
  },
  mounted () {
    setInterval(() => {
      this.iconVisible = !this.iconVisible
    }, 3000)
  },
  methods: {
    toggleWechatModalVisible (visible) {
      this.modalVisible = visible
    }
  }
}
</script>

<style lang="scss" scoped>
.wechat-scan {
  position: fixed;
  bottom: 150px;
  right: 20px;
  border: 1px solid #ccc;
  height: 52px;
  width: 52px;
  color: #999;
  font-size: 2.5em;
  background-color: #fff;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  z-index: 100;
  & .text {
    padding: 5px;
    letter-spacing: 2px;
    line-height: 20px;
    display: block;
    font-size: 16px;
    color: #f75353;
  }
  & .icon {
    display: block;
    width: 100%;
    height: 100%;
    background: url("//file.baixing.net/201811/77178e618bfebbe8ba414919fb366d1e.png")
      no-repeat center;
    background-size: 28px 28px;
  }
}

.wx-modal {
  position: fixed;
  top: 0;
  height: 100%;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1024;
  & .img-wrap {
    position: absolute;
    top: 50%;
    left: calc(50% + 90px);
    transform: translate3d(-50%, -50%, 0);
    background-color: #fff;
    padding: 8px;
    border-radius: 3px;
    font-size: 0;
  }
  & .close-btn {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -50px;
    width: 35px;
    height: 35px;
    text-align: center;
    line-height: 28px;
    color: #fff;
    border-radius: 50%;
    border: 1px solid #fff;
    cursor: pointer;
    font-size: 32px;
  }
}
</style>
