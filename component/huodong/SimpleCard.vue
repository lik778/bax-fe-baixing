
<template>
  <div :class="{'qwt-pro-widget': true, checked}" @click="onClick">
    <main v-if="editable">
      自定义<input v-model.number="inputPrice"
        :placeholder="String(minInputPrice)"
        @blur="onBlur"
        ref="input" />元
    </main>
    <main v-else>
        {{ centToYuan(displayPrice) + '元' }}
    </main>
    <p>
      <bx-icon v-if="checked" type="check"></bx-icon>
    </p>
  </div>
</template>

<script>
import BxIcon from 'com/widget/icon'
import { Message } from 'element-ui'
import { centToYuan } from 'utils'

export default {
  name: 'price-tag',
  components: {
    BxIcon
  },
  props: {
    editable: Boolean,
    checked: Boolean,
    price: Number
  },
  data() {
    return {
      minInputPrice: 100,
      inputPrice: ''
    }
  },
  computed: {
    displayPrice() {
      return this.inputPrice || this.price
    },
  },
  methods: {
    centToYuan,
    onBlur() {
      const {
        minInputPrice,
        inputPrice
      } = this

      if (inputPrice < minInputPrice) {
        return Message.error(`最低充值金额: ${minInputPrice}`)
      }
    },
    onClick(e) {
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

<style lang="postcss" scoped>

input {
  width: 70px;
  height: 24px;
  margin: 0 5px;
  padding: 5px;
  border-radius: 3px;
  background-color: transparent;
  border: none;
  font-size: 20px;
  color: white;
}
input::placeholder {
  color: #9253FF;
}

.qwt-pro-widget {
  font-size: 20px;
  padding: 18px 25px;
  border-radius: 8px;
  border: solid 2px #fff;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: lighter;

  & > main {
    font-size: 20px;
  }
}

.qwt-pro-widget.checked {
  border: 2px solid #FFD500;
  background-color: transparent;
  color: #FFD500;
  position: relative;

  & > p {
    position: absolute;
    height: 0;
    width: 0;
    right: 10px;
    bottom: -5px;
  }

  & i.icon-check {
    font-size: 20px;
    font-weight: 600;
    border-radius: 50%;
    background: #FFD500;
    color: #5F00C9;
  }
}
</style>
