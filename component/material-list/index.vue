
<template>
  <div>
    <material-filter></material-filter>
    <material-list></material-list>
  </div>
</template>

<script>

import MaterialFilter from './filter'
import MaterialList from './list'

export default {
  name: 'material',
  components: {
    MaterialFilter,
    MaterialList
  }
}

</script>

<style scoped>

div {
  padding: 35px;
}

</style>
