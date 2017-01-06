<template>
	<div class="sendcode" v-show="showFlag">
		<div class="code-wrap">
			<div class="code-input">
				<input type="text" placeholder="请输入手机号">
			</div>
			<div class="code-btn">
				<button type="button" class="btn">发送验证码</button>
				<!-- <button class="btn">（60s）重新发送</button> -->
			</div>
		</div>
		<div class="code-very">
			<input type="text" placeholder="验证码">
		</div>
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
		},
		hide() {
			this.showFlag = false
		}
	}
}
</script>

<style lang="less">
	.sendcode {
		padding: 10px 15px 20px 15px;
		.code-wrap{
			display: flex;
		}
		.code-input,
		.code-very {
			flex: 1;
			input {
				display: block;
				width: 100%;
				box-sizing: border-box;
				padding: 5px 10px;
				outline: none;
				border: 1px solid #ddd;
				font-size: 13px;
			}
		}
		.code-very{
			margin-top: 10px;
			input{
				width: 120px;
			}
		}
		.code-btn {
			flex: 0 0 125px;
			width: 125px;
			text-align: right;
			button {
				height: 28px;
				padding: 0 10px;
				line-height: 12px;
				display: inline-block;
				background-color: rgb(252, 97, 32);
				border: 0;
				font-size: 12px;
				color: #fff;
				outline: none;
			}
		}
	}
</style>
