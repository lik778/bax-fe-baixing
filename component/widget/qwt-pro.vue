
<template>
  <div :class="{'qwt-pro-widget': true, checked}" @click="onClick">
    <main v-if="title === '下次再充值'">
      下次再充值
    </main>
    <main v-else-if="mode === 'normal'">
      <span>
        价值
      </span>
      <span>
        {{ displayPrice + '元' }}
      </span>
    </main>
    <main v-else-if="mode === 'input'">
      <el-input v-model="inputPrice"
        placeholder="自定义金额数"
        @change="onInputPrice"
        @blur="onBlur">
      </el-input>
      <label>元</label>
    </main>
    <footer v-if="showFooter">
      推广资金包
    </footer>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  name: 'qwt-pro-widget',
  props: {
    editable: Boolean,
    checked: Boolean,
    price: Number,
    title: String
  },
  data() {
    return {
      minInputPrice: 288,
      inputPrice: ''
    }
  },
  computed: {
    displayPrice() {
      return this.inputPrice || this.price
    },
    hasPrice() {
      const { title } = this

      if (title === '下次再充值') {
        return false
      }

      if (title === '购买其他金额') {
        return !!this.inputPrice
      }

      return true
    },
    showFooter() {
      return !['下次再充值'].includes(this.title)
    },
    mode() {
      const { title } = this
      return title === '购买其他金额' ? 'input' : 'normal'
    }
  },
  methods: {
    onInputPrice(v) {
      const p = parseInt(v)
      if (p < this.minInputPrice) {
        return
      }

      this.$emit('set-money', p)
    },
    onBlur() {
      const {
        minInputPrice,
        inputPrice
      } = this

      if (!(parseInt(inputPrice) >= minInputPrice)) {
        return Message.error(`最低充值金额: ${minInputPrice}`)
      }

      this.mode = 'normal'
    },
    onClick() {
      this.$emit('click')

      if (this.hasPrice) {
        const p = this.price || this.inputPrice
        if (p >= this.minInputPrice) {
          this.$emit('set-money', p)
        } else {
          this.$emit('set-money', 0)
        }
      } else {
        this.$emit('set-money', 0)
      }
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/mixin';
@import 'cssbase/mixin';

.el-input {
  width: 118px;
  height: 34px;
}

.qwt-pro-widget {
  display: inline-flex;
  flex-flow: column;
  width: 170px;
  height: 100px;
  border-radius: 4px;
  border: solid 1px #ffb74d;
  cursor: pointer;

  & > main {
    @mixin center;
    flex-grow: 1;
    border-bottom: 1px dotted #ffb74d;
    color: #666666;

    & > span:last-child {
      margin-left: 10px;
      font-weight: 500;
      color: #fc8342;
    }

    & > label {
      margin-left: 8px;
    }
  }

  & > footer {
    @mixin center;
    height: 40px;
    color: #666666;
  }
}

.qwt-pro-widget.checked {
  border: solid 1px #ff7533;

  & > main {
    border-bottom: 1px dotted #ff7533;
  }

  & > footer {
    background: #ff7533;
    color: white;
  }
}
</style>
