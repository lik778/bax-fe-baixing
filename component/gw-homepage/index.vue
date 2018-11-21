<template>
  <div class="gw-container">
    <h2>精品官网</h2>
    <h4>快速建立个性化网站，提供专业品牌形象</h4>
    <ul class="list">
      <li class="title">产品优势：</li>
      <li>
        <span class="list-num">1</span>
        跨终端呈现、提供PC+手机+ 微信分享
      </li>
      <li>
        <span class="list-num">2</span>
        多渠道、支持多渠道共享落地页（百姓网，百度，神马，360，搜狗）
      </li>
      <li>
        <span class="list-num">3</span>
        丰富媒体库，精美模板
      </li>
      <li>
        <span class="list-num">4</span>
        功能强大，支持多条帖子同台展现，支持一键外呼、评论和留言功能，不放过任何一个机会
      </li>
    </ul>
    <div class="button" @click="goChargePage">点击购买</div>
  </div>
</template>

<script>
import { baxUserLogin, getUserTicketCount } from 'api/ka'
export default {
  name: 'gw-homepage',
  data() {
    return {
      ticketCount: 0
    }
  },
  async created() {
    await baxUserLogin()
    this.ticketCount = await getUserTicketCount({})
    if (this.ticketCount) {
      window.location.href = '/ka/main'
    }
  },
  methods: {
    goChargePage() {
      this.$router.push({name: 'qwt-charge', query: {select_gw: 1}})
    }
  }
}
</script>

<style lang="postcss" scoped>
  .gw-container {
    min-height: 100vh;
    background: #FCFAFA;
    text-align: center;
    color: #666;
    & > h2 {
      position: relative;
      font-size: 30px;
      color: #333;
      margin-bottom: 28px;
      margin-top: 100px;
      &:after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 2px;
        background: linear-gradient(-180deg, #FF650C 0%, #FFA205 100%);
      }
    }
    & > h4 {
      font-size: 18px;
      margin-bottom: 54px;
      font-weight: normal;
    }
  }
  .list {
    width: 1000px;
    margin: 0 auto;
    font-size: 16px;
    padding-left: 620px;
    background: url('//file.baixing.net/201811/bfccf1c0f4269bc3e43106bfae807663.png') left center no-repeat;
    background-size: 535px 320px;
    text-align: left;
    & .title {
      font-weight: 600;
      color: #333;
      font-size: 20px;
    }
    & .list-num {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #888;
      background: #FFFFFF;
      border: 1px solid #DBDBDB;
      border-radius: 4px;
      margin-right: 12px;
    }
    & > li {
      padding-bottom: 22px;
    }
  }
  .button {
    width: 220px;
    height: 50px;
    margin: 60px auto;
    line-height: 50px;
    background: #FFA205;
    border-radius: 25px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }
</style>
