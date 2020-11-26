<template>
  <div class="keyword-container">
    <section>
      <h3>关键词录入</h3>
      <div class="info">
        <div>
          说明： 点击<i class="el-icon-circle-plus-outline"></i
          >可以添加对应词语， 点击<i class="el-icon-edit"></i>可以编辑词语，
          点击<i class="el-icon-delete"></i>可以删除词语
        </div>
        <div class="mt-16">
          添加说明
          <p>A/C类词不支持修改</p>
          <p style="color: #FF6350">B/D类词数限制不低于10词不超过20词</p>
          <p style="color: #FF6350">单个词长度不低于2个字，不超过8个字</p>
          <p style="color: #FF6350">
            英文字符仅支持小写，输入大写时数据会被强制更改为小写
          </p>
        </div>
      </div>
    </section>
    <!-- TODO refactor form.keywords[idx] -->
    <div
      class="b-d-input-con"
      v-for="(opts, idx) in keywordOptions"
      :key="idx + '-' + form.keywords[idx]"
    >
      <div class="con-title" v-if="form.keywords.length > 1">
        <span v-html="genConTitle(form.keywords[idx], idx)" />
        <span class="actions">
          <el-button
            type="text"
            :icon="
              visible.keywordsIDX[idx]
                ? 'el-icon-arrow-up'
                : 'el-icon-arrow-down'
            "
            @click="() => openOneWordInputView(idx)"
            >{{ visible.keywordsIDX[idx] ? "收起" : "展开" }}</el-button
          >
        </span>
      </div>
      <transition name="fold-by-height">
        <div v-show="visible.keywordsIDX[idx]">
          <div class="view-container">
            <keyword-view
              v-for="(value, key) in opts"
              class="keyword-view"
              :key="key"
              :type="key"
              :title="value.title"
              :keywords="value.keywords"
              :isEdit="value.isEdit"
              @edit="(...args) => editKeyword(idx, ...args)"
              @delete="(...args) => deleteKeyword(idx, ...args)"
              @pop-keyword-input="
                (...args) => popKeywordInputDialog(idx, ...args)
              "
            ></keyword-view>
          </div>
          <keyword-input
            :visible="visible.input"
            :type="activeType"
            :info="getProp(idx, 'info')"
            :title="getProp(idx, 'inputTitle')"
            :placeholder="getProp(idx, 'placeholder')"
            @words="(...args) => updateKeywords(idx, ...args)"
            @close="visible.input = false"
          />
          <div class="expand-tip size-13">
            <div>组合逻辑：A+C、B+C、C+D、A+B+C、A+C+D、B+C+D、A+B+C+D；</div>
            <div>如：上海（A）专业的（B）空调维修（C）多少钱（D）</div>
          </div>
        </div>
      </transition>
    </div>
    <div class="action-area">
      <p v-show="!handleDisabled">
        当前备选词数量：<strong>{{ wordNum }}</strong
        >个
      </p>
      <p style="color: #FF6350" v-if="errorTips">{{ errorTips }}</p>
      <el-button
        type="primary"
        :loading="loading.submit"
        @click="sumbitWords"
        :disabled="handleDisabled || preventSumbit"
        size="medium"
        >{{
          loading.submit ? "拓词中..." : isEdit ? "更新优选" : "提交优选"
        }}</el-button
      >
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      title="提示"
      :visible.sync="visible.successDialog"
    >
      <div class="success-dialog-box">
        <img
          src="//file.baixing.net/202010/d4ade9d26b0af9fee07c21665a2de323.png"
        />
        <p>
          提交成功，后台正在为您优选关键词，稍后请在【查词记录】页面查看进展。
        </p>
        <router-link :to="{ name: 'qc-word-list' }">
          <el-button type="primary" size="medium">确定</el-button>
        </router-link>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import clone from "clone";

import { createPreferredWords, updatePromoteWords } from "api/qianci";
import { API_SUCCESS, API_CANNOT_PASS_QUALITY_CHECK } from "constant/api";
import KeywordView from "./view";
import KeywordInput from "./input";
import keywordOptions from "./keyword-options";
import { qcWordAll } from "util";

const validatekeywordsLen = typeObj => {
  const { wordsLimit, keywords, type } = typeObj;
  const len = keywords.length;
  if (len < wordsLimit[0]) return `${type}类词数限制不低于${wordsLimit[0]}`;
  if (len > wordsLimit[1]) return `${type}类词数限制不高于${wordsLimit[1]}`;
};

export default {
  name: "Keyword",
  props: {
    form: {
      type: Object,
      required: false,
      default() {
        return [];
      }
    },
    originKeywords: {
      type: Object,
      required: false,
      default() {
        return Object.values(keywordOptions).reduce((curr, item) => {
          curr[item.keywordsAlias] = [];
          return curr;
        }, {});
      }
    },
    promote: {
      type: Object
    },
    isEdit: {
      type: Boolean
    }
  },
  data() {
    return {
      visible: {
        input: false,
        keywordsIDX: {
          0: true,
          1: false,
          2: false
        },
        successDialog: false
      },
      keywordOptions: [],
      activeType: "A",
      loading: {
        submit: false
      },
      errorTips: "",
      preventSumbit: false
    };
  },
  computed: {
    handleDisabled() {
      const isDisabled = opts => {
        const Blength = opts.B.keywords.length;
        const limitB = opts.B.wordsLimit;
        const Dlength = opts.D.keywords.length;
        const limitD = opts.D.wordsLimit;
        return !(
          Blength >= limitB[0] &&
          Blength <= limitB[1] &&
          Dlength >= limitD[0] &&
          Dlength <= limitD[1]
        );
      };
      return !!this.keywordOptions.find(x => isDisabled(x));
    },
    wordNum() {
      const countOne = x =>
        qcWordAll(
          ["A", "B", "C", "D"].reduce(
            (h, c) => ((h[c] = x[c].keywords.length), h),
            {}
          )
        );
      return this.keywordOptions.reduce((h, c) => h + countOne(c), 0);
    }
  },
  components: {
    KeywordInput,
    KeywordView
  },
  created() {
    this.initKeywordOptions();
  },
  methods: {
    initKeywordOptions() {
      this.keywordOptions = (this.form.keywords || [])
        .map(x => clone(keywordOptions))
        .map((opts, idx) => {
          Object.keys(opts).forEach(x => {
            if (x === "A") {
              opts.A.keywords = this.form.areas.reduce((t, c) => {
                t.push(c.name);
                return t.concat(c.cities);
              }, []);
            } else if (x === "C") {
              opts.C.keywords = [this.form.keywords[idx]];
            }
          });
          Object.values(opts).map(item => {
            opts[item.type].placeholder = item.placeholder.replace(
              /[,，]]*/g,
              "<br/>"
            );
          });
          return opts;
        });
    },
    getProp(idx, prop) {
      const existKeywordObj = this.keywordOptions[idx][this.activeType];
      return existKeywordObj && existKeywordObj[prop];
    },
    popKeywordInputDialog(idx, type) {
      this.visible.input = true;
      this.activeType = type;
    },
    updateKeywords(idx, obj) {
      let { type, words } = obj;
      const wordLenLimit = this.keywordOptions[idx][type].wordLenLimit;

      words = words
        .trim()
        .split(/[\n，,\s]]*/g)
        .map(row => row.toLocaleLowerCase().trim())
        .filter(
          row =>
            row !== "" &&
            row.length >= wordLenLimit[0] &&
            row.length <= wordLenLimit[1]
        );

      let keywords = this.keywordOptions[idx][type].keywords;

      keywords = [...new Set(words.concat(keywords))];
      this.keywordOptions[idx][type].keywords = keywords;
    },
    editKeyword(idx, obj) {
      const { type, index } = obj;
      const wordLenLimit = this.keywordOptions[idx][type].wordLenLimit;

      this.$prompt("", "编辑词语", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputValue: this.keywordOptions[idx][type].keywords[index]
      })
        .then(({ value }) => {
          const keywords = this.keywordOptions[idx][type].keywords;
          if (keywords.includes(value)) {
            return this.$message.error("已存在该关键词，请修改重新提交");
          }
          if (
            value.toLocaleLowerCase() &&
            keywords
              .map(k => k.toLocaleLowerCase())
              .includes(value.toLocaleLowerCase())
          ) {
            return this.$message.error(
              "百度投放仅支持小写，输入大写时数据会被强制更改为小写，输入重复"
            );
          }
          if (
            value.length < wordLenLimit[0] ||
            value.length > wordLenLimit[1]
          ) {
            return this.$message.error(
              `单个词长度不少于${wordLenLimit[0]}个字, 不超过${wordLenLimit[1]}个字`
            );
          }
          this.keywordOptions[idx][type].keywords.splice(index, 1, value);
        })
        .catch(() => {});
    },
    deleteKeyword(idx, obj) {
      const { type, index } = obj;
      this.keywordOptions[idx][type].keywords.splice(index, 1);
    },
    async sumbitWords() {
      const { sales_id: salesId, user_id: targetUserId } = this.$route.query;
      const { keywords, areas } = this.form;
      const coreWordInfos = Array(this.keywordOptions.length)
        .fill("")
        .map((x, i) => ({
          coreWord: keywords[i],
          prefixWords: this.keywordOptions[i].B.keywords,
          suffixWords: this.keywordOptions[i].D.keywords
        }));
      const params = {
        provinces: areas.map(x => x.en),
        coreWordInfos,
        salesId,
        targetUserId
      };

      this.loading.submit = true;
      if (this.isEdit) {
        params.id = this.promote.id;
      }
      const handleFunc = this.isEdit
        ? updatePromoteWords
        : createPreferredWords;
      const { code, message } = await handleFunc(params);
      if (code === API_SUCCESS) {
        this.visible.successDialog = true;
      } else if (code === API_CANNOT_PASS_QUALITY_CHECK) {
        this.errorTips = message;
      } else {
        Message.warning(message);
      }
      this.loading.submit = false;
    },
    genConTitle(word, idx) {
      return `<div>${idx +
        1}、请填写关键词 <span class="warning">${word}</span> 的（B/D) 类词：</div>`;
    },
    openOneWordInputView(idx) {
      const enableMulti = true;
      if (enableMulti) {
        this.visible.keywordsIDX[idx] = !this.visible.keywordsIDX[idx];
      } else {
        this.visible.keywordsIDX = Object.keys(this.visible.keywordsIDX).reduce(
          (h, c) => ((h[c] = false), h),
          {}
        );
        this.visible.keywordsIDX[idx] = true;
      }
    }
  },
  watch: {
    wordNum(newVal, oldVal) {
      // 处理编辑逻辑
      if (oldVal !== 0 && this.isEdit) {
        this.preventSumbit = false;
      }
    },
    promote: {
      deep: true,
      immediate: true,
      handler(values) {
        // TODO
        // if (values) {
        //   const { coreWord, prefixWords, suffixWords } = values;
        //   this.keywordOptions.C.keywords = [coreWord];
        //   this.keywordOptions.B.keywords = prefixWords;
        //   this.keywordOptions.D.keywords = suffixWords;
        //   this.preventSumbit = true;
        // }
      }
    },
    originKeywords(newVal) {
      for (let key in this.keywordOptions) {
        const { keywordsAlias, keywords } = this.keywordOptions[key];
        this.keywordOptions[key].keywords = [
          ...new Set(keywords.concat(this.originKeywords[keywordsAlias]))
        ];
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.b-d-input-con {
  margin-top: 30px;

  & .actions {
    margin-left: 1em;

    & > .el-button {
      color: #00a5ff;
    }
  }
}
.view-container {
  display: flex;
  align-items: center;
  margin-top: 14px;

  & > div:not(:last-child) {
    margin-right: 16px;
  }
}
.keyword-container {
  color: #6a778c;
  margin-top: 28px;
  & h3 {
    position: relative;
    margin-bottom: 20px;
    font-weight: 700;
    &.not-required:after {
      display: none;
    }
    &:after {
      content: "*";
      position: absolute;
      color: red;
      font-size: 12px;
      top: -2px;
      margin-left: 4px;
    }
  }

  & .info {
    font-size: 13px;
    color: inherit;
    & > p {
      text-indent: 1em;
    }
    & i {
      font-size: 16px;
      margin: 0 3px;
    }
  }
  & .mt-16 {
    margin-top: 16px;
  }
  & .expand-tip {
    margin-top: 33px;
  }
  & .size-13 {
    font-size: 13px;
  }
  & .action-area {
    margin-top: 45px;
    & > p {
      font-size: 14px;
      margin-bottom: 25px;
      & strong {
        font-size: 20px;
        color: #ff6350;
      }
    }
  }
}
.success-dialog-box {
  text-align: center;
  & > img {
    width: 42px;
    height: 42px;
  }
  & > p {
    margin-top: 20px;
    margin-bottom: 47px;
  }
}
</style>
