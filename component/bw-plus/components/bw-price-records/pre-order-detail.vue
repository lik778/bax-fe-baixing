<template>
    <el-dialog
    title="提单确认"
    :visible.sync="dialogVisible"
    width="40%"
    @close="cancel"
    >
    <el-form ref="form" label-width="100px">
        <el-form-item class="pre-info-item" label="关键词：">
            {{preInfo.keywords.join("、")}}
        </el-form-item>
        <el-form-item class="pre-info-item" label="推广城市：">
            {{citiesFormater(preInfo.cities)}}
        </el-form-item>
        <el-form-item class="pre-info-item" label="推广平台：">
            {{DEVICE[preInfo.device]}}
        </el-form-item>
        <el-form-item class="pre-info-item" label="词包热度：">
            {{preInfo.totalPv}}
        </el-form-item>
        <el-form-item class="pre-info-item" label="推广时段：">
            {{SCHEDULE_TYPE[preInfo.scheduleType]}}
        </el-form-item>
        <el-form-item class="pre-info-item" label="服务时长：">
            {{preInfo.days}}天 <el-tag v-if="preInfo.days > 30">赠送钻石官网（{{preInfo.days}}天）</el-tag>
        </el-form-item>
        <el-form-item class="pre-info-item pre-info-price" label="提单价：">
            {{f2y(preInfo.price)}}元
        </el-form-item>
        <el-row class="pre-info-row">
            <el-col :span="7">
                <el-form-item class="pre-info-item" label="销售编号：">{{preInfo.saleId}}</el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item class="pre-info-item" label="客户手机号：">{{preInfo.mobile}}</el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item class="pre-info-item" label="客户uid：">{{preInfo.userBxId}}</el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="preOrder">确认，生成并复制提单链接</el-button>
    </span>
    </el-dialog>
</template>
<script>
import { f2y, getCnName } from 'util'
import { SCHEDULE_TYPE, DEVICE } from 'constant/bw-plus'
export default {
  name: 'pre-order-detail',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
      require: true
    },
    preInfo: {
      type: Object,
      default: () => {},
      require: true
    },
    allAreas: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data () {
    return {
      SCHEDULE_TYPE,
      f2y,
      DEVICE
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    preOrder () {
      this.$emit('preOrder')
    },
    citiesFormater (cities) {
      return cities.slice(0, 20).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > 20 ? `等${cities.length}个城市` : '') || '-'
    }
  }
}
</script>
<style lang="scss" scoped>
    .pre-info-item{
        margin-bottom: 0;
        font-size: 16px;
        font-weight: 500;
    }
    .pre-info-row{
        border-bottom: 1px solid #ddd;
        border-top: 1px solid #ddd;
        padding: 10px 0;
        margin-top: 10px;
        font-size: 16px;
        font-weight: 500;
    }
    .pre-info-price{
        color: crimson;
    }
</style>
