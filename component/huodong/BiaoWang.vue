<template>
  <div>
    <section>
      <h3 class="title">标王折上折</h3>
      <div class="content">
        <p>购买任意关键词</p>
        <table>
          <tbody>
            <tr>
              <td>满<strong>5000-9999</strong></td>
              <td><span class="original">原价8.8折</span></td>
              <td><span>活动价<strong>8</strong>折</span></td>
            </tr>
            <tr>
              <td>满<strong>10000-14999</strong></td>
              <td><span class="original">原价8折</span></td>
              <td><span>活动价<strong>7</strong>折</span></td>
            </tr>
            <tr>
              <td>满<strong>15000及以上</strong></td>
              <td><span class="original">原价8折</span></td>
              <td><span>活动价<strong>7</strong>折</span>+<strong>赠送一年精品官网</strong></td>
            </tr>
            <tr>
              <td>
                <button @click="onClick" :disabled="status !== '进行中'">{{btnText}}</button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </section>
    <rules />
  </div>
</template>

<script>
import Rules from './Rules'
import { normalizeRoles } from 'util'
import track from 'util/track'

export default {
  name: 'biaowang',
  components: {
    Rules
  },
  props: {
    status: String,
    user: Object,
  },
  computed: {
    btnText() {
      return this.status === '预热中' ? '即将开始' : '立即抢购'
    },
    href() {
      return this.status === '进行中' ? 'http://www.baixing.com/pays/show?type=216&src=bax-huodong' : ''
    }
  },
  methods: {
    onClick() {
      if (this.status !== '进行中') { return }
      track({
        action: 'click-buy: huodong3',
        baxId: this.user.id
      })
      const roles = normalizeRoles(this.user.roles)
      if (roles.includes('BAIXING_SALES') || roles.includes('AGENT_SALES') || roles.includes('AGENT_ACCOUNTING')) {
        return alert('请通过米奇或指南车进入标王购买页面')
      }
      window.open('http://www.baixing.com/pays/show?type=216&src=bax-huodong')
    }
  },
  mounted() {
    setTimeout(() => {
      track({
        action: 'enter-page: huodong3',
        baxId: this.user.id
      })
    }, 1200)
  },
}
</script>

<style lang="postcss" scoped>
section {
  padding: 27px 13px 27px 35px;
  border-radius: 8px;
  color: #fff;
  background-color: #380098;
  margin-bottom: 20px;
  font-weight: lighter;

  & > .title {
    font-weight: lighter;
    margin-top: 0;
    margin-bottom: 16px;
    padding-bottom: 10px;
    font-size: 18px;
    border-bottom: 1px solid #5D00C6;
  }
  & > .content {
    font-size: 18px;
    display: flex;
    align-content: flex-start;

    & > p {
      margin-top: 4px;
      margin-right: 20px;
    }
    & > table td {
      padding: 0 10px 10px;
    }
    & > table strong {
      color: #FFD500;
      font-size: 20px;
      margin: 0 10px;
    }
    & > table span.original {
      text-decoration: line-through;
      color: #9B61FF;
      margin: 0 10px;
    }
    & > table button {
      display: inline-block;
      width: 110px;
      height: 32px;
      text-align: center;
      text-decoration: none;
      background-color: #FFD500;
      color: #5F00C9;
      font-size: 14px;
      font-weight: bold;
      margin-top: 50px;
      border-radius: 4px;
    }
    & > table button[disabled] {
      color: #666;
      background-color: #DBDBDB;
    }
  }
}
</style>
