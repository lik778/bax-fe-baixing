<template>
  <div class="promotion-list">
    <header>我的首页宝推广计划</header>

    <router-link :to="{name: 'seo-create-promotion'}"><el-button class="create" type="primary">新建首页宝计划</el-button></router-link>

    <div class="list-header">推广落地页</div>
    <ul v-loading="loading" class="list-content">
      <li v-for="(value, landing) in promotionsGroupByLanding" :key="landing" class="list-item">
        <div class="top-col" @click="currentLanding === landing ? currentLanding = '' : currentLanding = landing">
          <i
            class="icon"
            :class="landing === currentLanding ? 'el-icon-minus' : 'el-icon-plus'"
          />
          <p class="title">{{promotionsGroupByLanding[landing].name}}</p>
        </div>
        <div class="batch" v-if="landing === currentLanding" >
          <el-button :disabled="!canBatchOpen" @click="batchOpen" type="text">批量开启</el-button>
          <el-button :disabled="!canBatchClose" @click="batchClose" type="text">批量关闭</el-button>
        </div>
        <table v-if="landing === currentLanding" class="table-container">
          <thead>
            <th>多选</th>
            <th>计划id</th>
            <th><top-tip label="计划状态" tip="计划状态中待投放的状态解释：您有效的关键词推广计划不足4个，请至少创建4个关键词后开启投放" /></th>
            <th>关键词id</th>
            <th>关键词</th>
            <th>关键词来源</th>
            <th>投放平台</th>
            <th>创建时间</th>
            <th><top-tip label="当前排名" tip="前10名即认为在首页;10~100名表示在上浮中;100+表示仍需优化，超过30天100+可换词"/></th>
            <th><top-tip label="达标天数" tip="上首页即为达标，达标后产生扣费" /></th>
            <th>当前单价</th>
            <th>总扣款</th>
            <th>操作</th>
          </thead>
          <tbody v-if="!loading">
            <tr v-for="promotion in currentPromotions" :key="promotion.id">
              <td><el-checkbox :checked="checkedPromotions.includes(promotion)" @change="v => onCheck(promotion, v)" /></td>
              <td>{{promotion.name}}</td>
              <td>{{promotion.name}}</td>
              <td>{{promotion.name}}</td>
              <td>{{promotion.name}}</td>
              <td>{{promotion.name}}</td>
              <td>{{promotion.name}}</td>
              <td>{{promotion.name}}</td>
              <td>{{promotion.name}}</td>
              <td>{{promotion.name}}</td>
              <td>{{promotion.name}}</td>
              <td>{{promotion.name}}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </li>
    </ul>
  </div>
</template>

<script>
import TopTip from '../qwt-promotion-list/topTip'

export default {
  components: {
    TopTip
  },
  data() {
    return {
      promotionsGroupByLanding: {
        1: {
          name: '官网1',
          campaignIds: [1,2,3]
        },
        2: {
          name: '官网2',
          campaignIds: [4,5,6]
        },
        3: {
          name: '官网3',
          campaignIds: [7,8,9]
        }
      },
      checkedPromotions: [],
      currentLanding: '',
      currentPromotions: [],
      loading: false
    }
  },
  computed: {
    canBatchOpen() {
      return this.checkedPromotions.length && this.checkedPromotions.every(p => ['已下线、待投放、账户余额不足计划可以开'].includes(p))
    },
    canBatchClose() {
      return this.checkedPromotions.length && this.checkedPromotions.every(p => ['续期词、待投放、账户余额不足的计划可以关'].includes(p))
    }
  },
  methods: {
    onCheck(promotion, v) {
      if (v) {
        this.checkedPromotions.push(promotion)
      } else {
        const index = this.checkedPromotions.indexOf(promotion)
        this.checkedPromotions.splice(index, 1)
      }
    },
    batchOpen() {
      console.log(this.checkedPromotions)

    },
    batchClose() {
      console.log(this.checkedPromotions)

    }
  },
  watch: {
    currentLanding(v) {
      if (v) {
        this.loading = true
        setTimeout(() => {
          this.currentPromotions = [{id: 1, name: '1'}, {id: 2, name: '2'}, {id: 3, name: '3'}, {id: 4, name: '4'}]
          this.loading = false
        }, 1000)
      }
    }
  }
}
</script>


<style lang="postcss" scoped>
.promotion-list {
  color: #666;
  border-radius: 4px;
  margin-bottom: 10px;
  margin-left: 12px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 9px 0 rgba(83,95,127,.1);

  & > header {
    font-weight: bold;
    margin-bottom: 20px;
  }
  & .create {
    margin-bottom: 40px;
  }
}
.list-content {
  border-bottom: 1px solid #e9e9e9;
}
.list-header {
  text-indent: 18px;
  font-weight: 600;
  line-height: 38px;
  background-color: #FFEBC8;
}
.list-item {
  border-left: 1px solid #e9e9e9;
  border-right: 1px solid #e9e9e9;
  cursor: default;
  line-height: 38px;
  user-select: none;
  &:nth-of-type(2n) {
    background-color: #fafafa;
  }
  & .batch {
    margin-left: 40px;
  }
  & .top-col {
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
    & .icon {
      color: #63B2E4;
      font-size: 16px;
      display: inline-block;
      width: 42px;
      line-height: 38px;
      text-indent: 14px;
    }
    & .title {
      width: 33%;
      margin-right: 26px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  font-size: 14px;

  & > thead {
    font-weight: bold;
    & > th:first-of-type {
      padding-left: 40px;
    }
    & > th {
      padding-right: 20px;
    }
  }
  & > tbody {
    & td:first-of-type {
      padding-left: 40px;
    }
    & td {
      border-bottom: 1px solid #ddd;
    }
    & > tr::hover {
      background-color: #f0f0f0;
    }
  }
}
</style>
