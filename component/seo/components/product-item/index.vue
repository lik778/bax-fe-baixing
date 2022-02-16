<template>
     <el-row class="package-box">
          <el-col :span="12" :class="item.id==0?'basis-box':'basis-box senior-box'" v-for="item in packageInfo" :key="item.id">
            <div class="grid-content bg-purple" @click="chooseClick(item.id)">
              <p class="title">{{item.title}}
                <el-popover
                  placement="right"
                  width="480"
                  trigger="hover">
                  <ProductDetail :packageChoose="packageChoose"></ProductDetail>
                  <img :src="item.src" alt="" slot="reference"  @mouseenter="changePackageChoose(item.id)" />
                </el-popover>
              </p>
              <div class="content-box">
                <p class="price">￥8800</p>
                <p>{{item.desc}}</p>
                <ul>
                  <li v-for="(item1,index) in item.list" :key="index"><p>{{item1.name}}</p><span>{{item1.day}}天</span></li>
                </ul>
                <div class="footer-box">
                  <p><i class="el-icon-circle-check"></i> 一键优化</p>
                  <p><i class="el-icon-circle-check"></i>报表查询</p>
                </div>
                <div class="check-tip" v-if="checkTip==item.id">
                  <i class="el-icon-success"></i>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
</template>
<script>
import { packageInfo } from 'constant/bw-plus'
import ProductDetail from '../../components/product-detail'
export default {
  name: 'product-item',
  props: {
  },
  data () {
    return {
      checkTip: null,
      packageInfo,
      packageChoose: 0
    }
  },
  methods: {
    chooseClick (val) {
      this.checkTip = val
      this.$emit('chooseClick', this.checkTip)
    },
    changePackageChoose (val) {
      this.packageChoose = val
    }
  },
  components: {
    ProductDetail
  }
}
</script>
<style lang="scss">
  .el-popover{
    padding: 0;
    border: none;
  }
</style>
<style lang='scss' scoped>
.el-popover{
    padding: 0;
}

.package-box{
  width: 800px;
  padding: 20px 0;
  .basis-box{
     .grid-content{
      width: 100%;
      height: 100%;
      margin: auto;
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }
  }
}
  .basis-box{
    position: relative;
    height: 287px;
    width: 220px;
    margin-right: 20px;
   .title{
      height: 54px;
      width: 220px;
      background-image: url(../../assets/basic-version.png);
      background-size: contain;
      text-align: center;
      line-height: 54px;
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #FFFFFF;
      letter-spacing: 0;
      position: relative;
      span{
        position: absolute;
        right:15px;
        top: 2px;
        img{
          line-height: 54px;
          width: 18px;
          height: 18px;
        }
      }
   }
   .content-box{
      flex: 1;
      background: #FFF3F1;
      border: 1px solid #FFD6D0;
      border-radius:0 0 8px 8px;
     p{
       text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
     }
     .price{
       text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 26px;
        color: #FF6350;
        letter-spacing: 0;
        line-height: 37px;
        margin: 20px 0 15px 0;
     }
     ul{
      margin: 10px;
      padding: 10px;
      background-color: #FFE0DB;
      border-radius: 4px;
      font-family: PingFangSC-Medium;
      letter-spacing: 0;
      li:not(:first-child){
        padding-top: 8px;
      }
      li{
        font-size: 12px;
        font-family: PingFangSC-Medium;
        letter-spacing: 0;
        display: flex;
        flex-direction: row;
        color: #FF6350;
        span{
          width: 47px;
          text-align: end;
        }
        p{
          flex: 1;
          text-align: start;
          color: #FF6350;
        }
      }
     }
     .footer-box{
        display: flex;
         flex-direction: row;
         justify-content: space-between;
         padding: 0px 20px;
         margin-top:10px;
         p{
           color:#FF6350;
         }
     }
     .check-tip{
       position: absolute;
       right: -10px;
       bottom: -10px;
      .el-icon-success{
        font-size: 22px;
        color: #FF6350;
        background-color: #fff;
      }
    }
  }
}
.senior-box{
  .title{
     background-image: url(../../assets/premium.png);
     color: #FDD46E;
  }
  .content-box{
   background: #FFFCF2;
   border: 1px solid #FFEBCC;
   .price{
     color: #D5912B;
   }
   ul{
     background-color: #FFF4D1;
     li{
       color: #AB792E;
       p{
         color: #AB792E;
       }
     }
   }
    .footer-box{
         p{
           color:#AB792E;
         }
     }
  }
}
  .check-tip{
    .el-icon-circle-check{
      font-size: 22px;
    }
  }
</style>
