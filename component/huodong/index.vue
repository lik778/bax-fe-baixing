<template>
  <div>
      <div class='huodong-container'>
        <div class="banner"></div>
        <div class='content'>
          <div class='p-bg p-bg1'>
            <p>惊喜1：凤鸣满送+线索独享权益</p>
          </div>
          <div class='active part1 bg'>
              <p class='tit'>购买凤鸣产品送无门槛凤鸣资金，多买多送</p>
              <div class='f-flex' style="padding:0 33px;">
                  <div v-for="(item,index) in partOneList.slice(0, 3)" :key="index">
                    <img :src="item" alt="" class='partOneImg'/>
                  </div>
              </div>
              <p class='tit'>购买凤鸣产品（站外推广）5088及以上，赠送百度拨打按钮</p>
              <div class="bottom">
                <div v-for="(item, index) in partOneList.slice(3)" :key="index">
                  <img :src="item" alt="" width="100%" height="100%"/>
                </div>
                <div class="last">
                  <h5>3种样式随机展示</h5>
                  <h6>更多规则详情，请咨询专属销售</h6> 
                </div>
              </div>
          </div>
          <button class='btn' @click="goTo('http://bax.baixing.com.cn/main/qwt/charge')">点此立即购买</button>
        </div>
        <div class='content'>
          <div class='p-bg p-bg2'>
            <p>惊喜2：标王尖叫爆卖</p>
          </div>
          <div class='active part2 bg'>
              <p class='ps bolder'>（注：标王惊喜/狂欢套餐：仅限30天关键词参加，不限关键词价格，每个客户仅限购买一次；</p>
              <p class='ps bolder'>标王大单折扣：30天、90天的关键词都可参加）</p>
              <div class='f-flex' style='margin-top: 24px;'>
                <img v-for="(item, index) in partTwoList" :key="index" :src="item" width="252" height="250">
              </div>
          </div>
          <button class='btn' @click="goTo('http://bax.baixing.com.cn/main/bw/query-price')">点此立即购买</button>
        </div>
        <div class='content'>
          <div class='p-bg p-bg3'>
            <p>惊喜3：专业版官网买一年送三个月</p>
          </div>
          <div class='active part3 bg'>
              <p class='tit'>专业版官网买一年送三个月，另搭配凤鸣/标王购买，官网大额减！</p>
              <p class="color font-smaller bold"><span class="share">推荐套餐</span></p>
              <div class="f-flex wrap">
                <div v-for="(item,index) in partThreeList" :key="index">
                  <img :src="item" width="252" height="210">
                </div>
              </div>
          </div>
          <button class='btn' @click="goTo('http://bax.baixing.com.cn/main/qwt/charge?select_gw=true')">点此立即购买</button>
        </div>
        <div class='content'>
          <div class='p-bg p-bg4'>
            <p>惊喜4：全民抽奖</p>
          </div>
          <div class='active part4 bg'>
              <div>
                <div class='row'>
                  <span>活动时间：</span><h6>12月6日 00:00-12月13日 23:59</h6>
                </div>
                <div class='row'>
                  <span>活动内容：</span>
                  <h6>
                    活动内容：百姓网全站所有用户通过购买<strong style="color:#c563b9;">搜索通产品</strong>，新开/续费/升级VIP套餐、
                    充值VIP一卡通、充值普通一卡通、购买城市包这5种方式消费，每1元=1积分，
                    每500积分可兑换1次抽奖机会！
                  </h6>
                </div>
                <div class='row'>
                  <span>兑奖时间：</span>
                  <h6>12月6日 00:00-12月13日 23:59</h6>
                </div>
                 <p class='contact'>注：前往百姓网主会场，如有问题，请拨打客服热线咨询：400-036-3650</p>
                 <img src="//file.baixing.net/201909/8f1b362f3c49bf911643eb5ff2eac313.png" alt="">
              </div>
          </div>
          <button class='btn' :class="{disabled: lotteryBtnDisabled}" @click="() => !lotteryBtnDisabled && goTo('http://shanghai.baixing.com/rev/lottery?activity=lottery_activity20191212')">前往参与</button>
        </div>
        <div class='content' style="padding-bottom:40px">
          <div class='p-bg p-bg5'>
            <p>惊喜5：大单送实物</p>
          </div>
          <div class='active part5 bg'>
              <p class='tit'>12月6日 00:00-12月13日 23:59期间，购买搜索通产品</p>
              <p class='ps bolder'>（请前往【个人中心】-【我的站内通知】查看，如有问题请拨打客服热线咨询：400-036-3650）</p>
              <div class='f-flex p-20'>
                <img v-for="(item, index) in partFiveList" width="406" height="170" :key="index" :src="item">
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
                  <p>活动时间：<strong class="color">12月5日 00：00-12日13日 23：59</strong></p>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>2</p></div>
                  <p>凤鸣满送资金会直接进入个人账户，无需兑换，多买多送。</p>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>3</p></div>
                  <div>
                      购买凤鸣产品（站外推广）5088及以上，赠送百度拨打按钮。规则详情:
                    <ul>
                      <li>点击此拨打按钮，和点击广告逻辑相同，按CPC收费</li>
                      <li>仅限百度侧，且3种样式随机展示，不可限制某一种； 提交的客户一定会添加，但展示结果以最终百度展示为主</li>
                      <li>一个用户，最多可添加3条计划的电话线索</li>
                      <li>如果凤鸣计划下线后，拨号功能也跟随下线，再次上线时没有该功能，且不再添加</li>
                      <li>部分类目不开放拨打按钮，详情请咨询专属销售或客服</li>
                    </ul>
                  </div>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>4</p></div>
                  <p>官网买一年送三个月活动：不限制用户和单数，一个用户可以在活动期间多次购买，均享受优惠。</p>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>5</p></div>
                  <p>
                    关于标王惊喜，狂欢套餐，将符合条件的关键词加入关键词购物车并点击“去支付”，进入标王支付页面即可看到活动最终支付的价格。以上所有
                    活动客户都可以参加，但只能单独购买，无法在同一个订单内同时参加所有活动，例：用户先充值1500元参加“活动一”；如果客户还想参加“活动二”需要重新购买3000元的关键词，并单独提单。
                  </p>
              </div>
              <div class="row">
                  <div class='yuan'><p class='num'>5</p></div>
                  <p>购买前请阅读违禁行业类目；对于违禁行业，不能进行搜索通推广，如购买后不支持退款；
                  违禁行业类目见：
                  <strong ><a class="color" href="http://bax.baixing.com.cn/qa?mode=questions">http://bax.baixing.com.cn/qa?mode=questions</a></strong></p>
              </div>
              <!-- <div class="row">
                  <div class='yuan'><p class='num'>6</p></div>
                  <p>解释权归百姓网所有，如有疑问请致电客服<strong class="color">400-036-3650</strong></p>
              </div>                                                                                     -->
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
        '//file.baixing.net/201911/a588419819bda155c27160aac413adf4.png',
        '//file.baixing.net/201911/fd741f379a2c92152ec86ea366c27a28.png',
        '//file.baixing.net/201911/45606a03d87e74ea8431e27bccc3515d.png',

        '//file.baixing.net/201911/401c47f87d5ae5fc8d94370d12d73cae.png',
        '//file.baixing.net/201911/4c19b330d713530ba8998b79ab71f98d.png',
        '//file.baixing.net/201911/0850c9212ee4c0ebd41d1f7aec6d2a48.png'
      ],
      partTwoList:[
        '//file.baixing.net/201911/ff9f506e4a7d7fd2cb762697cfe33dd8.png',
        '//file.baixing.net/201911/049f1904ead10811c416364b718fb147.png',
        '//file.baixing.net/201911/364621d17bc510d675424f875d73c05d.png',
      ],
      partThreeList:[
        '//file.baixing.net/201911/ab18d2eb34bc8378cbeb8ce01facb0a9.png',
        '//file.baixing.net/201911/d924c46d84f646ca1c72050798de011b.png',
        '//file.baixing.net/201911/72e18507d8ff4924db1b583885adbd25.png'
      ],
      partFiveList: [
        '//file.baixing.net/201911/a3719bdc8aea3f731b3752226142e15f.png',
        '//file.baixing.net/201911/e5c6f272a83e1c14859a314597bee9d6.png'
      ]
    }
  },
  async created() {
    const date = new Date()
    if (
      date.getMonth() === 11 &&
      date.getDate() >= 6 &&
      date.getDate() <= 13
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
  background-color: #C2123C;
  & .banner {
    padding: 18% 50%;
    background: url('//file.baixing.net/201911/0d991f0c86983732f6ddae70d116347e.png') top -18px center no-repeat;
    background-size: contain;
  }
  & .content{
    padding-bottom: 100px;
    box-sizing: border-box;
     & .bolder{
       font-weight: 600;
    }
    & .p-bg{
      background-image: linear-gradient(180deg, #FFC279 0%, rgba(229,186,127,0.00) 100%);
      border-radius: 40px;
      display:block;
      width:600px;
      height:80px;
      line-height: 80px;
      margin:0 auto;
      font-size: 32px;
      letter-spacing: 2px;
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
          width: 220px;
          height: 140px;
        }
      }
    }
    & .part1{
      height: 630px;
      & .bottom {
        margin-top: -30px;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        & > div {
          margin-top: 20px;
          width: 376px;
        }
      }
      & .last {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        color: rgba(141, 102, 42, .7);
        font-size: 20px;
        & h5 {
          font-size: 30px;
        }
      }
    }
    & .part2{
      height: 350px;
      padding-top: 34px;
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
        width: 276px;
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
      background: #A50027;
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
      & > div {
        color: var(--active-rules);
        font-size: var(--font-smaller);
        text-align:left;
        & li {
          text-indent: 1.5em;
        }
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
  width: 280px;
  height: 64px;
  margin:0 auto;
  display: block;
  border-radius: 10px;
  cursor: pointer;
  &.disabled {
    cursor: not-allowed;
    color: #666;
    background-color: rgba(244, 244, 244, .8);
  }
}
</style>
