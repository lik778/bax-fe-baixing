<template>
    <div :class="{'welfare-item': true, 'welfare-active': active, [className]: className }">
        <span class="welfare-item_tag">{{tag}}</span>
        <h5 class="welfare-item_title">{{title}}</h5>
        <div class="welfare-item_content">
            <ul>
                <li v-for="(item, index) in content" :key="index">{{item}}</li>
            </ul>
        </div>
        <p class="welfare-item_value">
            <span>价值： {{value}} 元</span>
            <span v-if="desc" class="welfare-item_value-desc">{{desc}}</span>
        </p>
    </div>
</template>

<script>
export default {
  name: 'welfare-activity',
  props: {
    title: {
      type: String,
      default: '',
      require: true
    },
    tag: {
      type: String,
      default: '',
      require: true
    },
    value: {
      type: Number || String,
      default: '',
      require: true
    },
    desc: {
      type: String,
      default: '',
      require: false
    },
    content: {
      type: Array,
      default: () => [],
      require: true
    },
    className: {
      type: String,
      default: '',
      require: false
    },
    active: {
      type: Boolean,
      default: false,
      require: false
    }
  }
}
</script>
<style lang="scss">
    .welfare-item{
        width: 260px;
        height: 172px;
        background-image: linear-gradient(173deg, #FFDFBC 0%, #FFD2A0 0%, #FA7082 100%);
        border-radius: 8px;
        position: relative;
        padding: 12px;
        box-sizing: border-box;
        margin-top: 20px;
        &:not(:last-child){
            margin-right: 30px;
        }
        &_tag{
            width: 150px;
            height: 30px;
            display: block;
            position: absolute;
            background-image: linear-gradient(125deg, #FFC967 0%, #FFF4A0 100%);
            border-radius: 12px 4px 4px 4px;
            right: -8px;
            top: -16px;
            font-size: 12px;
            color: #CD260A;
            text-align: center;
            line-height: 30px;
        }
        &_title{
            font-size: 16px;
            color: #FFFFFF;
            margin-bottom: 10px;
        }
        &_content{
            width: 240px;
            height: 52px;
            background: #FFF7EA;
            border-radius: 4px;
            margin-bottom: 12px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 8px 10px;
            box-sizing: border-box;
            ul{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                li{
                    width: 50%;
                    font-size: 12px;
                    color: #CF4321;
                    list-style: none;
                    height: 17px;
                    line-height: 17px;
                    margin-bottom: 2px;
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                    white-space: nowrap;
                    &::before{
                       content: '';
                       display: inline-block;
                       width: 4px;
                       height: 4px;
                       border-radius: 100%;
                       background: #CF4321;
                       margin-right: 4px;
                    }
                }
            }
        }
        &_value{
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #FFF3A0;
            text-align: center;
            height: 38px;
            span:nth-child(1){
              white-space: nowrap;
            }
            &-desc{
                background: rgba(194,32,50,0.50);
                border-radius: 4px;
                font-size: 12px;
                color: #FFF3A0;
                width: 110px;
                padding: 4px 10px;
                box-sizing: border-box;
                margin-left: 10px;
                flex-shrink: 0;
            }
        }
    }
    .welfare-active{
        border: 1px solid #FF7533;
        background-image: linear-gradient(174deg, #FF9C7E 0%, #F63F5C 100%);
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
