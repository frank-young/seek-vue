<template>
	<div class="aletmsg" v-show="showFlag">
		<i class="icon-checked"></i>
		<p>{{text}}</p>
	</div>
</template>

<script>
export default {
	props: {
		text: {
			type: String
		}
	},
	data() {
		return {
			showFlag: false
		}
	},
	methods: {
		show() {
			this.showFlag = true
			setTimeout(() => {
				this.showFlag = false
			}, 2000)
		}
	}
}
</script>

<style lang="less">
	.aletmsg{
		position: fixed;
		top: 50%;
		left: 50%;
		width: 80px;
		height: 70px;
		margin-top: -60px;
		margin-left: -60px;
		border-radius: 10px;
		padding: 20px;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.5);
		i{
			margin-left: 10px;
			font-size: 35px;
			color: #fff;
		}
		p{
			margin-top: 15px;
			display: block;
			font-size: 16px;
			color: #fff;
			text-align: center;
		}
	}
</style>
