<template>
  <div v-if="words.length">
    {{text}}
  </div>
</template>

<script>
  import {getRecentSold} from 'api/biaowang'
  import {
    getCnName
  } from 'util'

  export default {
    name: 'recent-sold',
    props: {
      allAreas: Array
    },
    data() {
      return {
        words: []
      }
    },
    computed: {
      text() {
        return this.words.map(
          item =>
          `关键词${item.word}，在${this.formatCities(item.cities, item.cityCounts)}已被售出`
        ).join('。')
      }
    },
    methods: {
      formatCities(cities, count) {
        return cities.map(city => getCnName(city, this.allAreas)).join(',') + (count > cities.length ? `等${cityCounts}个城市` : '')
      }
    },
    async mounted() {
      this.words = await getRecentSold()
    },
  }
</script>

<style lang="postcss" scoped>

</style>
