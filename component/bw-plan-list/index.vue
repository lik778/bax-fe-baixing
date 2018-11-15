<template>
  <div>
    <shopping-cart :items="items" />
  </div>
</template>

<script>
  import ShoppingCart from 'com/common/bw-shopping-cart'
  export default {
    name: 'bw-plan-list',
    components: {
      ShoppingCart
    },
    data() {
      return {
        items: [{
          word: 'xxx',
          price: 1000,
          days: 30,
          device: 0,
          isSold: false,
          cities: ['上海']
        }, {
          word: 'yyy',
          price: 1000,
          days: 30,
          device: 0,
          isSold: false,
          cities: ['上海']
        }]
      }
    }
  }
</script>
