<template>
        <div class="product-detail">
            <div class="text">
                <p>产品介绍:{{product.description}}</p>
            </div>
            <div class="image-wrapper">
                <img :src="product.image">
            </div>
              <p class="tip">注意事项：</p>
              <div class="tip-text">
                    <div>{{product.notes}}</div>
              </div>
              <p class="tip">支付须知：</p>
              <div class="tip-text">
                    <div>{{product.deliveryNotice}}</div>
              </div>
        </div>
</template>
<script>
export default {
  name: 'product-detail',
  props: {
    product: {
      type: Object,
      default: () => {},
      require: true
    }
  }
}
</script>
<style lang="scss" scoped>
.product-detail{
    background-color: #FFFFFF;
    width: 587px;
    padding-bottom: 10px;
    .text{
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-bottom: 9px;
      box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.04);
        p{
          font-size: 12px;
          background-color: #FFF9F3;
          padding:8px 14px;
     }
    }
      .tip{
      padding: 0 14px;
      font-size: 12px;
      font-weight: 500;
      color: #FF6350;
      text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.13);
      font-family: PingFangSC-Regular, PingFang SC;
      margin: 10px 0 6px 0;
    }
    .tip-text{
      padding: 0px 14px;
      div{
        line-height: 24px;
        font-size: 12px;
        white-space: pre-wrap;
        font-weight: 400;
        color: #666666;
        text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.13);
        font-family: PingFangSC-Regular, PingFang SC;
       }
      }
    }
    .image-wrapper{
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.13);
      margin-bottom: 10px;
      padding: 0 13px;
        img{
          width: 100%;
          height:100%;
      }
    }

</style>
