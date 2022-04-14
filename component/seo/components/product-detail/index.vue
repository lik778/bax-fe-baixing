<template>
    <div :class="packageChoose==1?'product-detail':'product-detail basis-style'">
      <div class="title">
          {{PACKAGE_INTRODUCE[packageChoose].title}}
      </div>
      <div class="content-box">
        <ul  class="text">
          <li v-for="(item,index) in PACKAGE_INTRODUCE[packageChoose].list" :key="index">
            <div class="small-title">
              <p>{{item.name}}</p><p>{{item.desc}}</p>
            </div>
            <div class="image-wrapper">
              <img :src="item.src" alt="">
            </div>
          </li>
        </ul>
        <p class="tip">注意事项：</p>
        <ul class="tip-text">
            <li v-for="(item,index) in PACKAGE_INTRODUCE[packageChoose].tipList" :key="index">{{item}}</li>
        </ul>
        <p class="tip">支付须知：</p>
        <div class="tip-text">
          {{PACKAGE_INTRODUCE[packageChoose].payText}}
        </div>
      </div>
    </div>
</template>
<script>
import { PACKAGE_INTRODUCE } from 'constant/bw-plus'
export default {
  name: 'product-detail',
  props: {
    packageChoose: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      PACKAGE_INTRODUCE
    }
  }
}
</script>
<style lang="scss" scoped>

.product-detail{
    .title{
      background-color: #1C1C1C;
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #FDD46E;
      letter-spacing: 0;
      text-align: center;
      height: 48px;
      line-height: 48px;
      margin-bottom: 5px;
    }
    .content-box{
      padding: 0 12px 15px;
      .tip{
        margin: 15px 0 5px 0;
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #AB792E;
        letter-spacing: 0;
      }
      .tip-text{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
      }
      .text{
        li{
          margin-top: 10px;
          background: #FFFFFF;
          border: 1px solid #F7DBB0;
          border-radius: 8px;
          .small-title{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            background-color: #FFF7DF;
            border-radius: 8px 8px 0 0;
            font-family: PingFangSC-Medium;
            font-size: 12px;
            color: #333333;
            letter-spacing: 0;
            border-bottom: 1px solid #F7DBB0;
            :first-child{
                text-align: center;
                padding: 12px 0;
                width: 90px;
                height: 100%;
                background: #FFE7A2;
                border-radius: 8px 0 0 0;
            }
            :nth-child(2){
              flex: 1;
              text-align: center;
            }
          }
        }
      }
    }
}
.basis-style{
  .title{
    background-color: #FF6350;
    color: #FFFFFF;
  }
  .content-box{
    .tip{
      color: #FF6350;
    }
    .text{
      li{
        border: 1px solid #FFD6D0;
        .small-title{
          background-color: #FFF3F1;
          border-bottom: 1px solid #FFD6D0;
          color: #FF6350;
          :first-child{
              background: #FFE0DB;
          }
        }
      }
    }
  }
}
 .image-wrapper{
    margin:10px 12px;
      img{
        width: 100%;
        height:100%;
  }
}
</style>
