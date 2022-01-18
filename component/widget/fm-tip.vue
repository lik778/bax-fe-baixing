<template>
  <div class="fm-tip-container" @mouseover="visiable = true" @mouseleave="visiable = false">

    <transition name="el-fade-in-linear">
      <div
        class="image-wrap"
        v-show="visiable"
        :style="position === 'creative' ? 'transform: translateY(-100%) translateX(-30%);' : ''"
      >
        <slot name="float-content">
          <img :src="imgUrl">
        </slot>
      </div>
    </transition>
    <div
      class="text"
      @click="isStopAnimation = true"
      :style="isStopAnimation ? 'animation-play-state: paused;' : ''"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'fm-tip',
  data () {
    return {
      visiable: false,
      isStopAnimation: false
    }
  },
  props: {
    position: {
      type: String
    },
    imgUrl: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes tada {
  0% {
    transform: scaleX(1);
  }

  10%,
  20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate(-3deg);
  }

  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate(3deg);
  }

  40%,
  60%,
  80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg);
  }

  to {
    transform: scaleX(1);
  }
}
.fm-tip-container {
  position: relative;
}
.image-wrap {
  position: absolute;
  top: 50%;
  transform: translateY(-40%);
  left: 100%;
  z-index: 100;
}
.text {
  color: #ff7533;
  font-size: 12px;
  cursor: help;
  animation: tada 3s infinite;
}
</style>
