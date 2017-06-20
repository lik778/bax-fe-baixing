
<template>
  <div class="gw-pro-widget">
    <i v-if="checked" class="el-icon-check" />
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
  </div>
</template>

<script>

export default {
  name: 'gw-pro-widget',
  props: {
    checked: Boolean,
    price: Number,
    title: String
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
