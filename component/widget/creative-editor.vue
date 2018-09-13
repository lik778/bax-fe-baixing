<template>
  <section class="editor">
    <div class="creative-title-container">
      <aside>推广标题:</aside>
      <span>
        <text-limit-tip
          :rest="titleMaxLen - title.length"
          :current="title.length"
          :min="titleMinLen">
          <el-input slot="input" type="text" style="width: 530px"
            :placeholder="`请输入标题 ~ (字数限制为${titleMinLen}-${titleMaxLen}个字)`"
            :disabled="disabled"
            :value="title"
            @change="onCreativeChange('title', $event)"
            @input="onInput('title', $event)"
            size="small"
          />
        </text-limit-tip>
        <p class="auditing-prompt" v-if="creativeStatus === CREATIVE_STATUS_REJECT">
          {{statusText}}
        </p>
        <p class="auditing-prompt" v-else-if="creativeStatus === CREATIVE_STATUS_PENDING">
          您的推广物料正在审核中，预计审核时间3个工作日内，请您耐心等待。
        </p>
        <p class="auditing-prompt" v-else-if="campaignOffline">
          您当前的计划已下线，请重新开启投放。
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
            :rows="4" style="width: 530px"
            :placeholder="`请输入内容 ~ (字数限制为${contentMinLen}-${contentMaxLen}个字)`"
            :disabled="disabled"
            :value="content"
            @change="onCreativeChange('content', $event)"
            @input="onInput('content', $event)"
          />
        </text-limit-tip>
      </span>
    </div>
  </section>
</template>

<script>
import TextLimitTip from './text-limit-tip'
import {
  getCreativeContentLenLimit,
  getCreativeTitleLenLimit
} from 'util/campaign'

import {
  checkCreativeContent
} from 'api/fengming'

import {
  CREATIVE_STATUS_REJECT,
  CREATIVE_STATUS_PENDING,
} from 'constant/fengming'


export default {
  name: 'qwt-creative-editor',
  components: {
    TextLimitTip
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    platforms: {
      type: Array,
      required: true
    },
    creativeStatus: {
      type: Number
    },
    statusText: {
      type: String
    },
    campaignOffline: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      CREATIVE_STATUS_REJECT,
      CREATIVE_STATUS_PENDING
    }
  },
  computed: {
    titleMinLen() {
      const { platforms } = this
      return getCreativeTitleLenLimit(platforms)[0]
    },
    titleMaxLen() {
      const { platforms } = this
      return getCreativeTitleLenLimit(platforms)[1]
    },
    contentMinLen() {
      const { platforms } = this
      return getCreativeContentLenLimit(platforms)[0]
    },
    contentMaxLen() {
      const { platforms } = this
      return getCreativeContentLenLimit(platforms)[1]
    }
  },
  methods: {
    onInput(type, value) {
      const defaultCreativeValues = {
          title: this.title,
          content: this.content
      }
      const creativeValues = {
        ...defaultCreativeValues,
        [type]: value
      }
      this.$emit('change', creativeValues)
    },
    async onCreativeChange(type, value) {
      const defaultCreativeValues = {
          title: this.title,
          content: this.content
      }
      const creativeValues = {
        ...defaultCreativeValues,
        [type]: value
      }
      try {
        await this.checkCreative(creativeValues.title, creativeValues.content, this.platforms)
        this.$emit('error', undefined)
      } catch (e) {
        this.$emit('error', e.message)
      }
    },
    async checkCreative(title, content, platforms) {
      if (!title || !content) {
        return
      } else if(this.titleMinLen > title.length || this.titleMaxLen < title.length) {
        return
      } else if (this.contentMinLen > content.length || this.contentMaxLen < content.length) {
        return
      }

      const data = await checkCreativeContent({
        creativeContent: content,
        creativeTitle: title,
        platforms
      })

      if (data.result) {
        throw Error(data.hint)
      }

      // 全部校验成功success弹框
      this.$message({
        message: '推广设置检查通过',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="postcss" scoped>
.editor {
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
.creative-title-container {
  display: inline-block;
  & span {
    display: flex;
    align-items: center;
  }
  & .auditing-prompt {
    font-size: 12px;
    color: #ff4401;
    margin-left: 10px;
  }
}

</style>
