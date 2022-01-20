
<template>
  <div class="back-to-top"
    @click="gotoTop">
    <i class="el-icon-arrow-up"></i>
  </div>
</template>

<script>
export default {
  name: 'bax-back-to-top-btn',
  methods: {
    gotoTop () {
      window.scrollTo(window.pageYOffset, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.back-to-top {
  border: 1px solid #ccc;
  height: 52px;
  width: 52px;
  color: #999;
  font-size: 2.5em;
  background-color: #fff;
  text-align: center;
  line-height: 52px;
  cursor: pointer;
  border-radius: 4px;
  z-index: 100;
}
</style>
