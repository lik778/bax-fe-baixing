<template>
  <div>
    <section>
      <div class="tehui">
        <img src="http://file.baixing.net/201811/889923e16034e6124ca6a619155ba04a.png" alt="">
        <div class="pics">
          <img src="http://file.baixing.net/201811/e599da7ca93f5318ab763eb8b7686850.png" alt="">
          <img src="http://file.baixing.net/201811/9978cf6a9464544c0508414886e99316.png" alt="">
          <img src="http://file.baixing.net/201811/d2d714d3d00f2a1d06d5b7dfd42893bf.png" alt="">
        </div>

        <div class="content">
          <p>买标王送官网</p>
          <table>
            <tbody>
              <tr>
                <td>满<strong>500-4999</strong></td>
                <td>送一年精品官网</td>
                <td><span><strong class="mr">200元</strong>直减券</span></td>
              </tr>
              <tr>
                <td>满<strong>5000-9999</strong></td>
                <td>送一年精品官网</td>
                <td><span><strong class="mr">600元</strong>直减券</span></td>
              </tr>
              <tr>
                <td>满<strong>10000及以上</strong></td>
                <td>送一年精品官网</td>
                <td><span><strong class="mr">1000元</strong>直减券</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <button @click="onClick" :disabled="status !== '进行中'">{{btnText}}</button>
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
  background-color: #9B0060;
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
  & > div {
    & > button {
      display: inline-block;
      width: 240px;
      height: 60px;
      text-align: center;
      text-decoration: none;
      background-color: #FFD500;
      color: #5F00C9;
      font-size: 24px;
      font-weight: bold;
      margin-top: 50px;
      border-radius: 4px;
    }
    & > button[disabled] {
      color: #666;
      background-color: #DBDBDB;
    }
    & > .content {
      align-self: flex-start;
      font-size: 18px;
      display: flex;
      align-content: flex-start;
     & small {
      font-size: .7em;
     }

      & > p {
        margin-top: 4px;
        margin-right: 20px;
        margin-left: 100px;
      }
      & > table td {
        padding: 0 10px 10px;
      }
      & > table strong {
        color: #FFD500;
        font-size: 20px;
        margin: 0 10px;
        &.mr {
          margin-left: -10px;
        }
      }
      & > table span.original {
        text-decoration: line-through;
        color: #9B61FF;
        margin: 0 10px;
      }
    }
  }

}
.tehui {
  display: flex;
  flex-direction: column;
  align-items: center;
  & > img {
    margin-bottom: 27px;
  }
}
.pics {
  width: 900px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 46px;
}
</style>
