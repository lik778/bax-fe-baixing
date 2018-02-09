<template>
  <div :class="{'new-user-intro': true, hide: !visible}">
    <section v-if="step === 1"
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

    <section v-if="step === 2"
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
    }
  },
  data() {
    return {
      step1studentImg: assetHost + 'new-user-intro-1-student.png',
      step1btnImg: assetHost + 'new-user-intro-1-next-btn.png',
      step1infoImg: assetHost + 'new-user-intro-1-info.png',
      step2btnImg: assetHost + 'new-user-intro-2-charge-btn.png',
      step2callImg: assetHost + 'new-user-intro-2-i-call.png',
      step2infoImg: assetHost + 'new-user-intro-2-info.png',
      step: 1
    }
  },
  methods: {
    async close() {
      this.$emit('close')
      await markNotNew()
    },
    charge() {
      this.close()
      this.$router.push({
        name: 'qwt-charge'
      })
    },
    async help() {
      this.close()

      await gStore.toggleAddUserLeadVisible()
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/mixin';

.new-user-intro {
  @mixin center;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(41, 41, 41, 0.7);;
}

.new-user-intro.hide {
  display: none;
}

.step-1, .step-2 {
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
    @mixin center;
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
      @mixin center;
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
