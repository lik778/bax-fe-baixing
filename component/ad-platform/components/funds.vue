<template>
    <ul>
      <li>
        <span>今日消耗（元）</span>
        <span>{{f2y(founds.cost)}}</span>
      </li>
      <li>
        <span>账户余额（元）</span>
        <span>{{f2y(founds.balance)}}</span>
      </li>
      <li>
        <span>累计充值（元）</span>
        <span>{{f2y(founds.amount)}}</span>
      </li>
    </ul>
</template>
<script>
import { f2y } from 'util'
export default {
  name: 'founds',
  props: {
    founds: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  data () {
    return {
      f2y
    }
  }
}
</script>
<style lang="scss" scoped>
   ul{
            padding: 0;
            display: flex;
            padding: 20px;
            background: #eee;
            margin-bottom: 30px;
            li{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                &:nth-child(2){
                    margin: 0 30px;
                }
                span:nth-child(1){
                    margin-bottom: 10px;
                }
                span:nth-child(2){
                    color: #ff4f49;
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }
</style>
