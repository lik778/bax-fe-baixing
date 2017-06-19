
<template>
  <div class="gw-pro-widget">
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
    price: Number,
    title: String
  }
}

</script>

<style scoped>

@import 'cssbase/mixin';

.gw-pro-widget {
  display: inline-flex;
  flex-flow: column;
  width: 154px;
  height: 70px;
  border-radius: 4px;
  border: solid 1px #009cff;

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
