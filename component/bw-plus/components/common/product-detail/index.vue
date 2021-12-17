<template>
        <div class="product-detail">
            <div class="text">
                <p>产品介绍:{{product.description}}</p>
            </div>
            <div class="image-wrapper">
                <img :src="product.image">
            </div>
            <p class="tip">注意事项：</p>
            <ul>
                <li>{{product.notes}}</li>
            </ul>
            <p class="tip">支付须知：</p>
            <ul>
                <li>{{product.deliveryNotice}}</li>
            </ul>
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
    width: 400px;
    padding-bottom: 5px;
    .text{
      width: 400px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-bottom: 4px;
      margin-top: -25%;
        p{
          width: 200%;
          font-size: 20px;
          background-color: #FFF9F3;
          padding: 16px 28px;
          transform-origin: left top;
          transform: scale(0.5) translateY(100%);
     }
    }
    .image-wrapper{
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.13);
      margin-bottom: 10px;
        img{
          // margin-left: 17px;
          width: 100%;
          height:100%;
      }
    }
    .tip{
        padding: 0px 10px;
        font-size: 14px;
        font-weight: 500;
        color: #FF6350;
        text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.13);
        font-family: PingFangSC-Regular, PingFang SC;
        margin: 5px 0;
    }
    ul{
       padding: 0px 14px;
       li{
          font-size: 12px;
          font-weight: 400;
          color: #666666;
          letter-spacing: 1px;
          text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.13);
          font-family: PingFangSC-Regular, PingFang SC;
       }
    }
}

</style>
