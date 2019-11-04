<template>
  <el-dialog class="audit-reject-reason-dialog" title="常见审核驳回原因" width="40%" :visible.sync="show"
    :before-close="handleClose">
    <ol class="content">
      <li v-for="(item,index) in infoList" :key="index">{{item}}</li>
    </ol>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
const INFO_LIST = [
  '禁止发布含有特殊符号的推广，如◆、◇、★、!!!!、￥￥￥等;',
  '百度渠道禁止发布含有联系方式的推广（包括电话号码、微信、网址等);',
  '禁止发布涉及禁发行业的推广（禁发行业包括：丽人服务、投资理财、按摩足浴、保险服务、KTV/酒吧招聘、保健按摩、模特招聘、学生兼职、化妆品&保健品出售、食品出售、医疗服务、期刊出版等。360渠道禁止发布招商加盟行业推广、神马渠道禁止发布搬家&贷款行业推广)，360与搜狗有各自特殊禁发行业，此处需要业务侧同学设计下禁发行业展现形式;',
  '禁止发布未经授权，擅自使用他人商标、版权内容等，以及其他侵犯他人合法知识产权的推广;',
  '禁止发布包含赌博、彩票、竞猜等信息的推广;',
  '禁止发布其他任何违反国家法律法规的推广内容;'
]
export default {
  props:{
    show:{
      type: Boolean,
      required: true,
      default: false
    }
  },
  data(){
    return {
      infoList: INFO_LIST
    }
  },
  methods:{
    handleClose(){
      this.$emit('close')
    }
  }
}
</script>

<style lang="postcss" scoped>
.audit-reject-reason-dialog {
  & .content {
    padding: 0 20px 0 10px;
    line-height: 20px;
    & li{
      margin-bottom: 8px;
      list-style: decimal inside;
      text-align: justify;
    }
  }
}
</style>