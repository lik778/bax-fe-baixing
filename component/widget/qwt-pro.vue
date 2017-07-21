
<template>
  <div class="qwt-pro-widget" @click="onClick">
    <i v-if="checked" class="el-icon-check"></i>
    <main>
      <span v-if="hasPrice && mode === 'normal'">
        价值
      </span>
      <span v-if="hasPrice && mode === 'normal'"
        @click="toInputPrice">
        {{ displayPrice + '元' }}
      </span>
      <p v-if="!hasPrice && mode === 'normal'"
        @click="toInputPrice">
        {{ title }}
      </p>
      <p v-if="mode === 'input'">
        <el-input size="mini" style="width: 90px"
          placeholder="输入金额" v-model="inputPrice"
          @change="onInputPrice"
          @blur="onBlur">
        </el-input>
      </p>
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
      inputPrice: '',
      mode: 'normal' // input
    }
  },
  methods: {
    toInputPrice() {
      if (!this.editable) {
        return
      }

      this.mode = 'input'
    },
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

      if (parseInt(inputPrice) < minInputPrice) {
        return Message.error(`最低充值金额: ${minInputPrice}`)
      }

      this.mode = 'normal'
    },
    onClick() {
      this.$emit('click')

      if (this.hasPrice) {
        const p = this.price || this.inputPrice
        this.$emit('set-money', p)
      } else {
        this.$emit('set-money', 0)
      }
    }
  },
  computed: {
    displayPrice() {
      return this.inputPrice || this.price
    },
    hasPrice() {
      const { title } = this

      if (title === '暂不充值') {
        return false
      }

      if (title === '其他金额') {
        return !!this.inputPrice
      }

      return true
    },
    showFooter() {
      return !['暂不充值'].includes(this.title)
    }
  }
}

</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

.qwt-pro-widget {
  display: inline-flex;
  flex-flow: column;
  width: 120px;
  height: 70px;
  border-radius: 4px;
  border: solid 1px #009cff;
  cursor: pointer;

  & > i {
    @mixin checked-icon;
  }

  & > main {
    @mixin center;
    flex-grow: 1;
    font-size: 14px;
    font-weight: 500;
    color: #6a778c;

    & > span:last-child {
      margin-left: 10px;
      color: #f9a568;
    }
  }

  & > footer {
    @mixin center;
    height: 22px;
    background: #009cff;
    font-size: 14px;
    font-weight: 500;
    color: white;
  }
}

</style>
