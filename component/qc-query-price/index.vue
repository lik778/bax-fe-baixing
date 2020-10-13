<template>
  <div class="bg">
    <div class="white-bg">
      <main>
        <el-form :model="form" :rules="rules" label-width="120px" ref="form" label-position="left" class="form" @submit.native.prevent>
          <el-form-item label="核心关键词" prop="keyword">
            <el-input v-model="form.keyword" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="推广区域" prop="areas">
            <el-tag type="success" closable class="kw-tag"
                    v-for="area in form.areas" :key="area"
                    @close="removeArea(area)">
            </el-tag>
            <i class="el-icon-plus" @click="areaDialogVisible = true"></i>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary">检查</el-button>
          </el-form-item>
        </el-form>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "qc-query-price",
  data() {
    return {
      form: {
        keyword: '',
        areas: []
      },
      rules: {
        keyword: [{required: true, message: '请填写推广关键词'}],
        areas: [{type: 'array', required: true, trigger: 'change', message: '请选择推广区域'}]
      },
      loading: false
    }
  },
  methods: {
    queryPrice() {
      console.log('检查')
    }
  }
}
</script>

<style lang="postcss" scoped>
div.bg {
  & > .white-bg {
      background-color: #fff;

  & > main {
      box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, .1);
      min-height: 700px;
      padding: 45px 60px;
    }
  }
}
</style>
