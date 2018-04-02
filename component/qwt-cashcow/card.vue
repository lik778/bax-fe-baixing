
<template>
  <el-card class="card" :body-style="{padding: 0}">
    <div class="header" :class="{highlight: type === 'release'}"
      @keyup.enter="onUpdateTitle">
      <a v-if="!editTitle" @click="$emit('edit')">{{ title }}</a>
      <el-input class="input" v-if="editTitle" :maxlength="20"
        v-model="localTitle" @blur="editTitle = false">
      </el-input>
      <span class="icons">
        <i class="material-icons" v-if="!editTitle" @click="editTitle = true">mode_edit</i>
        <i class="material-icons" v-if="editTitle" @click="onUpdateTitle">done</i>
        <i @click.stop="onOperate" class="operate material-icons">
          {{ operateIconMapping[this.operateName] }}
        </i>
      </span>
    </div>
    <div class="body">
      <div v-if="createdAt">
        创建于：{{ toHumanTime(createdAt) }}
      </div>
      <div v-if="updatedAt">
        修改于：{{ toHumanTime(updatedAt) }}
      </div>
      <div v-if="releaseAt">
        发布于：{{ toHumanTime(releaseAt) }}
      </div>
    </div>
  </el-card>
</template>

<script>
  import { toHumanTime } from 'utils'

  const operateIconMapping = {
    remove: 'clear',
    unrelease: 'power_settings_new'
  }

  export default {
    data() {
      return {
        localTitle: this.title,
        editTitle: false,

        windowRef: null,
        operateIconMapping
      }
    },

    props: {
      type: {
        type: String // release/draft
      },
      createdAt: {
        type: String
      },
      updatedAt: {
        type: String
      },
      releaseAt: {
        type: String
      },
      id: {
        type: String
      },
      title: {
        type: String
      },
      userId: {
        type: Number
      }
    },

    computed: {
      operateName() {
        const { type } = this
        if (type === 'draft') {
          return 'remove'
        }
        if (type === 'release') {
          return 'unrelease'
        }
      }
    },

    methods: {
      async onOperate() {
        const { operateName } = this
        this.$emit(operateName)
      },

      async onUpdateTitle() {
        const { localTitle } = this

        if (localTitle) {
          this.$emit('update', {name: localTitle})
        }

        this.editTitle = false
      },

      toHumanTime
    },

    watch: {
      title(v) {
        this.localTitle = v
      }
    }
  }
</script>

<style>
  a {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .input {
    margin-right: 5px;

    & > input {
      height: 29px
    }
  }

  .card {
    /* box-shadow: none; */
  }

  .operate {
    font-size: 24px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #475669;
    padding: 8px 10px;
    border-bottom: 1px solid #d1dbe5;
    background: #e9edf2;

    &.highlight {
      background: #d4edfb;
    }

    & i {

    }

    & > a {
      text-overflow: ellipsis;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .icons {
    word-break: keep-all;
    white-space: nowrap;

    & i {
      cursor: pointer;
    }
  }

  .body {
    padding: 10px;
    min-height: 106px;

    & > div+div {
      margin-top: 10px;
    }
  }
</style>
