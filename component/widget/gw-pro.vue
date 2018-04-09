
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
  width: 154px;
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

    & > span:first-child {
      margin-right: 5px;
    }

    & > span:last-child {
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
