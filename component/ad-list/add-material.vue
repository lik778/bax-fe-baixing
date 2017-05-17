
<template>
  <el-dialog title="添加物料" :value="visible"
    :close-on-click-modal="false"
    @close="cancel">
    <el-form ref="form" :model="material" label-width="100px">
      <el-form-item label="选择物料">
        <bax-select :options="moptions" v-model="materialId"
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
      <el-form-item label="链接">
        <el-input v-model.trim="material.link"
          placeholder="如: http://baixing.com" />
      </el-form-item>
      <el-form-item label="上传物料" required>
        <div class="add-img">
          <uploader @success="onUploadSuccess" />
          <img v-if="material.url"
            v-bind:src="material.url" />
          <ul>
            <li>图片素材要求：</li>
            <li>1. 背景干净简洁不影响阅读</li>
            <li>2. 配图风格不影响文字阅读</li>
            <li>3. 文字规则：主标题字体需为开源字体，推荐使用黑体；主副标题字数、字号适当，不影响阅读</li>
            <li>4. 文件大小：生成的素材文件大小不超过150kb</li>
          </ul>
        </div>
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

import { Message } from 'element-ui'
import clone from 'clone'

import {
  addAdItemMaterial,
  setAdItemMaterial,
  getMaterials
} from './action'

const emptyMaterial = {
  content: '',
  name: '',
  slot: '',
  link: '',
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
      createMaterial: false,
      materialId: ''
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
      if (!v) {
        // clear
        this.material = clone(emptyMaterial)
        return
      }

      const m = this.materials.find(m => m.id === v)

      this.material = {
        content: m.content,
        url: m.imgUrl,
        link: m.link,
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
      this.materialId = ''
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
        if (material.link) {
          if (!material.link.startsWith('http://') &&
            !material.link.startsWith('https://')) {
              return Message.error('请填写正确的链接')
            }
        }

        if (!material.name) {
          return Message.error('请填写物料名称')
        }

        await addAdItemMaterial(itemId, material)
        await getMaterials() // 刷新物料列表 供 筛选
      } else {
        if (!material.id) {
          return Message.error('请选择或上传物料')
        }

        await setAdItemMaterial(itemId, material.id)
      }

      this.$emit('success')
      this.empty()
    }
  },
  watch: {
    materialId(v) {
      this.onSelectMaterial(v)
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

.add-img {
  & > img {
    margin-top: 10px;
    max-width: 120px;
    max-height: 80px;
    object-fit: contain;
  }

  & > ul {
    margin: 10px 0;

    & > li:first-child {
      font-size: 14px;
      line-height: 26px;
    }

    & > li {
      font-size: 12px;
      line-height: 20px;
    }
  }
}

</style>
