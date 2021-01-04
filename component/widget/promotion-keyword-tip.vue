<template>
	<el-tooltip effect="dark"
							content="请注意，否词和关键词不能重复"
							placement="top-start">
		<i class="el-icon-question"></i>
	</el-tooltip>
</template>

<script>
export default {
	name: 'PromoteKeywordTip'
}
</script>

<style lang="scss" scoped>
.el-icon-question {
  cursor: pointer;
}
</style>
