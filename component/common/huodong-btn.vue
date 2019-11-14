<template>
  <div class="huodong-btn">
    <a :href="href"><img src="http://file.baixing.net/201811/629d6d1e8b0c870fdf270e057fac567f.png" alt=""></a>
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
  right: 0;
  top: 50%;
  width: 136px;
  height: 116px;
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
