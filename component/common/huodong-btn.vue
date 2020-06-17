<template>
  <div class="huodong-btn" v-if="visible">
    <span class="hide-btn" @click="visible = false">&times;</span>
    <a :href="href" target="_blank">
      <img src="//file.baixing.net/202006/2ff7804ab15a0955933c6bcbe1636d01.png" width="100%" alt="">
    </a>
  </div>
</template>

<script>
const href = `//bax.baixing.com.cn/huodong`

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
    this.href = href + window.location.search
  },
}
</script>

<style lang="postcss" scoped>
.huodong-btn {
  position: fixed;
  right: 1px;
  top: 50%;
  width: 220px;
  height: 144px;
  cursor: pointer;
  z-index: 100;
}
.hide-btn {
  position: absolute;
  right: 6px;
  top: -15px;
  width: 20px;
  height: 20px;
  line-height: 16px;
  text-align: center;
  color: #999;
  font-size: 16px;  
  border-radius: 50%;
  border: 1px solid #999;
  cursor: pointer;
}
</style>
