<template>
  <div class="huodong-btn" v-if="visible">
    <a target="_blank" :href="href">
      <img src="//file.baixing.net/202106/05873a4a3b73a382de36ed49a76d2fed.png">
    </a>
    <i class="el-icon-close" @click="visible = false"></i>
  </div>
</template>

<script>
const href = 'https://www.baixing.com/rev/lottery?activity=lottery_activity20210618'

export default {
  name: 'huodong-btn',
  props: {
    show: Boolean
  },
  data () {
    return {
      visible: true,
      href: href
    }
  },
  mounted () {
    let searchPath = window.location.search
    if (searchPath.includes('?')) { searchPath = searchPath.replace('?', '&') }
    this.href = href + searchPath
  }
}
</script>

<style lang="scss" scoped>
.huodong-btn {
  position: fixed;
  right: 0;
  top: 50%;
  width: 136px;
  height: 116px;
  cursor: pointer;
  z-index: 100;
  .el-icon-close {
    position: absolute;
    top: -6px;
    right: 0;
    color: #666;
    border-radius: 50%;
    font-size: 14px;
  }
}
.huodong-btn img {
  width: 100%;
}
</style>
