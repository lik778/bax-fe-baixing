<template>
  <div class="homepage">
    <account :userInfo="userInfo"/>
    <homepage-campaign :userInfo="userInfo"/>
    <biaowang :userInfo="userInfo" />
    <site />
  </div>
</template>

<script>
import store from './store'

import Site from './site'
import Account from './account'
import Biaowang from './biaowang'

export default {
  name: 'qwt-homepage',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  mounted () {
    const { query: { user_id: userId } } = this.$route
    store.initPageStore(userId)
  },
  components: {
    Site,
    Account,
    Biaowang
  }
}
</script>

<style lang="scss" scoped>
  @mixin layout-base {
    border-radius: 4px;
    box-shadow: 0 2px 9px 0 rgba(83,95,127,0.10);
    background-color: #fff;
    padding: 0 20px 30px;
  }
  .homepage {
    padding: 0 10px;
    font-size: 14px;
    color: #666;
    /* ------------ layout style ------------ */
    & .layout-container {
      display: flex;
      &:not(:first-of-type) {
        margin-top: 10px;
      }
      & /deep/ .layout-left {
        flex-basis: 62%;
        margin-right: 10px;
        @include layout-base;
      }
      & /deep/ .layout-right {
        flex-basis: 38%;
        @include layout-base;
      }
      & /deep/ .layout-header {
        width: 100%;
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        color: #666;
        border-bottom: 1px solid #E6E6E6;
        & .action {
          float: right;
          padding-left: 20px;
          font-size: 14px;
          color: #999;
          font-weight: normal;
          cursor: pointer;
        }
      }
    }
  }
</style>
