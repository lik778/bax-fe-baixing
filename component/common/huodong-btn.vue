<template>
  <div class="huodong-btn">
    <a :href="href"><img src="http://file.baixing.net/201810/e709aea1f70ba444d8ea514590c76354.png" alt=""></a>
  </div>
</template>

<script>
const href = `http://bax.baixing.com.cn/huodong`

export default {
  name: 'huodong-btn',
  props: {
    show: Boolean
  },
  data() {
    return {
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
  width: 116px;
  height: 116px;
  cursor: pointer;
}
</style>
