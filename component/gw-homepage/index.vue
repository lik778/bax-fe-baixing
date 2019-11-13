<template>
  <div class="gw-container">
    <h2>精品官网</h2>
    <h4>快速建立个性化网站，提供专业品牌形象</h4>
    <ul class="list">
      <li class="title">产品优势：</li> 
      <li>
        <span class="list-num">1</span>
        海量模板，一键套用，极速生成
      </li>
      <li>
        <span class="list-num">2</span>
        网站三合一，一次建站，电脑+手机+微信，三个平台通用
      </li>
      <li>
        <span class="list-num">3</span>
        多类型组件，让您的网站功能齐全，极具个性
      </li>
      <li>
        <span class="list-num">4</span>
        维护便利：自己可及时修改网站内容，7*24小时安全监控
      </li>
    </ul>
        
    <div class="gw-compare">
      <div class="item normal">
        <div class="header">
          <h6>标准版</h6>
          <p>（买2年送1年）</p>
        </div>
        <ul>
          <li :key="item" v-for="item in normalSite">{{item}}</li>
        </ul>
        <a @click="goChargePage">立即购买</a>
      </div>
      <div class="vs">
        <span>vs</span>
      </div>
      <div class="item pro">
        <div class="header">
          <h6>专业版</h6>
          <p>（价值5000元）</p>
        </div>
        <ul>
          <li :key="item" v-for="item in professionalSite">{{item}}</li>
        </ul>
        <a @click="goChargePage">立即购买</a>
      </div>
    </div>
    <div class="button compare" @click="showModal">
      查看特性对比
    </div>
    <div id="modal" :style="visible ? 'display: flex' : ''">
      <div class="content-container">
        <img src="http://file.baixing.net/201910/984676c9cd82a3d61af8b3ee15a73ed2.png" alt="精品官网功能对比" width="100%">
      </div>
      <div class="close-btn" @click="hideModal">&times;</div>
    </div>
  </div>
</template>

<script>
import { baxUserLogin, getUserTicketCount } from 'api/ka'
export default {
  name: 'gw-homepage',
  data() {
    return {
      ticketCount: 0,

      visible: false,
      normalSite: ['海量模版，素材工厂，一键生成', '多端展示，多类型组件', '微信留言', '数据监控'],
      professionalSite: ['海量模版，素材工厂，一键生成', '多端展示，多类型组件', '微信留言', '数据监控', '支持SEO及诊断优化', '友情链接']
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
    showModal() {
      this.visible = true
      document.body.style = 'overflow-y: hidden;'
    },
    hideModal() {
      this.visible = false
      document.body.style = 'overflow-y: auto;'
    },
    goChargePage() {
      this.$router.push({name: 'qwt-charge', query: {select_gw: true}})
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
    padding-bottom: 28px;
    & > h2 {
      position: relative;
      font-size: 30px;
      color: #333;
      margin-bottom: 18px;
      padding-top: 30px;
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

  #modal {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .66);
    z-index:2;
  }
  #modal .content-container {
    overflow-y: scroll;
    transform: translate3d(0, 0, 0);
    height: 75%;
    transform: translateY(-40px);
  }
  #modal .close-btn {
    height: 30px;
    line-height: 22px;
    font-size: 22px;
    width: 30px;
    border-radius: 50%;
    color: #fff;
    border: 2px solid #fff;
    text-align: center;	
    cursor: pointer;
    transform: translateY(-20px);
  }

  .gw-compare {
    margin-top: 40px;
    display: flex;
    padding:0 102px;
  }
  .gw-compare .normal .header{
    background-image: linear-gradient(172deg, #FFD53C 0%, #FF7E3B 100%);
  }
  .gw-compare .pro .header{
    background-image: linear-gradient(166deg, #FF6EA4 0%, #FA4A4A 100%);
  }
  .gw-compare .vs{
    width: 162px;
    margin:0 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .gw-compare .vs>span{
    display:block;
  }
  .gw-compare .vs>span:nth-of-type(1){
    opacity: 0.1;
    height: 106px;
    font-size: 162px;
    color: #333333;
    transform: translateY(-100px);
  }
  .gw-compare .compare{
    border: 1px solid #FFA205;
    background: #fff;
    color: #FFA205;
    border-radius: 16px;
    height: 34px;
    line-height: 32px;
    width:100%;
    cursor: pointer;
    user-select: none;
    z-index: 1;
  }
  .gw-compare .header {
    height: 123px;
    padding-top: 4px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  .gw-compare .header:after {
    content: '';
    position: absolute;
    left: 0;
    transform: translate3d(-33.3%, 97.5%, 0);
    padding: 150%;
    bottom: 0;
    background: #fff;
    border-radius: 100%;
  }
  .gw-compare ul{
    margin-top:10px;
  }
  .gw-compare .header > h6 {
    color: #fff;
    font-size: 28px;
    margin-top:15px;
  }
  .gw-compare .header > p {
    color: #fff;
    font-size: 16px;
    margin-top: -4px;
  }
  .gw-compare .item {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex: 1;
    width: 40%;
    background: #fff;
    border-radius: 2px;
  }
  .gw-compare .item + .item {
    margin-left: 4px;
  }
  .gw-compare li {
    color: #333333;
    text-align: left;
    white-space: nowrap;
    background: #fff;
    text-indent: -1em;
    font-size: 14px;
    transform-origin: left top;
    margin-bottom: 15px;
    list-style: disc;
  }
  .gw-compare a {
    height: 32px;
    line-height: 32px;
    display: inline-block;
    width: 140px;
    color: #fff !important;
    background: #FFA205;
    border-radius: 16px;
    margin-top: auto;
    margin-bottom: 20px;
  }
</style>
