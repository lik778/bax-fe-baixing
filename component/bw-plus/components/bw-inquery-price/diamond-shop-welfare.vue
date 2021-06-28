<template>
    <div :class="{'shop-container': true, 'active': active}">
        <h4>钻石店铺</h4>
        <p>支持首页宝推广，让您的网站上百度首页<br>支持SEO优化等更多专业版官网建站功能</p>
        <footer>
            1200元一年
        </footer>
    </div>
</template>

<script>
export default {
  name: 'DiamondShopWelfare',
  data () {
    return {
      active: false
    }
  },
  watch: {
    current: {
      handler (newV, oldV) {
        if (newV) {
          this.active = newV.duration > 30
        }
      },
      deep: true,
      immediate: true
    }
  },
  props: {
    current: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  methods: {
    handleClick () {
      this.active = true
    }
  }
}
</script>

<style lang="scss" scoped>
    .shop-container{
        width: 260px;
        border: 1px solid #ccc;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.1s;
        position: relative;
        h4{
            font-size: 14px;
            text-align: center;
            color: #333333;
            padding: 10px 0;
            border-bottom: 1px dashed #FF7533;
            margin-bottom: 14px;
        }
        p{
            font-size: 12px;
            line-height: 22px;
            text-align: center;
            color: #666666;
            margin-bottom: 14px;
        }
        footer{
           font-size: 16px;
           color: #FF6350;
           text-align: center;
           padding: 10px 0;
           border-radius: 4px;
           background: #FFF2EC;
        }
    }
    .active{
        border: 1px solid #FF7533;
        &::after {
            content: '';
            position: absolute;
            bottom: 0px;
            margin-bottom: -8px;
            right: -8px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: #ff755a;
            background-image: url("data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E %3Cdefs%3E %3Ccircle id='path-1' cx='9' cy='9' r='9'%3E%3C/circle%3E %3C/defs%3E %3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E %3Cg transform='translate(-840.200000, -440.200000)'%3E %3Cg transform='translate(231.000000, 351.000000)'%3E %3Cg transform='translate(383.000000, 0.000000)'%3E %3Cg transform='translate(229.000000, 92.000000)'%3E %3Cmask id='mask-2' fill='white'%3E %3Cuse xlink:href='%23path-1'%3E%3C/use%3E %3C/mask%3E %3Ccircle stroke='%23FFFFFF' stroke-width='3' cx='9' cy='9' r='10.9'%3E%3C/circle%3E %3Cpath d='M15.1825897,5.10610289 L15.270383,5.1771462 C15.5176407,5.41592024 15.5221862,5.81234159 15.2920079,6.05069827 L8.21929829,13.3747035 C7.98398364,13.6183789 7.59450525,13.624017 7.34552366,13.3835782 L7.31018198,13.345721 C7.30170601,13.3382661 7.29337514,13.330564 7.28519888,13.3226146 L3.20243916,9.35312536 C2.96168676,9.1190523 2.93454279,8.75228384 3.12705783,8.48573457 L3.161,8.445 L3.20137729,8.41142585 C3.46762902,8.21926922 3.84204075,8.23905634 4.08261162,8.4729529 L7.765,12.053 L14.3966083,5.18602099 C14.6057769,4.9694206 14.9367539,4.94089912 15.1825897,5.10610289 Z' fill='%23FFFFFF' mask='url(%23mask-2)'%3E%3C/path%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/svg%3E");
            background-repeat: no-repeat;
            background-size: 24px;
        }
    }
</style>
