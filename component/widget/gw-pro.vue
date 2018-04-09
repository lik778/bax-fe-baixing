
<template>
  <div :class="{'gw-pro-widget': true, checked}" @click="onClick">
    <main>
      <span>
        价值
      </span>
      <span>
        {{ price + '元' }}
      </span>
    </main>
    <footer>
      {{ title }}
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
    title: String
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/mixin';
@import 'cssbase/mixin';

.gw-pro-widget {
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
    border-top: 1px dotted #ffb74d;
  }
}

.gw-pro-widget.checked {
  border: solid 1px #ff7533;

  & > footer {
    border-top: 1px dotted #ff7533;
    background: #ff7533;
    color: white;
  }

  & > p {
    position: relative;
    height: 0;
    width: 0;
    left: 178px;
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
