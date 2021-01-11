<template>
  <div>...</div>
</template>

<script>
export default {
  name: 'bax-redirect-page',
  mounted () {
    // why ? 同一页 强制 dom destroy
    // vue router -> key = fullpath 有点问题
    console.debug('redirect to ...')
    setTimeout(() => {
      const { targetPage, ...q } = this.$route.query
      this.$router.push({
        name: targetPage,
        query: {
          ...q
        }
      })
    }, 10)
  }
}
</script>
