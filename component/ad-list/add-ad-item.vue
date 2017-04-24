
<template>
  <el-dialog title="新增条件投放" v-model="visible"
    :close-on-click-modal="false"
    @close="cancel">
    <el-form ref="form" label-width="100px">
      <el-form-item label="新方案名称">
        <el-input v-model="name" />
      </el-form-item>
      <el-form-item label="请选择类目">
        <bax-select multiple :options="allCategories"
          @change="v => categories = v" />
      </el-form-item>
      <el-form-item label="请选择城市">
        <bax-select multiple :options="allAreas"
          @change="v => areas = v" />
      </el-form-item>
    </el-form>
    <section class="items">
      <div>
        <span>{{ '满足条件共 ' + items.length + ' 个' }}</span>
        <span>
          <el-button type="mini" @click="checkAllItems">
            全选
          </el-button>
          <el-button type="mini" @click="checkedItemIds = []">
            清空
          </el-button>
        </span>
      </div>
      <div>
        <li v-for="item in items">
          <span>
            <label>{{ item.area }}</label>
            <label>{{ item.category }}</label>
          </span>
          <span>
            <el-checkbox-group v-model="checkedItemIds"
              @change="onCheckItems">
              <el-checkbox :label="item.id" />
            </el-checkbox-group>
          </span>
        </li>
      </div>
    </section>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import BaxSelect from 'com/common/select'

import { Message } from 'element-ui'

import {
  createAdItem,
  getAdItems
} from './action'

import {
  queryAdItems
} from 'api/ad'

const emptyAdItem = {
}

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
    orderId: {
      type: String,
      required: true
    },
    allCategories: {
      type: Array,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      checkedItemIds: [],
      name: '',
      categories: [],
      areas: [],
      items: []
    }
  },
  watch: {
    categories() {
      this.queryItems()
    },
    areas() {
      this.queryItems()
    }
  },
  async mounted() {
  },
  methods: {
    async queryItems() {
      const {
        allCategories,
        allAreas,

        categories,
        areas,

        orderId
      } = this

      if (categories.length && areas.length) {
        const { items } = await queryAdItems({
          cities: areas,
          categories,
          orderId
        })

        this.items = items.map(i => {
          const { tags } = i

          const category = allCategories
            .find(c => c.name === tags.category)

          const area = allAreas
            .find(a => a.name === tags.city)

          return {
            ...tags,
            ...i,
            category: category.nameCn,
            area: area.nameCn
          }
        })
      }
    },
    checkAllItems() {
      this.checkedItemIds = this.items.map(i => i.id)
    },
    onCheckItems(checkedItemIds) {
      this.checkedItemIds = [...checkedItemIds]
    },
    empty() {
      this.checkedItemIds = []
      this.name = ''
      this.items = []
      this.categories = []
      this.areas = []
    },
    cancel() {
      this.empty()
      this.$emit('hide')
    },
    async submit() {
      const {
        checkedItemIds,
        name,
        orderId
      } = this

      if (!checkedItemIds.length) {
        return Message.error('请选择投放单位')
      }

      await createAdItem({
        name,
        orderId
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
