<template>
  <div class="card" :class="{active}">
    <div class="flag">
      <img :src="flag" alt="">
    </div>
    <div class="title">{{title}}</div>
    <div class="content">
      <slot />
    </div>
    <div class="footer">
      <span class="price">￥{{centToYuan(price)}}</span><span class="original-price">原价{{centToYuan(originalPrice)}}</span>
    </div>
    <p class="icon" v-if="active" >
      <bx-icon type="check"></bx-icon>
    </p>
  </div>
</template>

<script>
  import BxIcon from 'com/widget/icon'
  import { centToYuan } from 'utils'

  export default {
    name: 'card',
    props: {
      title: String,
      price: Number,
      originalPrice: Number,
      flag: String,
      active: Boolean
    },
    components: {
      BxIcon
    },
    methods: {
      centToYuan
    }
  }
</script>

<style scoped lang="postcss">
.card {
  border-radius: 8px;
  color: #fff;
  background-color: transparent;
  position: relative;
  border: 2px solid transparent;
  cursor: pointer;
  min-height: 230px;

  & > .flag {
    position: absolute;
    top: 0;
    right: 20px;
    & > .flag-text {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      text-align: center;
      height: 35px;
      color: #BF0076;
      width: 50px;
      background-color: #FFD500;
    }
    & > .flag-corner {
      border-left: 25px solid #FFD500;
      border-bottom: 10px solid transparent;
      border-right: 25px solid #FFD500;
    }
  }
  & > .title {
    background-color: #C7007B;
    color: #FFC1E7;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    text-align: center;
  }
  & > .content {
    padding: 30px 15px;
    font-size: 16px;
    background-color: #9B0060;
  }

  & > .footer {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #C5007A;
    background-color: #9B0060;

    & > .price {
      font-size: 28px;
      margin-right: 10px;
    }
    & > .original-price {
      text-decoration: line-through;
      color: #F70098;
    }
  }
}
.card.active {
  color: #FFD500;
  border: 2px solid #FFD500;
  & > .title {
    color: #FFD500;
  }

  & > p {
    position: absolute;
    height: 0;
    width: 0;
    left: 20px;
    top: 0px;
  }

  & i.icon-check {
    font-size: 20px;
    font-weight: 600;
    border-radius: 50%;
    background: #FFD500;
    color: #9B0060;
  }
}
</style>
