
<template>
  <div class="back-to-top"
    :style="{display: show ? '' : 'none'}"
    @click="gotoTop">
    <i class="el-icon-caret-top"></i>
  </div>
</template>

<script>

export default {
  name: 'bax-back-to-top-btn',
  data() {
    return {
      show: false
    }
  },
  methods: {
    onscroll() {
      if (window.pageYOffset > window.innerHeight) {
        this.show = true
      } else {
        this.show = false
      }
    },
    gotoTop() {
      window.scrollTo(window.pageXOffset, 0)
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onscroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.onscroll)
  }
}

</script>

<style scoped>

@import 'cssbase/mixin';

.back-to-top {
  @mixin center;

  position: fixed;
  bottom: 80px;
  right: 30px;

  border-radius: 50%;
  height: 50px;
  width: 50px;

  background: #20a0ff;
  cursor: pointer;
  font-size: 22px;
  color: white;
  opacity: 0.4;

  &:hover {
    opacity: 1;
  }
}

</style>
