<template>
  <div class="cashcow">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 微站</label>
    </topbar>

    <main>
      <header>
        微站列表
        <el-button
          :disabled="reachLimit" @click="onCreate"
          type="primary" icon="plus">
          新建微站
        </el-button>
      </header>

      <el-row :gutter="24" class="list">
        <el-col :span="8" class="item"
          v-for="page in pageList" :key="page.id">
          <card :id="page.id" :userId="userId"
            :title="page.title" :createdAt="page.createdAt"
            :type="page.type" :updatedAt="page.updatedAt"
            :releaseAt="page.releaseAt" @edit="onEdit(page.pageId)"
            @update="v => onUpdate(page.pageId, v)"
            @remove="onRemove(page.id)" @unrelease="onUnrelease(page.id)">
          </card>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<script>
  import Topbar from 'com/topbar'
  import Card from './card'

  import {
    getCashcowPageCreateUrl,
    getCashcowPageEditUrl,
  } from 'util/kit'

  import * as action from './action'
  import * as api from 'api/cashcow'
  import store from './store'

  const maxPageCount = 5

  export default {
    name: 'qwt-cashcow',
    store,
    components: {
      Topbar,
      Card,
    },

    data() {
      return {
        timer: null
      }
    },

    props: {
      userInfo: {
        type: Object,
        required: true
      }
    },

    computed: {
      reachLimit() {
        const { pageList } = this
        return pageList.length >= maxPageCount
      },
      userId() {
        return this.userInfo.baixingId
      }
    },

    methods: {
      onCreate() {
        const { id } = this.userInfo
        const windowRef = window.open('新建微站', '请稍候……')
        const redirectUrl = getCashcowPageCreateUrl(id)
        windowRef.location = redirectUrl
        windowRef.focus()
      },
      onEdit(pageId) {
        const { userId } = this
        const windowRef = window.open('编辑微站', '请稍候……')
        const redirectUrl = getCashcowPageEditUrl(pageId, userId)
        windowRef.location = redirectUrl
        windowRef.focus()
      },
      async onUpdate(pageId, info) {
        const { userId } = this
        try {
          await api.updatePage({...info, id: pageId, userId})
        } finally {
          await this.getPageList()
        }
      },
      async onRemove(id) {
        const { userId } = this
        this.$confirm('确认删除此站点？', {
          type: 'warning'
        })
        .then(async () => {
          await api.removeDraftPage({id, userId})
          await this.getPageList()
          this.$message.success('删除成功')
        })
      },
      async onUnrelease(id) {
        const { userId } = this

        this.$confirm('确认下线此站点？', {
          type: 'warning'
        })
        .then(async () => {
          await api.removeReleasePage({id, userId})
          await this.getPageList()
          this.$message.success('下线成功')
        })
      },
      async getPageList() {
        const { userId } = this
        if (!userId) {
          return
        }
        await action.getPageList(userId)
      }
    },

    watch: {
      userInfo(val, oldVal) {
        if (!oldVal.id && val.id) {
          this.getPageList()
        }
      }
    },

    mounted() {
      this.getPageList()
      this.timer = window.setInterval(this.getPageList, 1000 * 60 * 2)
    },

    beforeDestroy() {
      window.clearInterval(this.timer)
    }
  }
</script>

<style scoped>
  .cashcow {
    padding: 0 35px;
    width: 100%;
  }

  main {
    & > header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .list {
    margin-top: 16px;
  }

  .item {
    margin-bottom: 20px;
  }
</style>
