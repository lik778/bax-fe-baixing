<template>
    <div v-if="active" :class="{'welfare-active': true, [className]: className }">
        <span class="welfare-active_tag">赠送{{detail}}</span>
        <div class="welfare-active_wrapper">
            <h3 class="welfare-active_title">{{item.title}}</h3>
            <span v-if="item.desc" class="welfare-active_desc">{{item.desc}}</span>
        </div>
        <span class="welfare-active_tips">{{active ? '已解锁' : '未解锁'}}</span>
    </div>
    <div v-else class="welfare-default">
        <h3 class="welfare-default_title">{{item.title}}</h3>
        <p class="welfare-default_desc">{{tag}}</p>
    </div>
</template>

<script>
export default {
  name: 'welfare-activity',
  props: {
    item: {
      type: Object,
      default: () => {},
      require: true
    },
    currentPrice: {
      type: Object,
      default: () => {},
      require: true
    },
    className: {
      type: String,
      default: '',
      require: false
    }
  },
  computed: {
    detail () {
      const { item, currentPrice } = this
      return item.isActive(currentPrice.duration, currentPrice.price).detail
    },
    tag () {
      const { item, currentPrice } = this
      return item.isActive(currentPrice.duration, currentPrice.price).tag
    },
    active () {
      const { item, currentPrice } = this
      return item.isActive(currentPrice.duration, currentPrice.price).active
    }
  }
}
</script>
<style lang="scss">
    .welfare-default{
        width: 222px;
        height: 66px;
        background: linear-gradient(180deg, #FFCF9F 0%, #FA7484 100%);
        border-radius: 5px;
        padding: 8px 12px;
        margin-top: 16px;
        &:not(:last-child){
            margin-right: 30px;
        }
        &_title{
            font-size: 13px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
        }
        &_desc{
            font-size: 20px;
            transform-origin: left;
            transform: scale(.5);
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            white-space: nowrap;
        }
    }
    .welfare-active{
        width: 222px;
        height: 66px;
        background: url(../../../../asset/welfare-bg.png) no-repeat center/contain;
        border-radius: 8px;
        position: relative;
        box-sizing: border-box;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:not(:last-child){
            margin-right: 30px;
        }
        &_wrapper{
            width: 158px;
            padding-left: 14px;
            box-sizing: border-box;
        }
        &_desc{
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FF6E51;
            white-space: nowrap;
        }
        &_tag{
            display: block;
            position: absolute;
            border-radius: 4px;
            background-image: linear-gradient(to right, #FED8BA , #FFF1E0, #FFF7EA, #FFF3E4, #FFD4B0);
            border-top-right-radius: 16px;
            right: -8px;
            top: -16px;
            font-size: 12px;
            color: #CD260A;
            text-align: center;
            padding: 6px;
            box-sizing: border-box;
        }
        &_title{
            font-size: 15px;
            color: #CE4321;
            font-weight: bold;
        }
        &_tips{
            font-size: 14px;
            color: #FFFFFF;
            margin-right: 10px;
            white-space: nowrap;
        }
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
