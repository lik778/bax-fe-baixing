
<template>
  <div class="go-to-buttom"
    :style="{display: show ? '' : 'none'}"
    @click="gotoBottom">
    <i class="el-icon-caret-bottom"></i>
  </div>
</template>

<script>
export default {
  name: 'bax-go-to-bottom-btn',
  data () {
    return {
      show: false
    }
  },
  computed: {
    height () {
      return Math.max(
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.scrollHeight,
        document.body.offsetHeight)
    }
  },
  methods: {
    onscroll () {
      const { height } = this

      if (height > 1200 && window.pageYOffset > 120 &&
        (height - window.pageYOffset) > (window.innerHeight + 120)) {
        this.show = true
      } else {
        this.show = false
      }
    },
    gotoBottom () {
      window.scrollTo(window.pageXOffset, this.height)
    }
  },
  mounted () {
    window.addEventListener('scroll', this.onscroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.onscroll)
  }
}
</script>

<style lang="scss" scoped>
.go-to-buttom {
  @include center;

  position: fixed;
  top: 80px;
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
