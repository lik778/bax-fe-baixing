<template>
  <div class="step">
    <label>
      {{ title }}
      <span v-if="hint" class="hint">
        &nbsp;{{ hint }}
      </span>
    </label>
    <slot name="tip"></slot>
    <section class="step-bar">
      <span v-for="(s, i) in steps" :key="i">
        <i :class="getIconClass(i + 1)">
        {{ getIconContent(i + 1) }}
        </i>
        <label>{{ s.name }}</label>
        <strong v-if="i + 1 < steps.length"></strong>
      </span>
    </section>
  </div>
</template>

<script>
export default {
  name: 'bax-step',
  props: {
    title: {
      type: String,
      required: true
    },
    steps: {
      type: Array
      // required: true
    },
    step: {
      type: Number
      // required: true
    },
    hint: {
      type: String,
      default: ''
    }
  },
  methods: {
    getIconClass (n) {
      const { step } = this

      if (n < step) {
        return 'iconfont icon-check'
      }

      if (n === step) {
        return 'ing'
      }

      return ''
    },
    getIconContent (n) {
      const { step } = this

      if (n >= step) {
        return n
      }

      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.step {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  width: 100%;
  padding: 0 20px;
  border-radius: 4px;
  background: white;

  & > label {
    font-weight: 600;
    color: #666666;
  }
  & .hint {
    font-size: 12px;
    color: #999;
  }
}

.step-bar {
  display: flex;
  align-items: center;

  & > span {
    display: inline-flex;
    align-items: center;

    & i {
      @include center;
      width: 23px;
      height: 23px;
      margin-right: 20px;
      border-radius: 50%;
      border: 1px solid #999999;
      font-size: 12px;
      color: #999999;
    }

    & .iconfont.icon-check {
      color: $qwt-c-blue;
      border-color: $qwt-c-blue;
      padding-top: 3px;
    }

    & .ing {
      background: $qwt-c-blue;
      border-color: white;
      color: white;
    }

    & label {
      font-size: 14px;
      color: #666666;
    }

    & strong {
      width: 46px;
      height: 1px;
      margin: 0 12px;
      border-bottom: 1px dotted $qwt-c-blue;
    }
  }
}
</style>
