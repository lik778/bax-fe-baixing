<template>
  <div :class="{'gw-pro-widget': true, checked}" @click="onClick">
    <div class="hot-flag" v-if="isHot">
      <!-- <section>
        <main>热卖</main>
        <footer>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
            class="svg-triangle">
            <polygon points="0,0 44,0 22,12" />
          </svg>
        </footer>
      </section> -->
      <img src="//file.baixing.net/202006/40c77497696c9b2cf6b50361ac0c1cde.png" width="40" alt="爆款">
    </div>
    <header>{{ title }}</header>
    <ul :class="{'desc-container': true, 'desc-pro-container': isPro}">
      <li :class="{'desc-no-pro': !isPro}" v-for="(item, index) in descArrInfo"
        :key="index">{{item}}
      </li>
    </ul>
    <footer>
      <span>{{price}}元</span>
    </footer>
    <p>
      <bx-icon v-if="checked" type="check" />
    </p>
  </div>
</template>

<script>
import BxIcon from 'com/widget/icon'

export default {
  name: 'gw-pro-widget',
  components: {
    BxIcon
  },
  props: {
    checked:{
      type: Boolean,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    isHot: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    descArrInfo () {
      const arr = this.desc.split(' ')
      return arr
    },
    isPro () {
      return this.descArrInfo.length === 2 ?  true: false
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="postcss" scoped>
@import '../../cssbase/mixin';
@import '../../cssbase/var';
@import 'cssbase/mixin';

.gw-pro-widget {
  position: relative;
  display: inline-flex;
  flex-flow: column;
  width: 260px;
  height: 134px;
  border-radius: 4px;
  border: solid 1px #ccc;
  cursor: pointer;
  margin-right: 20px;
  & > .hot-flag {
    position: relative;
    width: 0;
    height: 0;
    top: 0px;
    left: 216px;

    & > section {
      width: 44px;
      height: 50px;

      & > main {
        @mixin center;
        height: 20px;
        background: #ff3c3c;
        font-size: 12px;
        color: white;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
      }

      & > footer {
        display: flex;
        background: transparent;
        height: 12px;

        & .svg-triangle polygon {
          fill: #ff3c3c;
        }
      }
    }
  }
  & > header {
    @mixin center;
    height: 42px;
    color: #333333;
    font-weight: 500;
    border-bottom: dotted 1px #ccc;
    font-size: 14px;
  }
  & > .desc-container {
    font-size: 12px;
    color: #666666;
    line-height: 2;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 5px 12px;
    &.desc-pro-container {
      flex-direction: column;
      padding: 5px 15px;
    }
    & > .desc-no-pro {
      width: 50%;
      list-style: inside;
      text-align: left;
    }
  }
  & > footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    @mixin center;
    height: 36px;
    color: white;
    background: #ccc;
    border-top: 1px dotted #ccc;
    & .original {
      margin-left: 10px;
      font-size: 12px;
      text-decoration: line-through;
    }
  }
  &.checked {
    border: solid 1px var(--qwt-c-orange);
    & > footer {
      border-top: 1px dotted var(--qwt-c-orange);
      background: var(--qwt-c-orange);
      color: white;
    }
    & > p {
      position: absolute;
      height: 0;
      width: 0;
      left: 266px;
      bottom: 10px;
      right: 0;
    }
    & i.icon-check {
      @mixin center;
      float: right;
      width: 20px;
      height: 20px;
      font-size: 10px;
      font-weight: 600;
      border-radius: 50%;
      background: #ff7533;
      color: white;
      border: 2px solid white;
    }
  }
}
</style>
