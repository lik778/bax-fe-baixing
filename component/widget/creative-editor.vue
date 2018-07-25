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
            @change="onChangeTitle"
            size="small"
          />
        </text-limit-tip>
        <p class="auditing-prompt" v-if="creativeAuditing">您的推广物料正在审核中，预计审核时间3个工作日内，请您耐心等待。</p>
        <p class="auditing-prompt" v-else-if="campaignOffline">您当前的计划已下线，请重新开启投放。</p>
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
            @change="onChangeContent"
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
    creativeAuditing: {
      type: Boolean,
      default: false
    },
    campaignOffline: {
      type: Boolean,
      default: false
    },
    updatePromotion: {
      type: Boolean,
      default: false
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
    async onChangeTitle(title) {
      this.$emit('change-title', title)
      this._title = title
      try {
        await this.checkCreative(title, this._content, this.platforms)
        this.$emit('error', undefined)
      } catch (e) {
        this.$emit('error', e.message)
      }
    },
    async onChangeContent(content) {
      this.$emit('change-content', content)
      this._content = content
      try {
        await this.checkCreative(this._title, content, this.platforms)
        this.$emit('error', undefined)
      } catch (e) {
        this.$emit('error', e.message)
      }
    },
    async checkCreative(title, content, platforms) {
      // 校验逻辑：当为update页面时候，先测试传参是否为空，如果为空使用props的值
      if(this.updatePromotion) {
        if(!title) title = this.title
        if(!content) content = this.content
      }

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

<style scoped>
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
