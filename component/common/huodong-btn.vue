<template>
  <div class="huodong-btn">
    <a :href="href" target="_blank"><img src="http://file.baixing.net/201910/391757e0242319cda5caefa0ca64abea.png" alt=""></a>
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
  right: 55px;
  top: 50%;
  width: 166px;
  height: 166px;
  cursor: pointer;
  z-index: 100;
}
</style>
