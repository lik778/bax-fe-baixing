<template>
        <div class="product-detail">
            <p class="text">产品介绍：1. 主打产品关键词抢占头条搜索首页排名  2. 只有手机端；展现形式为头
            条搜索首页广告位+落地页广告  3. 可单独购买，也可搭售其他任意产品一同购买搭
            售百度标王标准版有6折左右优惠
            </p>
            <div class="image-wrapper">
                <img src="">
            </div>
            <p class="tip">注意事项：</p>
            <ul>
                <li>1.请在购买本产品时先选择你需要购买的平台、时段及时长。</li>
                <li>2.展现率根据头条搜索规则最大化展现，请勿过度承诺客户，如有问题，可直接与客服沟通。</li>
                <li>3.如遇到后台检测不能做的关键词，引导更换关键词或者替换同等价值的其他服务。</li>
            </ul>
            <p class="tip">注意事项：</p>
            <ul>
                <li>1.请在购买本产品时先选择你需要购买的平台、时段及时长。</li>
                <li>2.展现率根据头条搜索规则最大化展现，请勿过度承诺客户，如有问题，可直接与客服沟通。</li>
                <li>3. 如遇到后台检测不能做的关键词，引导更换关键词或者替换同等价值的其他服务。</li>
            </ul>
        </div>
</template>
<script>
export default {
  name: 'product-detail'
}
</script>
<style lang="scss" scoped>
.product-detail{
    border: 1px solid black;
    .text{
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    //   line-height: 5px;
    border: 1px solid red;
    }
    .image-wrapper{
        border: 1px solid blue;
        background: #FFFFFF;
        height: 89px;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.13);
        img{
            width: 100%;
            height: 100%;
        }
    }
    .tip{
        font-size: 14px;
        font-weight: 500;
        color: #FF6350;
        text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.13);
    }
    ul>li{
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.13);
    }
}

</style>
