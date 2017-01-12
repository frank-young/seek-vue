<template>
	<div class="success">
		<div class="success-close">
			<i class="icon-close" @click="close"></i>
			<span class="close-txt">{{text}}</span>
		</div>
		<div class="success-content">
			<div class="success-icon">
				<i class="icon-order"></i>
			</div>
			<div class="success-text">
				<h3>下单成功</h3>
				<p>我们正尽快为您准备</p>
			</div>
		</div>
		<p class="success-info">如对此订单有疑问，请联系服务员</p>
		<div class="success-btn-group">
			<button class="btn" type="button" @click="close">返回首页</button>
			<button class="btn" type="button" @click="order">查看订单</button>
		</div>
	</div>
</template>

<script>
export default {
	props: {
	},
	data() {
		return {
			text: '下单成功'
		}
	},
	methods: {
		close() {
			this.$router.push({name: 'start'})
		},
		order() {
			this.$router.push({name: 'order'})
		}
	},
	components: {
	}
}
</script>

<style lang="less">
	.success {
		position: fixed;
		left: 0;
		top: 48px;
		width: 100%;
		height: 100%;
		z-index: 60;
		background-color: #fff;
		.success-close{
			width: 100%;
			height: 48px;
			line-height: 48px;
			background-color: #3290e8;
			i{
				display: inline-block;
				font-size: 24px;
				padding: 12px 10px 12px 20px;
				margin-right: 10px;
				color: #fff;
			}
			.close-txt {
				display: inline-block;
				vertical-align: top;
				font-size: 16px;
				color: #fff
			}	
		}
		
		.success-content{
			display: flex;
			margin-top: 40px;
		}
		.success-icon {
			flex: 2;
			text-align: right;
			margin-right: 20px;
			i {
				font-size: 60px;
				color: #3dba84;
			}
		}
		.success-text {
			flex: 3;
			h3 {
				font-size: 18px;
				margin-top: 10px;
				margin-bottom: 10px;
				color: #333;
			}
			p{
				font-size: 14px;
				color: #888;
			}
		}
		.success-info{
			margin-top: 15px;
			font-size: 12px;
			color: #555;
			text-align: center;
		}
		.success-btn-group{
			display: flex;
			padding: 0 20px;
			margin-top: 30px;
			.btn{
				flex: 1;
				margin: 5px;
				padding: 8px;
				font-size: 15px;
				border-radius: 2px;
				border: 1px solid #ddd;
				background-color: #fff;
				color: #555;
				outline: none;
			}
		}
	}
</style>









