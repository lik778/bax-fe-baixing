<template>
  <div class="homepage">
    <Accout />
  </div>
</template>

<script>
import store from './store'
import Accout from './accout'
export default {
  components: {
    Accout
  }
}
</script>

<style lang="postcss" scoped>
  @define-mixin layout-base {
    border-radius: 4px;
    box-shadow: 0 2px 9px 0 rgba(83,95,127,0.10);
    background-color: #fff;
  }
  .homepage {
    padding: 0 10px;
    /* ------------ layout style ------------ */
    & .layout-container {
      display: flex;
      margin-top: 10px;
      & >>> .left-container {
        flex-grow: 17.3;
        margin-right: 10px;
        @mixin layout-base;
      }
      & >>> .right-container {
        flex-grow: 10;
        @mixin layout-base;
      }
    }
  }
</style>
