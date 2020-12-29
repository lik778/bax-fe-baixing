<template>
  <div :class="{'new-user-intro': true, hide: !visible}">
    <section
      v-if="mode === 'shenma'"
      class="shenma">
      <i>
        <p @click="close()">
          ✕
        </p>
      </i>
      <header>
        <h3>新媒体渠道已上线</h3>
        <h5>— 神马移动搜索</h5>
      </header>
      <p>
        第二大<strong>移动搜索流量</strong>入口强势来袭！
        把您的<strong>百姓网信息</strong>推广到
        <strong>神马移动搜索平台</strong>上，
        覆盖海量移动端流量，订单电话滚滚来！
      </p>
      <div>
        <img :src="shenmaBxImg" />
        <img :src="shenmaArrowImg" />
        <img :src="shenmaLogoImg" />
      </div>
      <section>
        <p>您的推广页面</p>
        <p>神马移动搜索平台</p>
      </section>
      <img
        :src="shenmaBtnImg"
        @click="createPromotion"
      />
    </section>
    <section
      v-else-if="step === 1"
      class="step-1">
      <main>
        <div>
          <img :src="step1studentImg" />
          <span>
            <h2>什么是站外推广？</h2>
            <content>
              将您的<label>百姓网推广页面</label>直接展示在<label>百度、360、搜狗</label>等搜索平台上，
              让有需求的客户通过电脑、手机找到您，获取更多展示和潜在商机。
            </content>
          </span>
        </div>
        <img class="info" :src="step1infoImg" />
        <img class="btn" :src="step1btnImg"
          @click="step = 2" />
      </main>
      <footer>
        <p class="dot checked" @click="step = 1"></p>
        <p class="dot" @click="step = 2"></p>
      </footer>
    </section>

    <section
      v-else-if="step === 2"
      class="step-2">
      <header>
        <i @click="close()">✕</i>
      </header>
      <main>
        <h3>你只需以下操作即可完成推广</h3>
        <img class="info" :src="step2infoImg" />
        <img @click="charge" class="btn" :src="step2btnImg" />
        <div @click="help">
          <img :src="step2callImg" />
          <strong>我想了解更多，请顾问联系我</strong>
          <i>&gt;</i>
        </div>
      </main>
      <footer>
        <p class="dot" @click="step = 1"></p>
        <p class="dot checked" @click="step = 2"></p>
      </footer>
    </section>
  </div>
</template>

<script>
import gStore from '../store'

import {
  markNotNew
} from 'api/account'

import {
  assetHost
} from 'config'

export default {
  name: 'qwt-new-user-intro',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      required: false,
      validator (v) {
        return ['', 'shenma'].includes(v)
      }
    }
  },
  data () {
    return {
      step1studentImg: assetHost + 'new-user-intro-1-student.png',
      step1btnImg: assetHost + 'new-user-intro-1-next-btn.png',
      step1infoImg: assetHost + 'new-user-intro-1-info.png',
      step2btnImg: assetHost + 'new-user-intro-2-charge-btn.png',
      step2callImg: assetHost + 'new-user-intro-2-i-call.png',
      step2infoImg: assetHost + 'new-user-intro-2-info.png',
      shenmaArrowImg: assetHost + 'shenma-intro-arrow.png',
      shenmaLogoImg: assetHost + 'shenma-intro-logo.png',
      shenmaBtnImg: assetHost + 'shenma-intro-btn.png',
      shenmaBxImg: assetHost + 'shenma-intro-bx.png',
      step: 1
    }
  },
  methods: {
    async close () {
      this.$emit('close')
      await markNotNew()
    },
    createPromotion () {
      this.close()
      this.$router.push({
        name: 'qwt-create-promotion'
      })
    },
    charge () {
      this.close()
      this.$router.push({
        name: 'qwt-charge'
      })
    },
    async help () {
      this.close()

      await gStore.toggleAddUserLeadVisible()
    }
  }
}
</script>

<style lang="scss" scoped>
.new-user-intro {
  @include center;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(41, 41, 41, 0.7);
}

.new-user-intro.hide {
  display: none;
}

.shenma {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 630px;
  height: 550px;
  padding-left: 10px;
  background: url("//file.baixing.net/bax-fe/asset/shenma-intro-bg.png")
    no-repeat;

  & > i {
    position: relative;
    width: 0;
    height: 0;
    right: -280px;
    top: 65px;

    & > p {
      font-size: 12px;
      color: white;
      cursor: pointer;
    }
  }

  & > header {
    display: flex;
    align-items: center;
    flex-flow: column;
    margin-top: 74px;

    & > h3 {
      width: 290px;
      font-size: 32px;
      letter-spacing: 4px;
      line-height: 45px;
      color: white;
    }

    & > h5 {
      width: 120px;
      margin-top: 8px;
      margin-left: 150px;
      font-size: 16px;
      line-height: 22px;
      color: white;
    }
  }

  & > p {
    margin-top: 57px;
    width: 530px;
    font-size: 16px;
    letter-spacing: 1.8px;
    line-height: 33px;
    color: #666666;

    & > strong {
      font-size: 18px;
      color: #151515;
    }
  }

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 18px;

    & > img:nth-child(2) {
      margin: 0 45px 0 27px;
    }
  }

  & > section {
    display: flex;
    justify-content: space-between;
    margin-top: 11px;
    width: 447px;
    font-size: 12px;
    letter-spacing: 0.75px;
    line-height: 17px;

    & > p:first-child {
      margin-left: 65px;
      color: #329ccc;
    }

    & > p:last-child {
      margin-right: 21px;
      color: #d18413;
    }
  }

  & > img {
    margin-top: 22px;
    cursor: pointer;
  }
}

.step-1,
.step-2 {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 758px;
  height: 495px;
  border-radius: 10px;
  background: white;

  & > main {
    display: flex;
    flex-flow: column;
    align-items: center;
    flex-grow: 1;
  }

  & > footer {
    @include center;
    width: 791px;
    height: 33px;
    border-radius: 16px;
    background: #434a54;

    & .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
    }

    & .dot:last-child {
      margin-left: 10px;
    }

    & .dot.checked {
      background: #fcb057;
    }
  }
}

.step-1 {
  & > main {
    padding-top: 47px;

    & > div {
      display: flex;

      & > span {
        width: 480px;
        margin-left: 21px;

        & > h2 {
          font-size: 22px;
          font-weight: 600;
          color: #666666;
        }

        & > content {
          margin-top: 12px;
          line-height: 1.75;
          color: #666666;

          & > label {
            font-weight: 600;
            color: #fcb057;
          }
        }
      }
    }

    & > .btn {
      margin-top: 23px;
      cursor: pointer;
    }
  }
}

.step-2 {
  & > header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 15px;
    padding-right: 40px;
    width: 100%;
    font-size: 14px;
    color: #666666;

    & > i {
      cursor: pointer;
    }
  }

  & > main {
    & > h3 {
      font-size: 18px;
      color: #666666;
    }

    & > .info {
      margin-top: 16px;
    }

    & > .btn {
      margin-top: 49px;
      cursor: pointer;
    }

    & > div {
      @include center;
      margin-top: 26px;
      font-size: 14px;
      color: #fcb057;
      cursor: pointer;

      & > strong {
        margin: 0 5px 0 14px;
        font-weight: normal;
      }
    }
  }
}
</style>
