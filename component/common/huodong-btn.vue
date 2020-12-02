<template>
  <div class="huodong-btn">
    <a target="_blank" :href="href" >
      <img src="//file.baixing.net/202011/0d0425f48e0a61b5b3cf7d030a8127ed.png">
    </a>
  </div>
</template>

<script>
const href = `https://www.baixing.com/rev/lottery?activity=lottery_activity20201111`

export default {
  name: 'huodong-btn',
  props: {
    show: Boolean
  },
  data() {
    return {
      visible: true,
      href: href
    }
  },
  mounted() {
    let searchPath = window.location.search
    if (searchPath.includes('?')) { searchPath = searchPath.replace('?', '&')  }
    this.href = href + searchPath
  },
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
}
.huodong-btn img {
  width: 100%;
}
</style>
