
<template>
  <el-dialog title="新增投放" :value="visible"
    :close-on-click-modal="false"
    @close="cancel">
    <el-form ref="form" label-width="100px">
      <el-form-item label="名称" required>
        <el-input v-model="name" />
      </el-form-item>
      <el-form-item label="请选择类目">
        <bax-select multiple :options="categoryOpts"
          v-model="categories" />
      </el-form-item>
      <el-form-item label="请选择城市">
        <bax-select multiple :options="areaOpts"
          v-model="areas" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import BaxSelect from 'com/common/select'

import { Message } from 'element-ui'
import clone from 'clone'

import {
  filterCategories,
  filterAreas
} from 'util/meta'

import {
  createAdItem,
  getAdItems
} from './action'

export default {
  name: 'add-ad-item',
  components: {
    BaxSelect
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    oldItemId: {
      type: Number,
      required: true
    },
    allCategories: {
      type: Array,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    },
    oldCategories: {
      type: Array,
      default: () => [],
      required: true
    },
    oldAreas: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      categories: [],
      areas: [],
      name: ''
    }
  },
  computed: {
    categoryOpts() {
      const categories = [...this.oldCategories]
      return filterCategories(this.allCategories, categories)
    },
    areaOpts() {
      const areas = [...this.oldAreas]
      return filterAreas(this.allAreas, areas)
    }
  },
  methods: {
    empty() {
      this.categories = []
      this.areas = []
      this.name = ''
    },
    cancel() {
      this.empty()
      this.$emit('hide')
    },
    async submit() {
      const {
        categories,
        areas,

        oldItemId,
        name
      } = this

      if (!categories.length) {
        return Message.error('请选择投放类目')
      }

      if (!areas.length) {
        return Message.error('请选择投放区域')
      }

      await createAdItem({
        categories,
        areas,

        oldItemId,
        name
      })

      this.empty()
      await getAdItems()

      Message.success('添加成功')
      this.$emit('hide')
    }
  }
}

</script>

<style scoped>

.items {
  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;

  }

  & > div:last-child {
    display: flex;
    flex-flow: column;
    max-height: 200px;
    overflow-y: auto;

    & > li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin: 10px 0;
      padding: 0 10px;
      font-size: 14px;
      color: gray;

      & > span {
        & > label {
          min-width: 80px;
        }
      }
    }
  }
}

</style>
