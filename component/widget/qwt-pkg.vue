
<template>
  <div class="qwt-pkg-widget">
    <i v-if="checked" class="el-icon-check" />
    <header>
      {{ name }}
    </header>
    <main>
      <div>
        <span>精品官网</span>
        <span>{{ h1 }}</span>
      </div>
      <div>
        <span>推广资金</span>
        <span>{{ h2 }}</span>
      </div>
      <div>
        <span>售价</span>
        <span>{{ price + '元' }}</span>
      </div>
    </main>
  </div>
</template>

<script>

export default {
  name: 'qwt-pkg-widget',
  props: {
    checked: Boolean,
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    h1: String,
    h2: String
  }
}

</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

.qwt-pkg-widget {
  display: inline-block;
  width: 196px;
  height: 160px;
  border-radius: 4px;
  border: solid 1px #0b9eff;
  cursor: pointer;

  & > i {
    @mixin checked-icon;
  }

  & > header {
    @mixin center;
    height: 30px;
    background: #0b9eff;
    font-size: 14px;
    font-weight: 500;
    color: white;
  }

  & > main {
    & > div {
      display: flex;
      align-items: center;

      & > span:first-child {
        color: #6a778d;
        width: 80px;
      }

      & > span:last-child {
        font-weight: 600;
        color: #ff944d;
      }
    }

    & > div:nth-child(1), & > div:nth-child(2) {
      margin-top: 15px;
      padding-left: 27px;
    }

    & > div:nth-child(3) {
      justify-content: center;
      margin-top: 20px;

      & > span:first-child {
        width: 40px;
      }
    }
  }
}

</style>
