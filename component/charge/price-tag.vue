
<template>
  <div :class="{'qwt-pro-widget': true, checked}" @click="onClick">
    <main v-if="editable">
      自定义<input v-model.number="inputPrice"
        :placeholder="String(minInputPrice)"
        @blur="onBlur"
        ref="input" />元
    </main>
    <main v-else>
      <label>
        {{ displayPrice + '元' }}
      </label>
    </main>
    <p>
      <bx-icon v-if="checked" type="check"></bx-icon>
    </p>
  </div>
</template>

<script>
import BxIcon from 'com/widget/icon'
import { Message } from 'element-ui'

export default {
  name: 'price-tag',
  components: {
    BxIcon
  },
  props: {
    editable: Boolean,
    checked: Boolean,
    price: Number,
    minInputPrice: {
      type: Number,
      default: 500
    },
    maxInputPrice: {
      type: Number,
      default: 99999999
    }
  },
  data () {
    return {
      inputPrice: ''
    }
  },
  computed: {
    displayPrice () {
      return this.inputPrice || this.price
    }
  },
  mounted () {
    if (this.editable) {
      this.$bus.$on('resetPriceTagInput', () => {
        this.inputPrice = ''
      })
    }
  },
  methods: {
    onBlur () {
      const {
        minInputPrice,
        maxInputPrice,
        inputPrice
      } = this

      if (inputPrice < minInputPrice) {
        return Message.error(`最低充值金额: ${minInputPrice}`)
      }
      if (inputPrice > maxInputPrice) {
        return Message.error(`最高充值金额：${maxInputPrice}`)
      }
    },
    onClick (e) {
      if (!this.checked) {
        if (this.editable) {
          this.$refs.input.focus()
        }
        this.$emit('click')
      } else {
        if (e.target.nodeName !== 'INPUT') {
          this.$emit('click')
        }
      }
    }
  },
  watch: {
    inputPrice (v) {
      this.$emit('change', v * 100)
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  width: 70px;
  height: 24px;
  margin: 0 5px;
  padding: 5px;
  border-radius: 3px;
}
input::placeholder {
  color: #ccc;
}

.qwt-pro-widget {
  padding: 20px 30px;
  border-radius: 4px;
  border: solid 1px #ccc;
  cursor: pointer;
  color: #333;
  margin: 0 30px 20px 0;

  & > main {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    & > label {
      text-align: center;
      cursor: pointer;
    }
  }
}

.qwt-pro-widget.checked {
  border: 1px solid #ff7533;
  background-color: #ff7533;
  color: white;
  position: relative;

  & > p {
    position: absolute;
    height: 0;
    width: 0;
    right: -10px;
    bottom: 10px;
  }

  & i.icon-check {
    @include center;
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
</style>
