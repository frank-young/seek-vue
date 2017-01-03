<template>
	<div class="back">
		<i class="icon-arrow_lift" @click="back"></i>
		<span class="back-txt">{{text}}</span>
	</div>
</template>

<script>
export default {
	props: {
		text: {
			type: String
		}
	},
	methods: {
		back() {
			window.local.go(-1)
		}
	}
}
</script>

<style lang="less">
	.back{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-color: #00a0dc;
		i{
			display: inline-block;
			font-size: 24px;
			padding: 10px;
			margin-right: 10px;
			color: #fff;
		}
		.back-txt {
			font-size: 16px;
			color: #fff
		}
	}
</style>
