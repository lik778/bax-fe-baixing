<template>
  <div :class="{'gw-pro-widget': true, checked}"
    @click="onClick">
    <div class="hot-flag" v-if="isHot">
      <section>
        <main>
          热卖
        </main>
        <footer>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-triangle">
            <polygon points="0,0 44,0 22,12"/>
          </svg>
        </footer>
      </section>
    </div>
    <header>
      {{ title }}
    </header>
    <main>
      <div>
        <span>
          <li>支持多端展示</li>
          <li>共享多渠道落地页</li>
        </span>
        <span>
          <li>支持微信分享</li>
          <li>丰富媒体库</li>
        </span>
      </div>
    </main>
    <footer>
      <span v-if="price !== undefined && (originalPrice === price || checked)">{{ price + '元' }}</span>
      <span v-if="price !== originalPrice" class="original">原价{{originalPrice}}元</span>
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
    checked: Boolean,
    price: Number,
    originalPrice: Number,
    title: String,
    isHot: Boolean
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
  display: inline-flex;
  flex-flow: column;
  width: 260px;
  height: 134px;
  border-radius: 4px;
  border: solid 1px #ccc;
  cursor: pointer;
  margin-right: 20px;

  & > header {
    @mixin center;
    height: 42px;
    color: #333333;
    font-weight: 500;
    border-bottom: dotted 1px #ccc;
    font-size: 14px;
  }

  & > main {
    flex-grow: 1;

    & > p {
      @mixin center;
      margin: 15px 0;
      font-weight: 600;
      color: #ccc;
    }

    & > div {
      padding: 5px 15px;

      & > span {
        & > li {
          font-size: 12px;
          line-height: 2;
          color: #666666;
          list-style: unset;
        }
      }
    }
  }

  & > footer {
    @mixin center;
    height: 36px;
    color: white;
    background: #ccc;
    border-top: 1px dotted #ccc;
  }
}

.hot-flag {
  position: relative;
  width: 0;
  height: 0;
  top: -4px;
  left: 200px;

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

.gw-pro-widget.checked {
  border: solid 1px var(--qwt-c-orange);

  & > main {
    & > p {
      color: var(--qwt-c-orange);
    }
  }

  & > footer {
    border-top: 1px dotted var(--qwt-c-orange);
    background: var(--qwt-c-orange);
    color: white;
  }

  & > p {
    position: relative;
    height: 0;
    width: 0;
    left: 266px;
    bottom: 10px;
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
.original {
  margin-left: 10px;
  font-size: 12px;
  text-decoration: line-through;
}
</style>
