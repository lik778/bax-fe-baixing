
<template>
  <div class="alert"
    :style="{display: closed ? 'none' : ''}">
    <header>
      <span>11月25日-11月30日期间限时促销！</span>
      <span style="cursor: pointer"
        @click="close">
        关闭
      </span>
    </header>
    <content>
      <li>累计充值满<strong>800元</strong>，赠送<strong>50元</strong>现金券；</li>
      <li>累计充值满<strong>1500元</strong>，赠送<strong>120元</strong>现金券；</li>
      <li>累计充值满<strong>3000元</strong>，赠送<strong>288元</strong>现金券；</li>
      <li>累计充值满<strong>6000元</strong>，赠送<strong>600元</strong>现金券；</li>
      <li>累计充值满<strong>12000元</strong>，赠送<strong>1300元</strong>现金券；</li>
      <li>累计充值满<strong>30000元</strong>，赠送<strong>3600元</strong>现金券；</li>
      <p>现金券于12月1日下午2点发放至您的广告后台，有效期15天！</p>
    </content>
    <p class="circle2"></p>
  </div>
</template>

<script>
export default {
  name: 'qwt-charge-promotion-alert',
  data() {
    return {
      closed: false
    }
  },
  methods: {
    close() {
      this.closed = true
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/var';

@keyframes rock {
  0% {
    transform: rotate(-2deg);
  }

  25% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(2deg);
  }

  75% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-2deg);
  }
}

.alert {
  position: fixed;
  z-index: 120;
  right: 20px;
  top: 105px;
  width: 290px;
  height: 210px;

  border: solid 1px var(--c-main-blue);
  border-radius: 4px;

  animation: rock 0.6s infinite alternate;

  & > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    padding: 0 10px;
    font-size: 14px;
    color: white;
    background: var(--c-main-blue);
  }

  & > content {
    display: flex;
    flex-flow: column;
    padding: 5px;

    & > li {
      font-size: 14px;

      & > strong {
        color: #ff944d;
      }
    }

    & > p {
      width: 240px;
      font-size: 15px;
    }
  }
}
</style>
