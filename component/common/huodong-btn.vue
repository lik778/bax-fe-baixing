<template>
  <div class="huodong-btn">
    <a target="_blank" :href="href" >
      <img src="//file.baixing.net/202009/01cd60b266be03934366295f6cce3e8e.png">
    </a>
  </div>
</template>

<script>
const href = `https://www.baixing.com/rev/lottery?activity=lottery_activity202009`

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
