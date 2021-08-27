<template>
    <div class="wechat-scan" v-if="visible">
        <i @click="visible=false" class="el-icon-circle-close close-qrcode"></i>
        <img class="qrcode-img" src="//file.baixing.net/202107/4937607acaf1a3da4af87d80bc159f26.jpg"/>
    </div>
</template>
<script>
export default {
  name: 'wechat-qrcode',
  data () {
    return {
      visible: true
    }
  }
}
</script>
<style lang="scss" scoped>
.wechat-scan {
  position: fixed;
  bottom: 153px;
  right: 20px;
  height: 190px;
  width: 109px;
  color: #999;
  font-size: 2.5em;
  background: url('//file.baixing.net/202108/d69869b05a0c54eea12a9b67bd07a6f6.png') no-repeat center/contain;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
}
.close-qrcode{
    width: 20px;
    height: 20px;
    font-size: 20px;
    position: absolute;
    right: 0;
    top: -23px;
}
.qrcode-img{
    width: 90%;
}

</style>
