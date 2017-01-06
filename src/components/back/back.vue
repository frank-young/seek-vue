<template>
	<div class="back">
		<i class="icon-arrow_lift" @click="back"></i>
		<span class="back-txt">{{text}}</span>
	</div>
</template>

<script>
import VueRouter from 'vue-router'

const router = new VueRouter({})

export default {
	props: {
		text: {
			type: String
		}
	},
	methods: {
		back() {
			router.go(-1)
			console.log('back')
		}
	}
}
</script>

<style lang="less">
	.back{
		width: 100%;
		height: 48px;
		line-height: 48px;
		background-color: #3290e8;
		i{
			display: inline-block;
			font-size: 14px;
			padding: 10px 10px 10px 20px;
			margin-right: 10px;
			color: #fff;
		}
		.back-txt {
			font-size: 16px;
			color: #fff
		}	
	}
</style>
