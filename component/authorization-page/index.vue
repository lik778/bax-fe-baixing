<template>
  <div>
    <div class="authorization" v-if="isValidate === NORMAL">
        <h4>授权函</h4>
        <main>
            <p>为方便本人/本公司更有效地开展业务和使用百姓网提供的服务，特授权维护业务之贵司销售<span>{{info.optimizer_name}} （{{info.optimizer_id}}）</span>代为管理账户，由其统一管理。</p>
            <h5>1.授权范围：代指下列指定事项外所有操作</h5>
            <p>
                (1)可通过由本人/本公司告知的账户、密码进行登录；<br/>
                (2)经与本人/本公司业务员口头、微信或书面等沟通后管理发布信息；<br/>
                (3)可通过后台对授权账户的数据进行查看；<br/>
            </p>
            <h5>2.禁止性行为：</h5>
            <p>
                (1) 修改QQ号码、手机号码及相关密码；<br/>
                (2) 解绑身份证、营业执照、资质证书 （绑定除外）；<br/>
                (3) 绑定及解绑芝麻信用、支付宝、微信、微博、邮箱、固定电话及公司邮箱；<br/>
                (4) 删除帖子；<br/>
            </p>
            <h5>3授权期限：</h5>
            <p>自本授权书生效之日起至账户推广服务期限到期或后台取消授权为止</p>
            <h5>4.确认：</h5>
            <p>本人/本公司确认以上授权系完全自愿，是本人的真实表达意思，且明确知悉上述行为可能带来的事实行为，愿意承担由此产生的一切法律后果。</p>
            <h5>5.生效：</h5>
            <p>本授权书自本人/本公司点击确认提交系统后即生效。</p>
            <p>授权方：{{info.client_mobile}}（账号：{{info.client_id}}）</p>
            <p>说明：授权函有效时间为72小时，超时后授权函将自动失效。</p>
            <footer>
                <button class="info" @click="refuse">拒绝</button>
                <button class="primary" @click="shouquan">授权</button>
            </footer>
        </main>
    </div>
    <transition name="fade">
      <result v-if="isValidate === FINISH" @goHome="goHome" :type="type" :text="text"/>
    </transition>
  </div>
</template>
<script>
import { checkUrlValid, authorize, rejectAuthorize } from 'api/fengming'
import result from './components/result.vue'
const NORMAL = 'normal'
const WATING = 'await'
const FINISH = 'finish'
export default {
  name: 'authorization-page',
  components: { result },
  data () {
    return {
      info: {},
      isValidate: WATING,
      FINISH,
      NORMAL,
      WATING,
      error: '',
      type: 'error',
      visible: false,
      text: 'hello'
    }
  },
  async mounted () {
    await this.getInfo()
  },
  methods: {
    async getInfo () {
      const userId = this.getQueryParam('user_id')
      const optimizerId = this.getQueryParam('optimizer_id')
      try {
        const { data } = await checkUrlValid({ userId, optimizerId })
        this.isValidate = NORMAL
        this.info = data
      } catch (error) {
        this.isValidate = FINISH
        this.text = '抱歉，服务器开小差了！'
        this.type = 'error'
      }
    },
    async shouquan () {
      const userId = this.getQueryParam('user_id')
      const code = this.getQueryParam('code')
      const optimizerId = this.getQueryParam('optimizer_id')
      try {
        const { meta } = await authorize({ userId, code, optimizerId })
        this.isValidate = FINISH
        if (meta.code === 0) {
          this.text = '恭喜，您已授权成功！'
          this.type = 'success'
        } else {
          this.isValidate = FINISH
          this.text = '抱歉，授权失败！'
          this.type = 'error'
        }
      } catch (error) {
        this.isValidate = FINISH
        this.text = '抱歉，服务器开小差了！'
        this.type = 'error'
      }
    },
    getQueryParam (key) {
      const queryList = window.location.search.substring(1).split('&')
      for (let i = 0; i < queryList.length; i++) {
        const pair = queryList[i].split('=')
        if (pair[0] === key) { return pair[1] }
      }
    },
    async refuse () {
      const userId = this.getQueryParam('user_id')
      const code = this.getQueryParam('code')
      const optimizerId = this.getQueryParam('optimizer_id')
      try {
        const { meta: { code: status } } = await rejectAuthorize({ userId, code, optimizerId })
        this.isValidate = FINISH
        if (status === 0) {
          this.text = '您已拒绝授权！'
          this.type = 'success'
        } else {
          this.text = '抱歉，服务器开小差了！'
          this.type = 'error'
        }
      } catch (error) {
        this.isValidate = FINISH
        this.text = '抱歉，服务器开小差了！'
        this.type = 'error'
      }
    },
    goHome () {
      window.location.href = 'https://www.baixing.com'
    }
  }
}
</script>
<style lang="scss" scoped>
    .authorization{
        padding: 30px 20px;
        width: 100%;
        box-sizing: border-box;
        h4{
           text-align: center;
           margin-bottom: 10px;
           font-size: 18px;
        }
        p{
            line-height: 24px;
            font-size: 14px;
        }
        h5{
            margin: 10px 0;
        }
    }
    footer{
        display: flex;
        justify-content: center;
        align-items: center;
        button{
            outline: none;
            color: #FFFFFF;
            border: none;
            font-size: 14px;
            border-radius: 4px;
            width: 100px;
            height: 40px;
            margin: 10px;
            cursor: pointer;
        }
        .info{
            background: #909399;
        }
        .primary{
            background: #409EFF;
        }
    }
    .tips{
      font-size: 16px;
    }
</style>
