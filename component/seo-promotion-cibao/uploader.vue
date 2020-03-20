<template>
  <uploader
    @upload-success="handleUploadSuccess"
  >
    <div class="upload-image-wrapper" v-if="imageUrl">
      <img
        :width="width"
        height="100px"
        :src="imageUrl"
      />
    </div>
  </uploader>
</template>

<script>
import Uploader from '../common/image-uploader'

export default {
  name: 'image-uploader',
  components: {Uploader},
  data() {
    return {
      url: ''
    }
  },
  props: {
    width: {
      type: String,
      default: '100px'
    },
    value: String
  },
  computed: {
    imageUrl() {
      return this.url || this.value
    }
  },
  methods: {
    handleUploadSuccess(urls) {
      this.url = urls[0]
      this.$emit('input', this.url)
    }
  }
}
</script>

<style>

</style>
