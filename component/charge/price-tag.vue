
<template>
  <div :class="{'qwt-pro-widget': true, checked}" @click="onClick">
    <main v-if="editable">
      <input v-model.number="inputPrice"
        :placeholder="String(minInputPrice)"
        @blur="onBlur" />元
    </main>
    <main v-else>
      <label>
        {{ centToYuan(displayPrice) + '元' }}
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
      if (v < this.minInputPrice) {
        return
      }

      this.$emit('change', v * 100)
    }
  }
}
</script>

<style lang="postcss" scoped>
@import '../../cssbase/mixin';
@import 'cssbase/mixin';

input {
  width: 70px;
  height: 24px;
  margin-right: 5px;
  padding: 5px;
  border-radius: 3px;
}

.qwt-pro-widget {
  width: 110px;
  height: 60px;
  border-radius: 4px;
  border: solid 1px #ccc;
  cursor: pointer;
  color: #333;

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
  border: 1px solid #FF7533;
  background-color: #FF7533;
  color: white;

  & > p {
    position: relative;
    height: 0;
    width: 0;
    left: 118px;
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
</style>
