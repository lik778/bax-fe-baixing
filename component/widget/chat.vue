<template>
  <div class="widget">
    <div class="chat-button" @click="initChat">
      <i class="el-icon-service"></i>
    </div>
    <div class="chat-container" v-show="visible">

      <div class="header">
        <span class="title"><i class="el-icon-service"></i>在线客服 | <small>您的在线服务专家</small></span>
        <i class="el-icon-close" @click="visible = false"></i>
      </div>

      <div class="content" ref="content">
        <div v-for="(message, index) in messages" :key="index">
          <div class="chat-message"
            :class="message.type"
            v-html="message.message">
          </div>
        </div>
      </div>

      <div class="footer">
        <input v-model.trim="userInput" @keyup.enter="send" placeholder="输入您的问题"/>
        <button class="button" size="large" @click="send">发送问题</button>
      </div>

    </div>
  </div>
</template>

<script>
import { sendQuestion } from 'api/fengming'

const keywords = [
  '站外推广', '充值', '买', '购买', '收费', '扣费', '行业', '限制', '创建', '建', '创意', '多久', '多少钱', '出价', '价格', '扣费', '关键词', '审核', '不通过', '官网', '预算', '状态', '余额不足', '不足', '修改', '改'
]
const selectedQuestions = [
  'Q：什么是搜索通？', 'Q：搜索通有什么产品？', 'Q：怎么充值？在哪里买？', 'Q：什么是站外推广？', 'Q：站外推广如何收费？', 'Q: 什么是精品官网？', 'Q: 精品官网在哪里买?'
]
export default {

  data () {
    return {
      qa: {},
      userInput: '',
      messages: [], // {message: '', type: 'user|promote|answer'}
      visible: false
    }
  },
  computed: {
    questions () {
      return Object.keys(this.qa)
    }
  },
  methods: {
    send () {
      if (!this.userInput) return

      this.messages.push({ message: this.userInput, type: 'user' })
      const input = this.userInput
      this.userInput = ''

      sendQuestion(input)

      // extract keywords
      const inputKeywords = keywords.filter(k => input.includes(k))

      setTimeout(() => {
        let message = this.questions
          .filter(q => inputKeywords.some(k => q.indexOf(k) > -1))
          .map(q => highlight(q, inputKeywords))
          .map(wrapQuestion)
          .join('')

        if (message) {
          message = '<p>匹配到以下问题，点击任意一项</p>' + message
        } else {
          message = getRandom(this.questions, 5).map(wrapQuestion).join('')
          message = '<p>没有检索到与您问题匹配的答案，您可能关心如下问题:</p>' + message
        }

        this.messages.push({ message, type: 'promote' })
      }, 500)
    },
    async initChat () {
      this.visible = true
      // 如果qa为初始值{}时，加载数据
      if (Object.keys(this.qa).length) return

      const text = await fetch('/qa').then(r => r.text())
      const html = document.createElement('html')
      html.innerHTML = text
      const ids = [
        '#doc-sec-1',
        '#doc-sec-2',
        '#doc-sec-3',
        '#doc-sec-4-1',
        '#doc-sec-4-2',
        '#doc-sec-4-3',
        '#doc-sec-4-4',
        '#doc-sec-4-5',
        '#doc-sec-4-6',
        '#doc-sec-4-7',
        '#doc-sec-5',
        '#doc-sec-6-1',
        '#doc-sec-6-2',
        '#doc-sec-6-3'
      ]
      this.qa = getQa(html, ids)

      let message = selectedQuestions.map(wrapQuestion).join('')
      message = '<p>您可能关心以下问题</p>' + message
      this.messages.push({ message, type: 'promote' })

      this.$refs.content.addEventListener('click', evt => {
        if (evt.target.parentElement.classList.contains('promote') ||
        evt.target.parentElement.parentElement.classList.contains('promote')) {
          // click P or EM
          const q = evt.target.nodeName === 'P' ? evt.target.innerText : evt.target.parentElement.innerText
          const a = this.qa[q]
          this.messages.push({ message: q, type: 'user' })
          setTimeout(() => {
            this.messages.push({ message: a, type: 'answer' })
          }, 500)
        }
      })
    }
  },
  watch: {
    messages () {
      this.$nextTick(() => {
        const content = this.$refs.content
        content.scrollTop = content.scrollHeight
      })
    }
  }
}
function getQa (dom, ids) {
  const qa = {}
  for (const id of ids) {
    const section = dom.querySelector(id)
    if (section) {
      const questions = section.querySelectorAll('.doc-question')
      for (const q of questions) {
        const key = q.innerHTML.trim()
        const value = q.nextElementSibling.innerHTML
        qa[key] = value
      }
    }
  }
  return qa
}

function wrapQuestion (q) {
  return `<p class="link" >${q}</p>`
}

function getRandom (array, n) {
  if (array.length === 0) return array
  const r = []
  for (let i = 0; i < n; i++) {
    r.push(array[Math.floor(Math.random() * array.length)])
  }
  return r
}

function highlight (msg, keywords) {
  let r = msg
  for (const keyword of keywords) {
    r = r.replace(new RegExp(keyword, 'g'), '<em>' + keyword + '</em>')
  }
  return r
}

</script>

<style lang="scss" scoped>
.chat-button {
  border: 1px solid #ccc;
  height: 52px;
  width: 52px;
  color: #999;
  font-size: 2.5em;
  background-color: #fff;
  text-align: center;
  line-height: 52px;
  cursor: pointer;
  border-radius: 4px;
  z-index: 100;
}
.chat-container {
  z-index: 100;
  position: fixed;
  bottom: 20px;
  right: 90px;
  width: 600px;
  height: 500px;
  border: 1px solid #eee;
  background-color: #f9f9f9;
  box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.1);

  & > .header {
    position: absolute;
    top: 0;
    width: 100%;
    height: 56px;
    background-color: #fff;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.08);

    & > .title {
      margin-left: 20px;
      line-height: 56px;
      font-size: 14px;
      color: gray;

      & > .el-icon-service {
        position: relative;
        top: 10px;
        font-size: 3em;
        color: #15a4fa;
        margin-right: 10px;
      }
    }
    & > .el-icon-close {
      float: right;
      margin-right: 20px;
      color: #ccc;
      font-size: 1.5em;
      position: relative;
      top: 15px;
      cursor: pointer;
    }
  }

  & > .content {
    height: 500px;
    overflow-y: auto;
    padding: 65px 30px 80px;

    & > div {
      clear: both;

      & > .chat-message {
        display: inline-block;
        padding: 10px;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #eee;
        font-size: 14px;
        margin-bottom: 10px;

        &.user {
          float: right;
          background-color: #15a4fa;
          color: #fff;
        }

        &.promote /deep/ p.link {
          color: #5482c4;
          cursor: pointer;

          & > em {
            color: #ff7533;
            font-style: normal;
          }
        }

        &.answer {
          & /deep/ table th,
          & /deep/ table td {
            border: 1px solid gray;
          }

          & /deep/ img {
            max-width: 500px;
            margin: 5px;
          }
          & /deep/ ol,
          & /deep/ ul {
            padding-left: 20px;
          }
          & /deep/ ol > li,
          & /deep/ ul > li {
            list-style: disc;
          }
        }
      }
    }
  }

  & > .footer {
    position: absolute;
    bottom: -2px;
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-top: 1px solid #eee;
    padding: 14px 30px;

    & > input {
      margin: auto;
      width: 100%;
      border: 1px solid #eee;
      height: 40px;
      padding-left: 20px;
      background: #f9f9f9;
      border-radius: 4px;
      font-size: 14px;
    }

    & > .button {
      width: 100px;
      height: 40px;
      background-color: #15a4fa;
      color: white;
      border-radius: 4px;
      margin-left: 14px;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
