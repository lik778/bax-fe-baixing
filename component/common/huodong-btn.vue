<template>
  <div class="huodong-btn" v-if="visible">
    <span class="hide-btn" @click="visible = false">&times;</span>
    <a :href="href" target="_blank">
      <img src="http://file.baixing.net/201910/391757e0242319cda5caefa0ca64abea.png" alt="">
    </a>
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
  right: 55px;
  top: 50%;
  width: 166px;
  height: 166px;
  cursor: pointer;
  z-index: 100;
}
.hide-btn {
  position: absolute;
  right: -20px;
  top: 15px;
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
