<template>
  <div class="huodong-intro" v-show="show">
    <div class="center">
      <img src="http://file.baixing.net/201810/ee0bf3a22a1b8c2d8a1798001d514a9c.png" alt="" @click="$emit('close')">
      <a href="http://bax.baixing.com.cn/huodong">去看看</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'huodong-intro',
  props: {
    show: Boolean
  }
}
</script>

<style lang="postcss" scoped>
@import "../../cssbase/var";
@import "cssbase/mixin";

.huodong-intro {
  @mixin center;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(41, 41, 41, 0.7);

  & > .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > a {
      width: 260px;
      height: 50px;
      border-radius: 4px;
      background-color: #FFD500;
      color: #5F00C9;
      line-height: 50px;
      text-align: center;
    }
  }
}
</style>
