<template>
  <el-dialog title="批量添加关键词" :visible.sync="show" width="40%" class="qwt-add-keyword-dialog"
    :before-close="handleClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="header">
      <div class="search-container">
        <el-input class="search" placeholder="请批量添加关键词" size="small" v-model="search"></el-input>
        <el-button class="add-btn" type="primary" size="small" @click="addWordList">批量添加</el-button>
      </div>
      <div class="tip">提示: 请用逗号区分关键词进行批量关键词添加，如合肥家政服务公司，合肥月嫂，合肥钟点工</div>
    </div>
    <div class="content" v-if="keywords">
      <div class="sec" v-if="keywords.normalList && keywords.normalList.length>0">
        <div class="sec-title">成功添加关键词</div>
        <div class="sec-content">
          <el-tag type="success" v-for="item in keywords.normalList" :key="item.word"
            class="tag-item">{{item.word}}
          </el-tag>
        </div>
      </div>
      <div class="sec" v-if="keywords.bannedList && keywords.bannedList.length>0">
        <div class="sec-title">因投放平台限制，以下关键词无法添加，请修改：</div>
        <div class="sec-content">
          <el-tag type="danger" v-for="item in keywords.bannedList" :key="item.word"
            class="tag-item">{{item.word}}
          </el-tag>
        </div>
      </div>
    </div>
    <span slot="footer" class="footer">
      <el-button type="primary" @click="handleConfirm" size="small">确认
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { recommendByWordList } from 'api/fengming'
import { isObj } from 'util'
import { MIN_WORD_PRICE } from 'constant/keyword'
import { Message} from 'element-ui'
import clone from 'clone'

export default {
  name:'qwt-add-keyword-list',
  props:{
    show:{
      type:Boolean,
      required:true
    },
    isUpdateQwt:{
      type:Boolean,
      required:true,
      default:false
    },
    promotion:{
      type:Object,
      required:true
    }
  },
  data(){
    return {
      keywords: null,
      search: '' 
    }
  },
  methods:{
    handleClose() {
      this.search = ''
      this.keywords = null
      this.$emit('close')
    },
    handleConfirm() {
      this.$emit('update-keywords',this.keywords)
    },
    async recommendKeywordsList (word, opts) {
      const result = await recommendByWordList(word, opts)
      if(result && isObj(result)){
        for(let key in result){
          if(Array.isArray(result[key])){
            result[key] = result[key].map(word=>{
              const { price: serverPrice } = word
              let price = serverPrice
              if (price < MIN_WORD_PRICE) {
                price = MIN_WORD_PRICE
              }
              return {
                ...word,
                serverPrice,
                price,// override price, price is display value
                value: word.word
              }
            })
          }
        } 
      }
      return result
    },
    async addWordList() {
      // 更新计划：先取消搜索关键词，设为原来的全量关键词
      if(this.isUpdateQwt) this.$parent.getCampaignWordsDefault()

      // 空字符校验
      if(this.search.trim()===''){
        Message.warning('还未添加关键词')
        return 
      }

      // 正则校验
      // let reg = /^0-9a-zA-Z，,$/ig
      // if(!reg.test(this.search)){
      //   Message.warning('关键词不合法')
      //   return
      // }

      // 数组去重并去掉首尾的逗号
      let words = this.search.trim().split(/[，,]]*/g)
      words = Array.from(new Set(words.map(row=>{
        return row.trim()
      }).filter(row=> row!== '')))
      if(words.length>100){
        Message.warning('每次最多支持上传100个关键词')
        return
      }

      // 判断关键词已存在
      let keywords = this.promotion.keywords
      let normalList = (this.keywords && this.keywords.normalList) || []
      let bannedList = (this.keywords && this.keywords.bannedList) || []
      normalList = this.promotion.keywords.concat(normalList)
      for(let i=0;i<normalList.length;i++){
        let row = normalList[i]
        if(words.includes(row.word)){
          return Message.warning(`${row.word}该关键词已存在`)
        }
      }
      for(let i=0;i<bannedList.length;i++){
        let row = bannedList[i]
        if(words.includes(row.word)){
          return Message.warning(`因平台限制，${row.word}无法添加，请修改`)
        }
      }

      // 拼接keywords
      let newWords
      if(this.isUpdateQwt){
        const { campaignId } = this.promotion
        newWords = await this.recommendKeywordsList(words,{campaignId})
      }else{
        const { areas,sources } = this.promotion
        newWords = await this.recommendKeywordsList(words,{areas,sources})
      }

      if(this.keywords){
        for(let key in this.keywords){
          this.$set(this.keywords,key,this.keywords[key].concat(newWords[key]))
        }
      }else{
        this.keywords = newWords
      }
      this.search = ''
    },
  }
}
</script>

<style lang="postcss" scoped>
.qwt-add-keyword-dialog {
  & .header {
    & .search-container {
      display: flex;
      align-items: center;
    }
    & .search {
      width: 300px;
    }
    & .add-btn {
      margin-left: 20px;
    }
    & .tip {
      font-size: 12px;
      margin-top: 10px;
      color: #ff7533;
    }
  }
  & .content {
    margin-top: 20px;
    & .sec {
      font-weight: bold;
      font-size: 14px;
      margin-top: 20px;
    }
    & .sec-title {
      margin-bottom: 10px;
    }
    & .tag-item {
      margin-right: 5px;
      margin-top: 8px;
    }
  }
}
</style>