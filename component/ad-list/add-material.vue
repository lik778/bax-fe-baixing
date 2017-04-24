
<template>
  <el-dialog title="添加物料" v-model="visible"
    :close-on-click-modal="false"
    @close="cancel">
    <el-form ref="form" :model="material" label-width="100px">
      <el-form-item label="选择物料">
        <bax-select :options="moptions" @change="onSelectMaterial"
          :filter-method="onQueryMaterials" />
      </el-form-item>
      <el-form-item label="名称" required>
        <el-input v-model="material.name" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="material.content" />
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model="material.slot" />
      </el-form-item>
      <el-form-item label="上传物料" required>
        <uploader @success="onUploadSuccess" />
        <img class="preview" v-if="material.url"
          v-bind:src="material.url" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import Uploader from 'com/common/uploader'
import BaxSelect from 'com/common/select'

import {
  addAdItemMaterial,
  setAdItemMaterial,
  getMaterials
} from './action'

const emptyMaterial = {
  content: '',
  name: '',
  slot: '',
  url: ''
}

export default {
  name: 'add-material',
  components: {
    BaxSelect,
    Uploader
  },
  props: {
    materials: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    itemId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      material: {...emptyMaterial},
      createMaterial: false
    }
  },
  computed: {
    moptions() {
      return this.materials.map(m => ({
        label: m.name + ' ' + (m.slot || ''),
        value: m.id
      }))
    }
  },
  async mounted() {
    await getMaterials()
  },
  methods: {
    onSelectMaterial(v) {
      const m = this.materials.find(m => m.id === v)
      this.material = {
        content: m.content,
        url: m.imgUrl,
        name: m.name,
        slot: m.slot,
        id: m.id
      }
    },
    onUploadSuccess(url) {
      this.createMaterial = true
      this.material.url = url
    },
    empty() {
      this.material = {...emptyMaterial}
      this.createMaterial = false
      this.$emit('hide')
    },
    cancel() {
      this.empty()
    },
    async onQueryMaterials(v) {
      await getMaterials({name: v})
    },
    async submit() {
      const {
        createMaterial,
        material,
        itemId
      } = this

      if (createMaterial) {
        // TODO - 字段检测
        await addAdItemMaterial(itemId, material)
      } else {
        await setAdItemMaterial(itemId, material.id)
      }

      this.$emit('success')
      this.empty()
    }
  }
}

</script>

<style scoped>

.el-dialog__body {
  & > div {
    margin: 10px 0;
  }
}

.preview {
  margin: 10px 0;
  max-width: 120px;
  max-height: 80px;
  object-fit: contain;
}

</style>
