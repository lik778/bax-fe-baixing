<template>
  <section class="editor">
    <promotion-creative-tip />
    <div>
      <aside>推广标题:</aside>
      <span>
        <text-limit-tip
          :rest="titleMaxLen - title.length"
          :current="title.length"
          :min="titleMinLen">
          <el-input slot="input" type="text" style="width: 420px"
            :placeholder="`请输入标题 ~ (字数限制为${titleMinLen}-${titleMaxLen}个字)`"
            :disabled="!isCreativeEditable || isFormReadonly"
            :value="title"
            @change="onChangeTitle"
          />
        </text-limit-tip>
        <p
          v-if="titleTip"
          class="authing-tip"
        >
          {{ titleTip }}
        </p>
      </span>
    </div>
    <div>
      <aside style="align-items: flex-start; padding-top: 5px;">
        推广内容:
      </aside>
      <span>
        <text-limit-tip
          :rest="contentMaxLen - content.length"
          :current="content.length"
          :min="contentMinLen">
          <el-input slot="input" type="textarea"
            :rows="5" style="width: 420px"
            :placeholder="`请输入内容 ~ (字数限制为${contentMinLen}-${contentMaxLen}个字)`"
            :disabled="!isCreativeEditable || isFormReadonly"
            :value="content"
            @change="onChangeContent"
          />
        </text-limit-tip>
      </span>
      <p class="authing-tip-2">
        {{ refuseReason }}
      </p>
    </div>
    <footer v-if="!isFormReadonly">
      <el-button
        :disabled="checkCreativeBtnDisabled"
        type="primary"
        @click="checkCreativeContent"
      >
        检查推广是否可用
      </el-button>
    </footer>
  </section>
</template>

<script>
import PromotionCreativeTip from './promotion-creative-tip'
import TextLimitTip from './text-limit-tip'

import { Message } from 'element-ui'

import {
  SEM_PLATFORM_SHENMA
} from 'constant/fengming'

import {
  checkCreativeContent
} from 'api/fengming'

export default {
  name: 'qwt-creative-editor',
  components: {
    PromotionCreativeTip,
    TextLimitTip
  },
  props: {
    checkCreativeBtnDisabled: {
      type: Boolean,
      default: false
    },
    isCreativeEditable: {
      type: Boolean,
      default: true
    },
    isFormReadonly: {
      type: Boolean,
      default: false
    },
    refuseReason: {
      type: String,
      default: ''
    },
    titleTip: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    platform: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      SEM_PLATFORM_SHENMA
    }
  },
  computed: {
    titleMinLen() {
      const { platform } = this
      if (platform === SEM_PLATFORM_SHENMA) {
        return 8
      }

      return 9
    },
    titleMaxLen() {
      const { platform } = this
      if (platform === SEM_PLATFORM_SHENMA) {
        return 35
      }

      return 25
    },
    contentMinLen() {
      const { platform } = this
      if (platform === SEM_PLATFORM_SHENMA) {
        return 8
      }

      return 9
    },
    contentMaxLen() {
      const { platform } = this
      if (platform === SEM_PLATFORM_SHENMA) {
        return 68
      }

      return 40
    }
  },
  methods: {
    onChangeTitle(v) {
      this.$emit('change-title', v)
    },
    onChangeContent(v) {
      this.$emit('change-content', v)
    },
    async checkCreativeContent() {
      const {
        platform,
        content,
        title
      } = this

      if (!content) {
        return Message.error('请填写推广内容')
      }

      if (!title) {
        return Message.error('请填写推广标题')
      }

      const data = await checkCreativeContent({
        creativeContent: content,
        creativeTitle: title,
        platform
      })

      if (!data.result) {
        Message.success(data.hint)
      } else {
        return Message.error(data.hint)
      }
    }
  }
}
</script>

<style scoped>
.authing-tip {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #ff4401;
}

.authing-tip-2 {
  margin-left: 5px;
  font-size: 12px;
  line-height: 1.75;
  color: #ff4401;
}

.editor {
  margin-bottom: 30px;
  padding-bottom: 10px;

  & > header {
    color: #6a778c;
  }

  & > div {
    display: flex;
    margin: 20px 0;

    & > aside:first-child {
      display: flex;
      align-items: center;
      min-width: 70px;
      margin-right: 20px;
      color: #6a778c;
      font-size: 14px;
    }
  }
}
</style>
