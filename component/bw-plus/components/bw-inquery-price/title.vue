<template>
    <div class="bw-title">
        <div class="title">
            <h4>{{title}}</h4>
            <span v-if="!!extra" class="extra-title">{{extra}}</span>
        </div>
        <div v-if="!!subTitle" class="sub-title">
            <h5>{{subTitle}}</h5>
            <span v-if="!!subExtra" class="subExtra-title">{{subExtra}}</span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    title: {
      type: String,
      default: '',
      require: false
    },
    extra: {
      type: String,
      default: '',
      require: false
    },
    subTitle: {
      type: String,
      default: '',
      require: false
    },
    subExtra: {
      type: String,
      default: '',
      require: false
    }
  }
}
</script>

<style lang="scss" scoped>
    .title{
        padding: 8px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        h4{
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #FF6350;
            font-weight: 500;
        }
        .extra-title{
            font-size: 14px;
            color: #999999;
            margin-left: 6px;
        }
    }
    .sub-title{
       padding:0px 8px 8px 8px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        h5{
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #666666;
            font-weight: 400;
        }
        .subExtra-title{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #999999;
            margin-left: 6px;
        }
    }
    .bw-title{
        margin: 10px 0;
    }
</style>
