
<template>
  <main>{{ msg }}</main>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      msg: 'bingo'
    }
  }
}

</script>

<style scoped>

main {
  display: grid;
}

</style>
