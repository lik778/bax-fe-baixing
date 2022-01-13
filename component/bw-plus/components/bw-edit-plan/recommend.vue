<template>
    <div class="recommend-box">
        <el-card class="box-card">
        <p class="underline">智能推荐：</p>
        <p class="text">基于您的关键词行业已为您推荐以下创意，应用后您可根据需求调整推广标题和内容</p>
        <i class="el-icon-close closeClick" @click="close"></i>
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <p class="title underline"><span class="text-red underline">自动焊机</span>就找上海轶煌，厂家直销，型号齐全</p>
                    <p>公司主营<span class="text-red">便携式自动焊机</span>、电焊机等，20年专业生产经验，累计服务200家大中型建筑建材企业，规格型号全，支持定制，价格透明合理，欢迎新老客户咨询。</p>
                    <p class="bottom"><span class="text-grey">百姓网</span><span class="text-blue">广告</span></p>
                    <div class="mask">
                        <el-button class="btn">应用</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <p class="title underline">专业<span class="text-red underline">螺纹钢</span>厂家，按需定做，交付快，价格透明</p>
                    <p>上海昶睿金属主要经营螺纹钢,镀锌方管,无缝方管,螺旋管等,专业技术团队，多年行业经验，产品难蚀不易锈，稳定性强，现在咨询有优惠！</p>
                    <p class="bottom"><span class="text-grey">百姓网</span><span class="text-blue">广告</span></p>
                    <div class="mask">
                        <el-button class="btn">应用</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <p class="title underline"><span class="text-red underline">除尘设备</span>生产厂家，效率高，风量大，可定制</p>
                    <p>上海缘威环保专业从事除尘设备的研发、生产和销售，模块化安装除尘效率好，国处理风量大结构紧凑,约占地面积,密封性好故障率低,使用寿命长，经济效益好!</p>
                    <p class="bottom"><span class="text-grey">百姓网</span><span class="text-blue">广告</span></p>
                    <div class="mask">
                        <el-button class="btn">应用</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
  name: 'recommend',
  methods: {
    close () {
      this.$emit('close')
    }
  }

}
</script>
<style lang="scss" scoped>
.recommend-box{
    position: relative;
    font-size: 14px;
    padding: 15px 0px;
    .text{
        font-size: 14px;
        padding: 8px 0px;
    }
    width: 60%;
    min-width: 1000px;
    .closeClick{
        position: absolute;
        right: 20px;
        top: 30px;
        cursor: pointer;
    }
    .grid-content:hover{
        .mask{
            z-index: 100;
        }
    }
    .grid-content{
        background-color: #ededed;
        margin: 20px 0px;
        padding: 3px;
        height: 180px;
        position: relative;
        .mask{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            background-color: rgba(243, 243, 243, 0.5);
            z-index: -100;
            .btn{
                height: 40px;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                margin: auto;
            }
        }
        >:nth-child(2){
            margin: 20px 0;
        }
        .underline{
            text-decoration-line: underline;
            text-decoration-color: currentColor;
        }
        .title{
            padding: 10px 0 0 0;
            color: #409EFF;
        }
        .text-red{
            color: #fc3c3c;
        }
        .text-blue{
            color: #409EFF;;
        }
        .text-grey{
            color: #909399;
            margin-right: 10px;
        }
        .bottom{
            position: absolute;
            bottom: 10px;
            left: 3px;
        }
    }
}
</style>
