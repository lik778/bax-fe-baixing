<template>
  <el-dialog :visible="visible" width="320px"
    class="qwt-copy-campaign-dialog"
    :close-on-click-modal="false"
    :before-close="cancel">
    <header class="title" slot="title">
      <bx-icon type="smile" />
      <label>{{ title }}</label>
    </header>
    <main class="main">
      <h3>您还可以一键投放到：</h3>
      <li v-for="p in platforms" :key="p.id">
        <bx-icon
          :type="getPlatformIcon(p.id)"
          @click.native="onClickPlatform(p.id)"
        />
        <span>{{ p.name }}</span>
      </li>
      <footer>
        <el-button size="mini" @click="cancel">
          我再想想
        </el-button>
        <el-button type="primary" size="mini"
          @click="copy">
          立即投放
        </el-button>
      </footer>
    </main>
  </el-dialog>
</template>

<script>
import BxIcon from 'com/widget/icon'

import {
  SEM_PLATFORM_SHENMA,
  SEM_PLATFORM_BAIDU,
  SEM_PLATFORM_SOGOU,
  SEM_PLATFORM_QIHU,

  semPlatformCn
} from 'constant/fengming'

const allPlatforms = [
  SEM_PLATFORM_SHENMA,
  SEM_PLATFORM_BAIDU,
  SEM_PLATFORM_SOGOU,
  SEM_PLATFORM_QIHU
]

export default {
  name: 'qwt-copy-campaign-dialog',
  components: {
    BxIcon
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    platform: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      checkedPlatform: allPlatforms
        .filter(n => n !== this.platform)
        .shift()
    }
  },
  computed: {
    platforms() {
      return allPlatforms
        .filter(n => n !== this.platform)
        .map(i => ({
          id: i,
          name: semPlatformCn[String(i)]
        }))
    },
    title() {
      const { platform } = this
      const cn = semPlatformCn[String(platform)]
      return `${cn}渠道创建成功`
    }
  },
  methods: {
    getPlatformIcon(p) {
      return p === this.checkedPlatform
        ? 'checkcircle'
        : 'circle'
    },
    onClickPlatform(p) {
      this.checkedPlatform = p
    },
    cancel() {
      this.$emit('cancel')
    },
    copy() {
      this.$emit('copy', {
        platform: this.checkedPlatform
      })
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/var';

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;

  & > i {
    margin-right: 10px;
    color: var(--qwt-c-blue);
    font-size: 22px;
  }
}

.main {
  display: flex;
  flex-flow: column;

  & > h3 {
    padding-left: 20px;
  }

  & > li {
    display: flex;
    align-items: center;
    margin: 8px 0;
    padding-left: 90px;

    & > i {
      margin-right: 15px;
      font-size: 20px;
      cursor: pointer;
    }

    & > i.icon-checkcircle {
      color: var(--qwt-c-blue);
    }

    & > i.icon-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid #dcdfe6;
    }
  }

  & > footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
}
</style>

<style>
.qwt-copy-campaign-dialog {
  & .el-dialog__body {
    padding-top: 0;
  }
}
</style>

