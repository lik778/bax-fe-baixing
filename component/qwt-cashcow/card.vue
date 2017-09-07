
<template>
  <el-card class="card" :body-style="{padding: 0}">
    <div class="header" :class="{highlight: type === 'release'}">
      <a @click="$emit('edit')">{{ title }}</a>
      <i @click.stop="onOperate" class="operate material-icons">
        {{ operateIconMapping[this.operateName] }}
      </i>
    </div>
    <div class="body">
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
  import pick from 'lodash/pick'
  import { toHumanTime } from 'utils'

  const operateIconMapping = {
    remove: 'clear',
    unrelease: 'power_settings_new'
  }

  export default {
    data() {
      return {
        windowRef: null,
        operateIconMapping
      }
    },

    props: {
      type: {
        type: String // release/draft
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

      toHumanTime
    }
  }
</script>

<style>
  a {
    color: #337ab7;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .card {
    box-shadow: none;
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
    background: #D3DCE6;

    &.highlight {
      background: #d4edfb;
    }

    & > i {
      cursor: pointer;
    }
  }

  .body {
    padding: 10px;
    min-height: 76px;

    & > div + div {
      margin-top: 10px;
    }
  }
</style>
