<template>
  <div class="wx-modal" v-show="visible">
    <div class="img-wrap">
      <img width="100%" height="100%" src="//file.baixing.net/bax-fe/asset/wx-modal-bax.png">
      <span class="close-btn" @click="handleWxModalClose">知道啦</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  props: {
    closeCb: [Function]
  },
  methods: {
    handleWxModalClose() {
      this.visible = false
      this.closeCb()
    }
  }
}
</script>

<style scoped lang="postcss">
.wx-modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1024;
  background-size: 381px 440px;
  background-color: rgba(0, 0, 0, .5);
  & .img-wrap {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 381px;
    height: 440px;
  }
  & .close-btn {
    position: absolute;
    bottom: 30px;
    left: 50%;
    margin-left: -75px;
    font-size: 15px;
    letter-spacing: 1px;
    width: 150px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 32px;
    color: #FF6220;
    border: 1px solid #FFBB9A;
    cursor: pointer;
  }
}
</style>
