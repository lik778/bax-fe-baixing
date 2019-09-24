<template>
  <div>
      <div class='banner'>
        <div class='content'>
          <p>活动1：凤鸣买就送</p>
          <div class='active part1'>
              <p class='tit'>购买凤鸣产品买就送&nbsp;(站外推广)</p>
              <div class='f-flex'>
                  <div v-for="(item,index) in partOneList" :key="index">
                    <div><img :src="item" alt="" class='partOneImg'/></div>
                  </div>
              </div>
          </div>
          <button class='btn'>点此立即购买</button>
        </div>
        <div class='content'>
          <p>活动2：标王买多少送多少</p>
          <div class='active part2'>
              <p class='tit'>四种火爆套餐任你选</p>
              <p class='ps'>（注：标王欢乐/惊喜/狂欢套餐：仅限30天关键词参加，不限关键词价格，每个客户仅限购买一次；</p>
              <p class='ps'>标王大单折扣：30天、90天的关键词都可参加）</p>
              <div class='f-flex-column'>
                 <div class='row'>
                   <div class='bg-color1'>
                      <p>500元关键词<span>买一送一</span></p>
                      <p>每日限定<span>30</span>个名额</p>
                   </div>
                   <div class='bg-color2'>
                      <p>不限关键词价格买<span>1500送1500</span></p>
                      <p>每日限定<span>30</span>个名额</p>
                      <p class='bottom'>再+1200元可获得2年价值3600专业版官网</p>
                   </div>
                 </div>
                 <div class="row">
                   <div class='bg-color3'>
                     <p>不限关键词价格<span>买3000送3000</span></p>
                     <p>每日限定<span>20</span>个名额</p>
                     <p class='bottom'>再+900元可获得2年价值3600专业版官网</p>
                   </div>
                   <div class='bg-color4'>
                     <p><span>标王单笔订单</span></p>
                     <p>6000-10000 <span class="m-15">8折</span></p>
                     <p>>=10000 <span class="m-15">75折</span></p>
                     <p class='bottom2'>再+300元可获得2年价值3600专业版官网</p>
                   </div>
                 </div>
              </div>
          </div>
          <button class='btn'>点此立即购买</button>
        </div>
        <div class='content'>
          <p>活动3：官网限时买一送一</p>
          <div class='active part3'>
              <p class='tit'><span>专业版官网买一年送一年</span>另搭配凤鸣/标王购买，官网大额减</p>
              <p class="color font-smaller bold"><span class="share">推荐套餐</span></p>
              <div class="f-flex wrap">
                <div class='item bg1'>
                  <p class="white font-normal bold p-20"><span class='topic'>爆款套餐</span></p>
                  <div class="main">
                    <p class="color font-n-s bold">588元凤鸣资金+</p>
                    <p class="color font-n-s bold">3600元 2年专业版官网</p>
                    <p class="color font-ss bold">（带SEO功能）</p>
                  </div>
                  <p class="font-n-s white bold p-10">双11惊爆价：<span class="xx">1788元</span></p>
                  <p class="font-sss">（价值4188元套餐  直降2400元）</p>
                </div>
                <div class='item bg2'>
                  <p class="white font-normal bold p-20"><span class='topic'>人气套餐</span></p>
                  <div class="main">
                    <p class="color font-n-s bold">5088元凤鸣资金+</p>
                    <p class="color font-n-s bold"> 3600元 2年专业版官网</p>
                    <p class="color font-ss bold">（带SEO功能）</p>
                  </div>
                  <p class="font-n-s white bold p-10">双11惊爆价：<span class="xx">5988元</span></p>
                  <p class="font-sss">（价值8876元套餐  直降3188元）</p>
                </div>
                <div class='item bg3'>
                  <p class="white font-normal bold p-20"><span class='topic'>王炸套餐</span></p>
                  <div class="main">
                    <p class="color font-n-s bold">14288元凤鸣资金+</p>
                    <p class="color font-n-s bold"> 3600元 2年专业版官网</p>
                    <p class="color font-ss bold">（带SEO功能）</p>
                  </div>
                  <p class="font-n-s white bold p-10">双11惊爆价：<span class="xx">10488元</span></p>
                  <p class="font-sss">（价值14288元套餐  直降3800元）</p>
                </div>
              </div>
          </div>
          <button class='btn'>点此立即购买</button>
        </div>
        <div class='content'>
          <p>活动4：全民抽奖</p>
          <div class='active part4'>
              <p class='tit'>购买凤鸣产品买就送&nbsp;(站外推广)</p>
              <div>
                <div class='row'>
                  <span>活动时间：</span><h6>2019.11.1-2019.11.12</h6>
                </div>
                <div class='row'>
                  <span>活动内容：</span>
                  <h6>全站所有用户通过购买搜索通产品，新开/续费/升级VIP套餐、充值VIP一卡通、充值普通一卡通、购买城市包这5种方式消费，每1元=1积分，每500积分可兑换1次抽奖机会</h6>
                </div>
                <div class='row'>
                  <span>兑奖时间：</span>
                  <h6>2019.11.9-2019.11.12</h6>
                </div>
                 <p class='contact'>（如有问题，请拨打客服热线咨询：400-036-3650）</p>
                 <img src="//file.baixing.net/201909/8f1b362f3c49bf911643eb5ff2eac313.png" alt="">
              </div>
          </div>
          <button class='btn'>点此立即购买</button>
        </div>
        <div class='content'>
          <p>活动5：万元大奖等着你</p>
          <div class='active part5'>
              <p class='tit'>11/9-11/12 期间，购买搜索通产品</p>
              <p class='ps'>（请前往【个人中心】-【我的站内通知】查看，如有问题请拨打客服热线咨询：400-036-3650）</p>
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
          <button class='btn'>点此立即购买</button>
        </div>
        <div class='content'>
          <div class='active rules'>
            <div class='f-flex mt-0'>
              <div class='rules-tit'>
                <span>活动规则</span>
                <img src="//file.baixing.net/201909/f9128f38fe653beb01f2b3816ad716fe.png" alt="">
              </div>
            </div>
            <div class="main">
              <div class="row">
                  <div class='yuan'><p class='num'>1</p></div>
                  <p>活动时间：<strong class="color">10月25日-11月13日</strong></p>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>2</p></div>
                  <p>凤鸣满送无门槛现金券会直接进入个人账户，无需兑换。活动期间每个用户只可享受一次； 凤鸣享受满送现金券的订单不支持退款</p>
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
违禁行业类目见：<strong class="color">http://bax.baixing.com.cn/qa?mode=questions</strong></p>
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
      partOneList:[
        '//file.baixing.net/201909/56f16c3b337c8406b1089e4b0ee079cd.png',
        '//file.baixing.net/201909/fe400a235ec484e5fadba476a710dda8.png',
        '//file.baixing.net/201909/6920534b93e7a300dc3c3e599515d483.png',
        '//file.baixing.net/201909/94d4270d33b3e2b1caccd0a7dd355613.png'
      ],
    }
  }
}
</script>

<style lang="postcss" scoped>
@import "../../cssbase/var.css";

.banner{
  background: url('//file.baixing.net/201909/a5f66aefc24398db868737040c029ed0.png') top center no-repeat;
  background-size:cover;
  & .content{
    padding-bottom: 50px;
    box-sizing: border-box;
    & p{
      color:  var(--active-white);
      font-size: var(--font-large);
    }
    & .active{
      width: 900px;
      margin: 20px auto 30px auto;
      background:  var(--active-white);
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
            }
            & .bottom2{
              font-size: var(--font-small);
              transform: translateY(15px);
            }
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
        font-size: var(-font-mid);
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
      background-image: linear-gradient(177deg, #FFD921 0%, #F4330B 100%);
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
        width:250px;
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
        background-image: linear-gradient(171deg, #AEE8FF 0%, #385AF1 100%);
      }
      & .bg-two{
        background-image: linear-gradient(162deg, #FFC328 0%, #E21234 100%);
      }
      & .bg-three{
        background-image: linear-gradient(154deg, #FF83A6 0%, #ED384B 100%);
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
        & span{
          z-index: 1;
          
        }
        & img{
          position: absolute;
          width:140px;
          height:34px;
          top:0;
          left:-28px;
          z-index: 1;
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
          transform: translateY(3px);
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
      }
      & p{
        color: var(--active-rules);
        font-size: var(--active-smaller);
        text-align:left;
        flex:1;
      }
    }
  }
}
.banner::before{
  content: '';
  display: block;
  height: 750px;
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
}


</style>
