
<template>
  <div class="qwt-pro-widget">
    <i v-if="checked" class="el-icon-check" />
    <main>
      <span v-if="hasPrice">
        价值
      </span>
      <span v-if="hasPrice">
        {{ price + '元' }}
      </span>
      <p v-if="!hasPrice">
        {{ title }}
      </p>
    </main>
    <footer v-if="showFooter">
      推广资金
    </footer>
  </div>
</template>

<script>

export default {
  name: 'qwt-pro-widget',
  props: {
    checked: Boolean,
    price: Number,
    title: String
  },
  computed: {
    hasPrice() {
      return !['其他金额', '暂不充值'].includes(this.title)
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
