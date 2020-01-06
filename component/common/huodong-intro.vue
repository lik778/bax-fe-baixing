<template>
  <div class="huodong-intro" v-show="show">
    <a :href="href">
      <div class="center">
        <img src="//file.baixing.net/201811/d4dfeb04a7c1afbabe5afc5269da0f6f.png" alt="" @click="$emit('close')">
      </div>
    </a>
  </div>
</template>

<script>
const href = '//bax.baixing.com.cn/huodong'

export default {
  name: 'huodong-intro',
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
    const self = this
    document.querySelector('.huodong-intro').addEventListener('click', function(e) {
      if (e.target.tagName !== 'IMG') {
        self.$emit('close')
      }
    })
  },
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
