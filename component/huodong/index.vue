<template>
  <div>
      <div class='huodong-container'>
        <div class="banner"></div>
        <div class='content'>
          <div class='p-bg p-bg1'>
            <p>活动1：凤鸣买就送</p>
          </div>
          <div class='active part1 bg'>
              <p class='tit'>购买凤鸣产品买就送&nbsp;(站外推广)</p>
              <div class='f-flex' style="padding:0 33px;">
                  <div v-for="(item,index) in partOneList" :key="index">
                    <div><img :src="item" alt="" class='partOneImg'/></div>
                  </div>
              </div>
          </div>
          <button class='btn' @click="goTo('http://bax.baixing.com.cn/main/qwt/charge')">点此立即购买</button>
        </div>
        <div class='content'>
          <div class='p-bg p-bg2'>
            <p>活动2：标王买多少送多少</p>
          </div>
          <div class='active part2 bg'>
              <p class='tit'>四种火爆套餐任你选</p>
              <p class='ps bolder'>（注：标王欢乐/惊喜/狂欢套餐：仅限30天关键词参加，不限关键词价格，每个客户仅限购买一次；</p>
              <p class='ps bolder'>标王大单折扣：30天、90天的关键词都可参加）</p>
              <div class='f-flex-column' style='margin:0 5px;'>
                 <div class='row'>
                   <div class='bg-color1'>
                      <span class="title bg-tit1"><p>标王欢乐套餐</p></span>
                      <p>500元关键词<span>买一送一</span></p>
                      <p>每日限定<span>30</span>个名额</p>
                   </div>
                   <div class='bg-color2'>
                      <span class="title bg-tit2"><p>标王惊喜套餐</p></span>
                      <p>不限关键词价格买<span>1500送1500</span></p>
                      <p>每日限定<span>30</span>个名额</p>
                      <p class='bottom'>再+1200元可获得2年价值3600专业版官网</p>
                   </div>
                 </div>
                 <div class="row">
                   <div class='bg-color3'>
                     <span class="title bg-tit3"><p>标王狂欢套餐</p></span>
                     <p>不限关键词价格<span>买3000送3000</span></p>
                     <p>每日限定<span>20</span>个名额</p>
                     <p class='bottom'>再+900元可获得2年价值3600专业版官网</p>
                   </div>
                   <div class='bg-color4 other'>
                     <span class="title bg-tit4"><p>标王大单折扣</p></span>
                     <p><span>标王单笔订单</span></p>
                     <p style="transform:translateX(-20px)">6000-10000 <span class="m-15">8折</span></p>
                     <p>>=10000 <span class="m-15">75折</span></p>
                     <p class='bottom'>再+300元可获得2年价值3600专业版官网</p>
                   </div>
                 </div>
              </div>
          </div>
          <button class='btn' @click="goTo('http://bax.baixing.com.cn/main/bw/query-price')">点此立即购买</button>
        </div>
        <div class='content'>
          <div class='p-bg p-bg3'>
            <p>活动3：官网买一送一</p>
          </div>
          <div class='active part3 bg'>
              <p class='tit'><span>专业版官网买一年送一年</span>另搭配凤鸣/标王购买，官网大额减</p>
              <p class="color font-smaller bold"><span class="share">推荐套餐</span></p>
              <div class="f-flex wrap">
                <div v-for="(item,index) in partThreeList" :key="index">
                  <div :class="item.bg" class='item'>
                    <p class="white font-normal bold p-20"><span class='topic'> {{item.title}} </span></p>
                    <div class="main">
                      <p class="color font-n-s bold"> {{item.text1}} </p>
                      <p class="color font-n-s bold"> {{item.text2}} </p>
                      <p class="color font-ss bold"> {{item.text3}} </p>
                    </div>
                    <p class="font-n-s white bold p-10">双11惊爆价：<span class="xx"> {{item.price}} </span></p>
                    <p class="font-sss"> {{item.discount}} </p>
                  </div>
                </div>
              </div>
          </div>
          <button class='btn' @click="goTo('http://bax.baixing.com.cn/main/qwt/charge?select_gw=true')">点此立即购买</button>
        </div>
        <div class='content'>
          <div class='p-bg p-bg4'>
            <p>活动4：全民抽奖</p>
          </div>
          <div class='active part4 bg'>
              <div>
                <div class='row'>
                  <span>活动时间：</span><h6>2019.11.1 00:00-2019.11.12 23:59</h6>
                </div>
                <div class='row'>
                  <span>活动内容：</span>
                  <h6>全站所有用户通过购买搜索通产品，新开/续费/升级VIP套餐、充值VIP一卡通、充值普通一卡通、购买城市包这5种方式消费，每1元=1积分，每500积分可兑换1次抽奖机会</h6>
                </div>
                <div class='row'>
                  <span>兑奖时间：</span>
                  <h6>2019.11.7 00:00-2019.11.12 23:59</h6>
                </div>
                 <p class='contact'>（如有问题，请拨打客服热线咨询：400-036-3650）</p>
                 <img src="//file.baixing.net/201909/8f1b362f3c49bf911643eb5ff2eac313.png" alt="">
              </div>
          </div>
          <button class='btn' :class="{disabled: lotteryBtnDisabled}" @click="() => !lotteryBtnDisabled && goTo('http://www.baixing.com/rev/lottery?activity=lottery_activity20191111')">前往参与</button>
        </div>
        <div class='content' style="padding-bottom:40px">
          <div class='p-bg p-bg5'>
            <p>活动5：万元大奖等着你</p>
          </div>
          <div class='active part5 bg'>
              <p class='tit'>11/7 00:00-11/12 23:59 期间，购买搜索通产品</p>
              <p class='ps bolder'>（请前往【个人中心】-【我的站内通知】查看，如有问题请拨打客服热线咨询：400-036-3650）</p>
              <div class='f-flex p-20'>
                  <div class='item bg-one'>
                    <p>单笔订单满<span>3万，</span></p>
                    <p>送<span class="color">全自动加热按摩足浴盆一台</span></p>
                    <img src="//file.baixing.net/201909/befb6acb8ac73c5c4a6d6bce5ca33921.png" alt="">
                  </div>
                  <div class='item bg-two'>
                    <p>单笔订单满<span>6万，</span></p>
                    <p>送<span class="color">智能扫地机器人一台</span></p>
                     <img src="//file.baixing.net/201909/b08189da8776b571cc41c1f8e878384f.png" alt="">
                  </div>
                  <div class='item bg-three'>
                    <p>单笔订单满<span>10万，</span></p>
                    <p>送<span class="color">智能扫地机器人一台，</span></p>
                    <p>再送<span class="color">1万元一卡通</span></p>
                      <img  class='img1' src="//file.baixing.net/201909/b08189da8776b571cc41c1f8e878384f.png" alt="">
                      <span class='yuan'>
                        <img src="//file.baixing.net/201909/26b6840fcfd6ce01a2095395c88b5062.png" alt="">
                      </span>
                  </div>
              </div>
          </div>
        </div>
        <div class='content' style="padding-bottom:20px;">
          <div class='active rules'>
            <div class='f-flex mt-0'>
              <div>
                <span class='rules-tit'>活动规则
                   <img src="//file.baixing.net/201909/f9128f38fe653beb01f2b3816ad716fe.png" alt="">
                </span>
              </div>
            </div>
            <div class="main">
              <div class="row">
                  <div class='yuan'><p class='num'>1</p></div>
                  <p>活动时间：<strong class="color">10月25日 00:00-11月13日 23:59</strong></p>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>2</p></div>
                  <p>凤鸣满送无门槛现金券会直接进入个人账户，无需兑换。凤鸣享受满送现金券的订单不支持退款</p>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>3</p></div>
                  <p>官网买一送一活动：不限制用户和单数，一个用户可以在活动期间多次购买，均享受优惠</p>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>4</p></div>
                  <p>关于标王欢乐，惊喜，狂欢套餐，将符合条件的关键词加入关键词购物车并点击“去支付”，进入标王支付页面即可看到活动最终支付的价格。
                  例子：活动一选择两个500的关键词进入支付页面，即可用500元提单；活动二选择好总价为3000元的关键词（仅限30天，不限定关键词单价）
                  进入支付页面，即可用1500元提单；以上所有活动客户都可以参加，但只能单独购买，无法在同一个订单内同时参加所有活动，例：用户先充
                  值500元参加“活动一”；如果客户还想参加“活动二”需要重新购买1500元的关键词，并单独提单</p>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>5</p></div>
                  <p>购买前请阅读违禁行业类目；对于违禁行业，不能进行搜索通推广，如购买后不支持退款；
                  违禁行业类目见：
                  <strong ><a class="color" href="http://bax.baixing.com.cn/qa?mode=questions">http://bax.baixing.com.cn/qa?mode=questions</a></strong></p>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>6</p></div>
                  <p>解释权归百姓网所有，如有疑问请致电客服<strong class="color">400-036-3650</strong></p>
              </div>                                                                                    
            </div>
          </div>
        </div>
      </div>
  </div>


</template>

<script>
export default {
  name: 'active-page',
  data(){
    return{
      lotteryBtnDisabled: true,
      partOneList:[
        '//file.baixing.net/201909/56f16c3b337c8406b1089e4b0ee079cd.png',
        '//file.baixing.net/201909/fe400a235ec484e5fadba476a710dda8.png',
        '//file.baixing.net/201909/6920534b93e7a300dc3c3e599515d483.png',
        '//file.baixing.net/201909/94d4270d33b3e2b1caccd0a7dd355613.png'
      ],
      partThreeList:[
        {
          bg:'bg1',
          title:'爆款套餐',
          text1:'588元凤鸣资金+',
          text2:'3600元 2年专业版官网',
          text3:'（带SEO功能）',
          price:'1788元',
          discount:'（价值4188元套餐  直降2400元）'
        },{
          bg:'bg2',
          title:'人气套餐',
          text1:'5088元凤鸣资金+',
          text2:'3600元 2年专业版官网',
          text3:'（带SEO功能）',
          price:'5988元',
          discount:'（价值8876元套餐  直降3188元）'         
        },{
          bg:'bg3',
          title:'王炸套餐',
          text1:'10188元凤鸣资金+',
          text2:'3600元 2年专业版官网',
          text3:'（带SEO功能）',
          price:'10488元',
          discount:'（价值14288元套餐  直降3800元）'
        }
      ] 
    }
  },
  async created() {
    const date = new Date()
    if (
      date.getMonth() === 10 &&
      date.getDate() >= 1 &&
      date.getDate() <= 12
    ) {
      this.lotteryBtnDisabled = false
    }
  },
  methods: {
    goTo(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="postcss" scoped>
@import "../../cssbase/var.css";

.huodong-container{
  background-size: 100% 520px;
  background-color: #CC2F2F;
  & .banner {
    padding: 18.5% 50%;
    background: url('//file.baixing.net/201910/08564455f30dec7128ceccf98f5d431a.png') top -18px center no-repeat;
    background-size: contain;
  }
  & .content{
    padding-bottom: 100px;
    box-sizing: border-box;
     & .bolder{
       font-weight: 600;
    }
    & .p-bg{
      display:block;
      width:900px;
      height:60px;
      margin:0 auto;
      font-weight: 600;
      letter-spacing: 2px;
    }
    & .p-bg1{
      background: url('//file.baixing.net/201910/4dc6da3cb47a07fc99cc7314b647150e.png') no-repeat;
      background-size: cover;
    }
    & .p-bg2{
      background: url('http://file.baixing.net/201910/6abb960d577aa0a28f53fe0a3991396e.png') no-repeat;
      background-size: cover;
    } 
    & .p-bg3{
      background: url('//file.baixing.net/201910/56ad1ba68efe679968ad7d2f2e662016.png') no-repeat;
      background-size: cover;
    }
    & .p-bg4{
      background: url('//file.baixing.net/201910/6abb960d577aa0a28f53fe0a3991396e.png') no-repeat;
      background-size: cover;
    }
    & .p-bg5{
      background: url('//file.baixing.net/201910/40d549921e4703123a5405448b6f5bf4.png') no-repeat;
      background-size: cover;
    }
    & p{
      color:  var(--active-white);
      font-size: var(--font-large);
    }
    &>.bg{
      background: url('//file.baixing.net/201909/89406fb6d89073173c36f9f35a66967a.png') top center no-repeat;
      background-size: cover;
      background-color:var(--active-white);
    }
    & .active{
      width: 900px;
      margin: 20px auto 30px auto;
      border: 4px solid var(--active-border);
      border-radius: 15px;
      & .tit{
        margin:28px 0 28px 0;
        color:  var(--active-primary);
        font-size: var(--font-normal);
        font-weight: bold;
      }
      & .tit::before{
        content:'';
        display: inline-block;
        width: 80px;
        height: 2px;
        background:  var(--active-primary);
        transform: translateY(-6px);
        margin-right: 25px;
      }
      & .tit::after{
        content:'';
        display: inline-block;
        width: 80px;
        height: 2px;
        background:  var(--active-primary);
        transform: translateY(-6px);
        margin-left: 25px;
      }
      & .f-flex{
        margin-top:50px;
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        & .partOneImg{
          width: 124px;
          height:auto;
        }
      }
    }
    & .part1{
      height: 300px;
    }
    & .part2{
      height: 622px;
      & .f-flex-column{
        padding: 5px 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        & .row{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin:20px 0;
          &>div{
            width: 340px;
            height: 200px;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            & .title{
              position: absolute;
              top:0;
              left:0;
              display: block;
              width:200px;
              height: 44px;
              border-radius: 15px 0 30px 0;
              color: var(--active-white);
              line-height: 44px;
              & p{
                font-size: var(--font-mid);
                transform:translateX(-10px);
              }
            }
            & .flex-end{
              align-self: flex-end;
            }
            & p{
              font-size: var(--font-n-s);
              &>span{
                margin:0 8px;
                font-weight:400;
                font-size: var(--font-mid);
              }
              &>.m-15{
                margin-left: 25px;
              }
            }
            & .bottom{
              font-size: var(--font-small);
              transform: translateY(30px);
              position: absolute;
              bottom:50px;
              left:20px;
            }
          }
          &>.other{
            align-self: flex-start;
          }
          & .bg-color1{
            background-image: linear-gradient(163deg, #ED48FF 0%, #7E4BEF 100%);
          }
          & .bg-color2{
            background-image: linear-gradient(159deg, #FFC221 0%, #E6430B 100%);
          }
          & .bg-color3{
            background-image: linear-gradient(161deg, #F47E98 0%, #ED384B 100%);
          }
          & .bg-color4{
            background-image: linear-gradient(148deg, #87EDFF 0%, #3670F4 100%);
          }
          & .bg-tit1{
            background: #863EF1;
          }
          & .bg-tit2{
            background: #E3591B;
          }
          & .bg-tit3{
            background: #E22E4C;
          }
          & .bg-tit4{
            background: #2C75CE;
          }
        }
      }
      & .ps{
         font-size: var(--font-small);
         color: var(--active-primary);
      }
    }
    & .part3{
      & .tit>span{
        font-size:12px;
        display: inline-block;
        background: #FCC31B;
        font-size: var(--font-normal);
        padding:0 10px;
        line-height:34px;
        margin-right:8px;
      }
      & .share{
        position: relative;
      }
      & .share::before{
        position: absolute;
        content: '';
        display: block;
        height: 16px;
        width:3px;
        top:3px;
        left:-20px;
        background-image: linear-gradient(180deg, #FFCF71 0%, #FF3EA5 100%);        
      }
      & .share::after{
        position: absolute;
        content: '';
        display: block;
        height: 16px;
        width:3px;
        top:3px;
        right:-20px;
        background-image: linear-gradient(180deg, #FFCF71 0%, #FF3EA5 100%);        
      }
      & .item{
        width:252px;
        height:300px;
        border-radius: 15px;
        & .topic{
          position: relative;
        }
        & .topic::before{
          position: absolute;
          content:'';
          display: block;
          width:31px;
          height:2px;
          padding: 5px 0;
          left:-48px;
          top:6px;
          background:#ED5221 ;
          border-top:2px solid #ED5221 ;
          border-bottom:2px solid #ED5221;
          background-clip:content-box;
        }
        & .topic::after{
          position: absolute;
          content:'';
          display: block;
          width:31px;
          height:2px;
          padding: 5px 0;
          right:-48px;
          top:6px;
          background:#ED5221 ;
          border-top:2px solid #ED5221 ;
          border-bottom:2px solid #ED5221;
          background-clip:content-box;
        }
        & .main{
          width:240px;
          padding:20px 0;
          box-sizing: border-box;
          height:150px;
          background: #fff;
          border-radius: 15px;
          margin:0 auto;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
        & .xx{
          font-size: var(--font-mid);
        }
      }
      & .wrap{
        margin:30px 0;
        padding:0 20px;
      }
      & .bg1{
        background-image: linear-gradient(-26deg, #F41449 0%, #FFBC14 100%);
      }
      & .bg2{
        background-image: linear-gradient(165deg, #FF87C8 0%, #F63448 100%);
      }
      & .bg3{
        background-image: linear-gradient(163deg, #ED48FF 0%, #7641EA 100%);
      }
      & .white{
        color: var(--active-white);
      }
      & .color{
        color: var(--active-primary);
      }
      & .font-mid{
        font-size: var(--font-mid);
      }
      & .font-normal{
        font-size: var(--font-normal);
      }
      & .font-ss{
        font-size:14px;
      }
      & .font-sss{
        font-size: 12px;
      }
      & .font-smaller{
        font-size: var(--font-small);
      }
      & .font-n-s{
        font-size: var(--font-n-s);
      }
      & .bold{
        font-weight: bold;
      }
      & .p-10{
        padding: 10px 0;
      }
      & .p-20{
        padding: 20px 0;
        letter-spacing: 1px;
      }
    }
    & .part4>div{
      position: relative;
      box-sizing: border-box;
      margin:28px;
      padding: 34px 20px;
      border-radius: 15px;
      height:100%;
      background:#fa8b17;
      & .row{
        display: flex;
        & h6{
          color: var(--active-white);
          font-size: var(--font-normal);
          font-weight: 400;
          margin-bottom:34px;
          flex: 1;
        }
        & span{
          display: block;
          color: var(--active-white);
          font-size: var(--font-n-s);
        }
      }
      & .contact{
        font-size: var(--font-small);
        text-align: left;
        margin-bottom: 36px;
      }
      &>img{
        position: absolute;
        display: block;
        width:320px;
        height:auto;
        bottom: 0;
        right: 10px;
      }
    }
    & .part5{
      & .ps{
         font-size: var(--font-small);
         color: var(--active-primary);
         transform: translateY(-10px);
      }
      & .p-20{
        margin:30px 20px;
      }
      & .item{
        width:265px;
        height:260px;
        border-radius: 15px;
        padding:20px 10px;
        box-sizing: border-box;
        position: relative;
        
        & p{
          font-size: var(--font-n-s);
          text-align:left;
          margin-bottom:10px;
          white-space: nowrap;
          letter-spacing:1px;
          & span{
            font-size: var(--font-mid);
          }
          & .color{
            font-size: var(--font-n-s);
            font-weight: bold;
            color: var(--active-bg-btn);
          }
        }
        & img{
          display: block;
          position: absolute;
          width: 112px;
          height: 100px;
          right: 20px;
          bottom: 20px;
        }
        & .img1{
          left: 30px;
        }
        & .yuan{
          display: block;
          position: absolute;
          border-radius: 50%;
          background:#fff;
          height: 100px;
          width: 100px;
          bottom:36px;
          right:8px;
          bottom: 20px;
        }
        & .yuan>img{
          display: block;
          width:88px;
          height:60px;
          position: absolute;
        }
      }
      & .bg-one{
        background: url('//file.baixing.net/201910/149f3d9b9279381f057e74d372d9b5a6.png') no-repeat;
        background-size: cover;
      }
      & .bg-two{
        background: url('//file.baixing.net/201910/2105f3d5b7bec2d955815accb587a26c.png') no-repeat;
        background-size: cover;
      }
      & .bg-three{
        background: url('//file.baixing.net/201910/9ef9969b7f4b25a1a4005a2d44cc4f5f.png') no-repeat;
        background-size: cover;
      }
    }
    & .rules{
      border: none;
      box-sizing: border-box;
      background: #BA2020;
      padding: 30px 50px;
      margin-bottom:100px;
      & .rules-tit{
        display: inline-block;
        margin: 0 auto;
        color: #fff;
        font-size: var(--font-normal); 
        position: relative;
        z-index:999;
        & img{
          position: absolute;
          width:140px;
          height:34px;
          top:0;
          left:-28px;
          z-index: -1;
        }
      } 
      & .main{
        margin-top:50px;
        & .row{
          display: flex;
          margin-bottom:10px;
        }
        & .yuan{
          width:18px;
          height:18px;
          border-radius: 50%;
          background:var(--active-footer);
          margin-right:10px;
          & .num{
            color:#B71C18;
            text-align:center;
            line-height:18px;
            font-weight:bold;
          }
        }
      }
      & .mt-0{
        margin-top:0;
      }
      & .color{
        color: var(--active-footer);
        text-decoration:none;
        cursor:pointer;
      }
      & p{
        color: var(--active-rules);
        font-size: var(--font-smaller);
        text-align:left;
        flex:1;
      }
    }

  }
}
p{
  text-align: center;
}
.btn{
  background: var(--active-bg-btn);
  color: var(--active-primary);
  font-size: var(--font-mid);
  font-weight: bold;
  outline:none;
  border:none;
  width: 285px;
  height: 65px;
  margin:0 auto;
  display: block;
  border-radius: 9999px;
  cursor: pointer;
  &.disabled {
    cursor: not-allowed;
    color: #666;
    background-color: rgba(244, 244, 244, .8);
  }
}
</style>
